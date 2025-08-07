import { Router, Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { prisma } from '../lib/db';


const router = Router();

router.get('/events/:eventId', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.eventId },
            include: { tickets: true }
        });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (event.organizerId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });

        const totalTickets = event.tickets.length;
        const soldTickets = event.tickets.filter(t => t.status === 'VALID' || t.status === 'SCANNED').length;
        const revenue = event.tickets.reduce((sum, t) => sum + (t.status === 'VALID' || t.status === 'SCANNED' ? t.price : 0), 0);

        res.json({
            eventId: event.id,
            eventName: event.name,
            totalTickets,
            soldTickets,
            revenue
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export { router };