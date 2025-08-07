import { Router, Request, Response } from 'express';
import { PrismaClient, TicketStatus, UserRole } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from './auth';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { redis, safeRedisGet } from '../lib/redis';
import { io } from '../index'; import { prisma } from '../lib/db';


const router = Router();

const ticketSchema = z.object({
    eventId: z.string(),
    ticketTypeId: z.string().min(1),
    price: z.number().positive()
});

// Create ticket (ORGANIZER only)
router.post('/', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const { eventId, ticketTypeId, price } = ticketSchema.parse(req.body);
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (event.organizerId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });

        const ticketNumber = uuidv4();
        const qrCode = await QRCode.toDataURL(ticketNumber);

        const ticket = await prisma.ticket.create({
            data: {
                ticketNumber,
                qrCode,
                status: TicketStatus.PENDING,
                eventId,
                ticketTypeId,
                price,
                originalPrice: price
            }
        });
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// List tickets for an event (public)
router.get('/event/:eventId', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { eventId: req.params.eventId },
            select: {
                id: true,
                ticketNumber: true,
                ticketType: { select: { name: true } },
                price: true,
                status: true
            }
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Purchase ticket (ATTENDEE only)
router.post('/:id/purchase', requireRole([UserRole.ATTENDEE]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        if (ticket.status !== TicketStatus.PENDING) return res.status(400).json({ error: 'Ticket not available' });

        const updatedTicket = await prisma.ticket.update({
            where: { id: req.params.id },
            data: {
                ownerId: req.user!.userId,
                status: TicketStatus.VALID
            }, include: { event: true }
        });
        await redis.setEx(`ticket:${ticket.ticketNumber}`, 3600 * 24, TicketStatus.VALID); // Cache for 24 hours
        res.json(updatedTicket);
        io.to(UserRole.ORGANIZER).emit('ticketPurchased', {
            eventId: updatedTicket.eventId,
            ticketId: updatedTicket.id,
            ticketNumber: updatedTicket.ticketNumber
        }); res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Validate ticket (GATE_OPERATOR only)
router.post('/:id/validate', requireRole([UserRole.GATE_OPERATOR]), async (req, res) => {
    try {
        const ticketNumber = req.body.ticketNumber;
        const cachedStatus = await safeRedisGet(`ticket:${ticketNumber}`);
        if (cachedStatus && cachedStatus !== TicketStatus.VALID) {
            return res.status(400).json({ error: 'Ticket invalid or already scanned' });
        }

        const ticket = await prisma.ticket.findUnique({ where: { ticketNumber } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        if (ticket.status !== TicketStatus.VALID) {
            await redis.setEx(`ticket:${ticketNumber}`, 3600 * 24, ticket.status);
            return res.status(400).json({ error: 'Ticket invalid or already scanned' });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { ticketNumber },
            data: { status: TicketStatus.SCANNED }
        });
        await redis.setEx(`ticket:${ticketNumber}`, 3600 * 24, TicketStatus.SCANNED);
        io.to(UserRole.GATE_OPERATOR).emit('ticketValidated', {
            eventId: updatedTicket.eventId,
            ticketId: updatedTicket.id,
            ticketNumber: updatedTicket.ticketNumber
        });
        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export { router }; 