// routes/ticket-types.ts
import { Router, Request, Response } from 'express';
import { PrismaClient, TicketType, ApprovalStatus, UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod';
import { prisma } from '../lib/db';


const router = Router();

const ticketTypeSchema = z.object({
    name: z.string().min(1),
    type: z.nativeEnum(TicketType),
    price: z.number().positive(),
    description: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    salesStart: z.string().datetime().optional(),
    salesEnd: z.string().datetime().optional(),
    minPerOrder: z.number().int().positive().optional(),
    maxPerOrder: z.number().int().positive().optional()
});

// Create ticket type (ORGANIZER)
router.post('/', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const data = ticketTypeSchema.parse(req.body);
        const event = await prisma.event.findUnique({
            where: { id: req.body.eventId },
            select: { organizerId: true }
        });

        if (!event || event.organizerId !== req.user!.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const ticketType = await prisma.ticketTypeConfig.create({
            data: {
                ...data,
                eventId: req.body.eventId,
                salesStart: data.salesStart ? new Date(data.salesStart) : undefined,
                salesEnd: data.salesEnd ? new Date(data.salesEnd) : undefined,
                status: ApprovalStatus.PENDING
            }
        });

        res.status(201).json(ticketType);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Get ticket types for event
router.get('/event/:eventId', async (req, res) => {
    try {
        const ticketTypes = await prisma.ticketTypeConfig.findMany({
            where: {
                eventId: req.params.eventId,
                status: ApprovalStatus.APPROVED
            }
        });
        res.json(ticketTypes);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export { router };