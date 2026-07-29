import { Router, Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { redis } from '../lib/redis';
import jwt from 'jsonwebtoken';

const router = Router();

/** Lightweight auth middleware for any logged-in user */
async function requireAuth(
  req: Request & { user?: { userId: string; role: UserRole } },
  res: Response,
  next: NextFunction
) {
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
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/)
    .optional()
    .or(z.literal('')),
  profilePhoto: z.string().url().optional().nullable(),
});

// Get current user profile
router.get(
  '/me',
  requireAuth,
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          profilePhoto: true,
          isVerified: true,
          company: true,
          createdAt: true,
        },
      });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// Update user profile
router.put(
  '/me',
  requireAuth,
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const data = userUpdateSchema.parse(req.body);
      const updatedUser = await prisma.user.update({
        where: { id: req.user!.userId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.phone !== undefined && { phone: data.phone || null }),
          ...(data.profilePhoto !== undefined && { profilePhoto: data.profilePhoto }),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          profilePhoto: true,
          isVerified: true,
          company: true,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Admin-only: Get all users
router.get('/', requireRole([UserRole.SUPER_ADMIN]), async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export { router };
