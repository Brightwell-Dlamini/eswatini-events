import { Router } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';
import { redis } from '../lib/redis';

const router = Router();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.FRONTEND_URL}/auth/google/callback`
);

router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    scope: ['email', 'profile']
  });
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code as string);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    let user = await prisma.user.findUnique({ where: { email: data.email! } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email!,
          role: 'ATTENDEE',
          signupMethod: 'SOCIAL',
          password: ''
        }
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    await prisma.session.create({
      data: { userId: user.id, token, platform: 'WEB', expiresAt: new Date(Date.now() + 3600000) }
    });
    await redis.setEx(`session:${token}`, 3600, user.id);

    await prisma.auditLog.create({
      data: { userId: user.id, action: 'LOGIN', entityType: 'USER', entityId: user.id }
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?error=authentication_failed`);
  }
});

export { router };