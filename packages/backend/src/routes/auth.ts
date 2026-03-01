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

// Create window for DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Configure allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  process.env.FRONTEND_URL || 'http://localhost:3000'
];

router.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts, please try again in 15 minutes'
    });
  }
});

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

// Helper to check if in production
const isProduction = process.env.NODE_ENV === 'production';

// Export schemas for potential frontend sharing
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .transform(val => val.toLowerCase().trim())
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number')
    .max(20, 'Phone number must be less than 20 characters')
    .transform(val => val.replace(/\s/g, ''))
    .optional()
    .or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone must be provided',
  path: ['email'],
});

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .transform(val => val.toLowerCase().trim()),
  phone: z.string()
    .regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number')
    .max(20, 'Phone number must be less than 20 characters')
    .transform(val => val.replace(/\s/g, ''))
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['ATTENDEE', 'ORGANIZER', 'VENDOR', 'GATE_OPERATOR']),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  company: z.string()
    .max(200, 'Company name must be less than 200 characters')
    .optional()
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone must be provided',
  path: ['email'],
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const registerApiSchema = registerSchema.omit({ confirmPassword: true });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterApiData = z.infer<typeof registerApiSchema>;

router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    // Sanitize input first
    const sanitizedBody = sanitizeInput(req.body);
    const { name, email, phone, password, role, termsAccepted, company } = registerApiSchema.parse(sanitizedBody);

    if (!termsAccepted) {
      return res.status(400).json({ error: 'You must accept the terms and conditions' });
    }

    // Ensure email is provided (since it's now required)
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    logger.info(`Registering user: ${email || phone}`);
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone: phone ?? undefined }] }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or phone already exists' });
    }

    const user = await prisma.user.create({
      data: {
        name: name, // No longer needs fallback since it's required
        email,     // No longer needs fallback since it's required
        phone,
        password: hashedPassword,
        role: role,
        signupMethod: email && phone ? 'EMAIL_PHONE' : email ? 'EMAIL_ONLY' : 'PHONE_ONLY',
        company: company || null
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
      issuer: 'Eswatini Events'
    });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
      issuer: 'Eswatini Events'
    });

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        platform: 'WEB',
        expiresAt: new Date(Date.now() + 3600000)
      }
    });
    await redis.setEx(`session:${token}`, 3600, user.id);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entityType: 'USER',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    logger.info(`User registered: ${user.id}`);

    res.json({
      token,
      refreshToken,
      user: { id: user.id, email, phone, role: user.role }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({
      error: isProduction ? 'Registration failed' : (error as Error).message
    });
  }
});

router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    // Sanitize input first
    const sanitizedBody = sanitizeInput(req.body);
    const { email, phone, password } = loginSchema.parse(sanitizedBody);

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }] }
    });

    if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
      await prisma.auditLog.create({
        data: {
          userId: user?.id || null,
          action: 'LOGIN_FAILED',
          entityType: 'USER',
          entityId: user?.id || null,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: `Failed login attempt for: ${email || phone}`
        }
      });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
      issuer: 'Eswatini Events'
    });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
      issuer: 'Eswatini Events'
    });

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        platform: 'WEB',
        expiresAt: new Date(Date.now() + 3600000),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    await redis.setEx(`session:${token}`, 3600, user.id);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({
      token,
      refreshToken,
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({
      error: isProduction ? 'Login failed' : (error as Error).message
    });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  let token = req.headers.authorization;

  if (!token) {
    // Also check for token in cookies
    token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Remove 'Bearer ' prefix if present
    token = token.replace('Bearer ', '');
    const userId = await redis.get(`session:${token}`);

    if (!userId) return res.status(401).json({ error: 'Invalid or expired session' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: UserRole };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, profilePhoto: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.replace('Bearer ', '');

  try {
    // Delete from both Redis and database
    await Promise.all([
      redis.del(`session:${token}`),
      prisma.session.deleteMany({
        where: { token }
      })
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
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const session = await prisma.session.findFirst({
      where: { refreshToken, userId: decoded.userId },
      include: { user: true }
    });

    if (!session) return res.status(401).json({ error: 'Invalid refresh token' });

    const token = jwt.sign({ userId: session.user.id, role: session.user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
      issuer: 'Eswatini Events'
    });
    const newRefreshToken = jwt.sign({ userId: session.user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
      issuer: 'Eswatini Events'
    });

    await prisma.session.update({
      where: { id: session.id },
      data: { token, refreshToken: newRefreshToken }
    });
    await redis.setEx(`session:${token}`, 3600, session.user.id);

    res.json({
      token,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
      user: {
        id: session.user.id,
        email: session.user.email,
        phone: session.user.phone,
        role: session.user.role,
        isVerified: session.user.isVerified,
        profilePhoto: session.user.profilePhoto
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export function requireRole(roles: UserRole[]) {
  return async (req: Request & { user?: { userId: string; role: UserRole } }, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    try {
      const token = authHeader.replace('Bearer ', '');
      const userId = await redis.get(`session:${token}`);
      if (!userId) return res.status(401).json({ error: 'Invalid or expired session' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: UserRole };
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export { router };