import { Router, Request, Response } from 'express';
import { TicketStatus, UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { safeRedisGet, safeRedisSetEx } from '../lib/redis';
import { io } from '../index';
import logger from '../lib/logger';

const router = Router();

/**
 * GET /tickets/my
 * List tickets owned by the current user.
 */
router.get(
  '/my',
  requireRole([UserRole.ATTENDEE, UserRole.ORGANIZER, UserRole.GATE_OPERATOR]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const tickets = await prisma.ticket.findMany({
        where: { ownerId: req.user!.userId },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              startTime: true,
              endTime: true,
              address: true,
              city: true,
              imageUrl: true,
            },
          },
          ticketType: {
            select: { name: true, type: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * GET /tickets/event/:eventId
 * Organizer view of tickets sold for an event.
 */
router.get(
  '/event/:eventId',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: req.params.eventId },
        select: { organizerId: true },
      });
      if (!event || event.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const tickets = await prisma.ticket.findMany({
        where: { eventId: req.params.eventId },
        select: {
          id: true,
          ticketNumber: true,
          status: true,
          price: true,
          createdAt: true,
          ticketType: { select: { name: true } },
          owner: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /tickets/validate
 * Gate operator validates a ticket by ticketNumber (from QR scan or manual entry).
 * Idempotent: already-scanned tickets return a clear error.
 */
router.post(
  '/validate',
  requireRole([UserRole.GATE_OPERATOR, UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string; role: UserRole } }, res: Response) => {
    try {
      const schema = z.object({
        ticketNumber: z.string().min(1),
        eventId: z.string().optional(), // optional extra check
      });
      const { ticketNumber, eventId } = schema.parse(req.body);

      // Fast path via Redis cache
      const cached = await safeRedisGet(`ticket:${ticketNumber}`);
      if (cached === TicketStatus.SCANNED) {
        return res.status(400).json({ error: 'Ticket already scanned', status: 'SCANNED' });
      }
      if (cached && cached !== TicketStatus.VALID) {
        return res.status(400).json({ error: `Ticket is ${cached}`, status: cached });
      }

      const ticket = await prisma.ticket.findUnique({
        where: { ticketNumber },
        include: {
          event: { select: { id: true, name: true, startTime: true } },
          ticketType: { select: { name: true } },
          owner: { select: { name: true } },
        },
      });

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      if (eventId && ticket.eventId !== eventId) {
        return res.status(400).json({ error: 'Ticket does not belong to this event' });
      }

      if (ticket.status === TicketStatus.SCANNED) {
        await safeRedisSetEx(`ticket:${ticketNumber}`, 60 * 60 * 24 * 7, TicketStatus.SCANNED);
        return res.status(400).json({ error: 'Ticket already scanned', status: 'SCANNED' });
      }

      if (ticket.status !== TicketStatus.VALID) {
        await safeRedisSetEx(`ticket:${ticketNumber}`, 60 * 60 * 24 * 7, ticket.status);
        return res.status(400).json({
          error: `Ticket is not valid (current status: ${ticket.status})`,
          status: ticket.status,
        });
      }

      const updated = await prisma.ticket.update({
        where: { ticketNumber },
        data: { status: TicketStatus.SCANNED },
      });

      await safeRedisSetEx(`ticket:${ticketNumber}`, 60 * 60 * 24 * 7, TicketStatus.SCANNED);

      // Record scan for audit
      try {
        await prisma.scan.create({
          data: {
            ticketId: ticket.id,
            operatorId: req.user!.userId,
            eventId: ticket.eventId,
            isManual: false,
            isOffline: false,
          },
        });
      } catch (scanErr) {
        // Non-fatal — ticket is already marked scanned
        logger.warn('Failed to create Scan record', scanErr);
      }

      io.to(UserRole.ORGANIZER).emit('ticketValidated', {
        eventId: ticket.eventId,
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
      });

      res.json({
        message: 'Ticket validated successfully',
        ticket: {
          id: updated.id,
          ticketNumber: updated.ticketNumber,
          status: updated.status,
          event: ticket.event,
          ticketType: ticket.ticketType,
          owner: ticket.owner,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.issues });
      }
      logger.error('Validation error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

export { router };
