import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:4000/auth/google/callback'
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
                    password: '' // No password for social login
                }
            });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        await prisma.session.create({
            data: { userId: user.id, token, platform: 'WEB', expiresAt: new Date(Date.now() + 3600000) } // 1 hour expiry
        });

        await prisma.auditLog.create({
            data: { userId: user.id, action: 'LOGIN', entityType: 'USER', entityId: user.id }
        });

        res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export { router };