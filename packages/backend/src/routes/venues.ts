// routes/venues.ts
import { Router, Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod';
import { prisma } from '../lib/db';


const router = Router();

const venueSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    capacity: z.number().int().positive(),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().default('Eswatini'),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
    images: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional()
});

// Create venue (VENUE_MANAGER)
router.post('/', requireRole([UserRole.VENUE_MANAGER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const data = venueSchema.parse(req.body);
        const venue = await prisma.venue.create({
            data: {
                ...data,
                managerId: req.user!.userId
            }
        });
        res.status(201).json(venue);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Get venues
router.get('/', async (req, res) => {
    try {
        const venues = await prisma.venue.findMany({
            where: { isApproved: true }
        });
        res.json(venues);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export { router };