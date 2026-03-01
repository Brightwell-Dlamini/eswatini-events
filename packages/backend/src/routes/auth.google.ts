import { Router } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';
import { redis } from '../lib/redis';
import logger from '../lib/logger';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const router = Router();

// Create window for DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Input sanitization function
function sanitizeInput(data: any): any {
  const sanitized: any = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = purify.sanitize(data[key].trim());
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
}

// Google OAuth schema validation
const googleUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  picture: z.string().url().optional().nullable(),
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.FRONTEND_URL}/auth/google/callback`
);



// Store OAuth states to prevent CSRF (in production, use Redis)
const oauthStates = new Map<string, { createdAt: Date; used: boolean }>();
// Clean up old states every 10 minutes
setInterval(() => {
  const now = new Date();
  for (const [state, data] of oauthStates.entries()) {
    if (now.getTime() - data.createdAt.getTime() > 10 * 60 * 1000) {
      oauthStates.delete(state);
    }
  }
}, 10 * 60 * 1000);

router.get('/google', (req, res) => {
  try {
    // Generate state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    oauthStates.set(state, { createdAt: new Date(), used: false });
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email', 'openid'],
      state: `${state}|${timestamp}`,
      prompt: 'consent',
      include_granted_scopes: true
    });
    logger.info(`Initiating Google OAuth flow with state: ${state}`);
    res.redirect(url);
  } catch (error) {
    logger.error('Google OAuth initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate Google OAuth' });
  }
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code, state, error: oauthError } = req.query;
    if (oauthError) {
      logger.warn(`Google OAuth error: ${oauthError}`);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_oauth_denied`);
    }
    if (!code || typeof code !== 'string') {
      logger.error('Google callback missing code parameter');
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=invalid_oauth_code`);
    }
    // Validate state parameter
    if (state && typeof state === 'string') {
      const [stateToken, timestamp] = state.split('|');
      const stateData = oauthStates.get(stateToken);
      if (!stateData || stateData.used) {
        logger.warn('Invalid or reused OAuth state parameter');
        return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=invalid_oauth_state`);
      }
      stateData.used = true;
      oauthStates.delete(stateToken);
    }


    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.id_token) {
      throw new Error('No ID token received from Google');
    }
    oauth2Client.setCredentials(tokens);

    // Verify the ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token payload');
    }

    // Validate and sanitize user data
    const sanitizedData = sanitizeInput({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
    const validatedData = googleUserSchema.parse(sanitizedData);
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: validatedData.name || 'Google User',
          email: validatedData.email,
          role: 'ATTENDEE',
          signupMethod: 'SOCIAL',
          password: '',
          isVerified: true,
          profilePhoto: validatedData.picture || null,
          emailVerified: new Date(),
        },
      });

      logger.info(`New user created via Google OAuth: ${user.email}`);
      // Create welcome audit log for new users
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'REGISTER',
          entityType: 'USER',
          entityId: user.id,
          details: 'Registered via Google OAuth',
        },
      });
    }

    // Generate JWT tokens
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        authMethod: 'google'
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
        issuer: 'Eswatini Events'
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: '7d',
        issuer: 'Eswatini Events'
      }
    );

    // Create session in database
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        platform: 'WEB',
        expiresAt: new Date(Date.now() + 3600000),
        authMethod: 'GOOGLE',
      },
    });

    // Store session in Redis
    await redis.setEx(`session:${token}`, 3600, user.id);
    await redis.setEx(`refresh:${refreshToken}`, 7 * 24 * 3600, user.id);

    // Create login audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: user.id,
        details: 'Logged in via Google OAuth',
      },
    });
    logger.info(`Google login successful for user: ${user.email}`);

    // Redirect with tokens as query parameters
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/google/callback`);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('refreshToken', refreshToken);
    redirectUrl.searchParams.set('userId', user.id);
    res.redirect(redirectUrl.toString());
  } catch (error) {
    logger.error('Google OAuth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/google/callback`);
    redirectUrl.searchParams.set('error', 'authentication_failed');
    redirectUrl.searchParams.set('message', encodeURIComponent(errorMessage));
    res.redirect(redirectUrl.toString());
  }
});

// Additional endpoint to handle frontend token validation
router.post('/google/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }
    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      authMethod: string;
    };

    // Check if session exists in Redis
    const userId = await redis.get(`session:${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        profilePhoto: true
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      valid: true,
      user,
      token, // Return the same token if still valid
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});



export { router };