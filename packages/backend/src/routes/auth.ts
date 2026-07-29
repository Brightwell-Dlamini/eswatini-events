import { Router, Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { redis } from '../lib/redis';
import logger from '../lib/logger';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const router = Router();

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  process.env.FRONTEND_URL || 'http://localhost:3000',
];

router.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts, please try again in 15 minutes',
    });
  },
});

function sanitizeInput(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = purify.sanitize((data[key] as string).trim());
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
}

const isProduction = process.env.NODE_ENV === 'production';

export const loginSchema = z
  .object({
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(255)
      .transform((val) => val.toLowerCase().trim())
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number')
      .max(20)
      .transform((val) => val.replace(/\s/g, ''))
      .optional()
      .or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone must be provided',
    path: ['email'],
  });

export const registerSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z
      .string()
      .email()
      .max(255)
      .transform((val) => val.toLowerCase().trim()),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/)
      .max(20)
      .transform((val) => val.replace(/\s/g, ''))
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['ATTENDEE', 'ORGANIZER', 'VENDOR', 'GATE_OPERATOR']),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    company: z.string().max(200).optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone must be provided',
    path: ['email'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const registerApiSchema = registerSchema.omit({ confirmPassword: true });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterApiData = z.infer<typeof registerApiSchema>;

function issueTokens(userId: string, role: UserRole) {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
    issuer: 'Eswatini Events',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
    issuer: 'Eswatini Events',
  });
  return { token, refreshToken, expiresIn: 3600 };
}

router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { name, email, phone, password, role, termsAccepted, company } =
      registerApiSchema.parse(sanitizedBody);

    if (!termsAccepted) {
      return res.status(400).json({ error: 'You must accept the terms and conditions' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone: phone || undefined }] },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or phone already exists' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role,
        signupMethod: email && phone ? 'EMAIL_PHONE' : email ? 'EMAIL_ONLY' : 'PHONE_ONLY',
        company: company || null,
      },
    });

    const { token, refreshToken, expiresIn } = issueTokens(user.id, user.role);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        platform: 'WEB',
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });
    await redis.setEx(`session:${token}`, expiresIn, user.id);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entityType: 'USER',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });

    res.json({
      token,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({
      error: isProduction ? 'Registration failed' : (error as Error).message,
    });
  }
});

router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { email, phone, password } = loginSchema.parse(sanitizedBody);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { phone: phone || undefined }],
      },
    });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      await prisma.auditLog.create({
        data: {
          userId: user?.id || null,
          action: 'LOGIN_FAILED',
          entityType: 'USER',
          entityId: user?.id || null,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: `Failed login attempt for: ${email || phone}`,
        },
      });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { token, refreshToken, expiresIn } = issueTokens(user.id, user.role);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        platform: 'WEB',
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });
    await redis.setEx(`session:${token}`, expiresIn, user.id);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });

    res.json({
      token,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({
      error: isProduction ? 'Login failed' : (error as Error).message,
    });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    token = token.replace('Bearer ', '');
    const userId = await redis.get(`session:${token}`);
    if (!userId) return res.status(401).json({ error: 'Invalid or expired session' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: UserRole;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        profilePhoto: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.replace('Bearer ', '');

  try {
    await Promise.all([
      redis.del(`session:${token}`),
      prisma.session.deleteMany({ where: { token } }),
    ]);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };
    const session = await prisma.session.findFirst({
      where: { refreshToken, userId: decoded.userId },
      include: { user: true },
    });

    if (!session) return res.status(401).json({ error: 'Invalid refresh token' });

    const tokens = issueTokens(session.user.id, session.user.role);

    await prisma.session.update({
      where: { id: session.id },
      data: { token: tokens.token, refreshToken: tokens.refreshToken },
    });
    await redis.setEx(`session:${tokens.token}`, tokens.expiresIn, session.user.id);

    res.json({
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
        role: session.user.role,
        isVerified: session.user.isVerified,
        profilePhoto: session.user.profilePhoto,
      },
    });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export function requireRole(roles: UserRole[]) {
  return async (
    req: Request & { user?: { userId: string; role: UserRole } },
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    try {
      const token = authHeader.replace('Bearer ', '');
      const userId = await redis.get(`session:${token}`);
      if (!userId) return res.status(401).json({ error: 'Invalid or expired session' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: UserRole;
      };
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export function verifyToken(token: string): { userId: string; role: UserRole } {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: UserRole };
}

export { router };
