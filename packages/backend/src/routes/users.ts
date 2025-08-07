// routes/users.ts
import { Router, Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod';
import { prisma } from '../lib/db';

const router = Router();

const userUpdateSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
    isVerified: z.boolean().optional()
});

// Get current user profile
router.get('/me', async (req: Request & { user?: { userId: string } }, res: Response) => {
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
                createdAt: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Update user profile
router.put('/me', async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const data = userUpdateSchema.parse(req.body);
        const updatedUser = await prisma.user.update({
            where: { id: req.user!.userId },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Admin-only: Get all users
router.get('/', requireRole([UserRole.SUPER_ADMIN]), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export { router };