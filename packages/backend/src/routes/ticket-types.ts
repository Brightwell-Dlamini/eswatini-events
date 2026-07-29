import { Router, Request, Response } from 'express';
import { TicketType, ApprovalStatus, UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod';
import { prisma } from '../lib/db';

const router = Router();

const ticketTypeSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1).max(100),
  type: z.nativeEnum(TicketType),
  price: z.number().positive(),
  description: z.string().max(500).optional(),
  quantity: z.number().int().positive().optional(),
  salesStart: z.string().datetime().optional(),
  salesEnd: z.string().datetime().optional(),
  minPerOrder: z.number().int().positive().optional().default(1),
  maxPerOrder: z.number().int().positive().optional().default(10),
});

/**
 * POST /ticket-types
 * Create a ticket type for an event (ORGANIZER).
 * Auto-approved for MVP so tickets can be sold immediately after publish.
 */
router.post(
  '/',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const data = ticketTypeSchema.parse(req.body);

      const event = await prisma.event.findUnique({
        where: { id: data.eventId },
        select: { organizerId: true },
      });

      if (!event || event.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const ticketType = await prisma.ticketTypeConfig.create({
        data: {
          name: data.name,
          type: data.type,
          price: data.price,
          currentPrice: data.price,
          basePrice: data.price,
          description: data.description,
          quantity: data.quantity,
          salesStart: data.salesStart ? new Date(data.salesStart) : undefined,
          salesEnd: data.salesEnd ? new Date(data.salesEnd) : undefined,
          minPerOrder: data.minPerOrder,
          maxPerOrder: data.maxPerOrder,
          eventId: data.eventId,
          // MVP: auto-approve so organizers can sell immediately
          status: ApprovalStatus.APPROVED,
          isActive: true,
        },
      });

      res.status(201).json(ticketType);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

/**
 * GET /ticket-types/event/:eventId
 * Public list of active, approved ticket types for an event.
 */
router.get('/event/:eventId', async (req, res) => {
  try {
    const ticketTypes = await prisma.ticketTypeConfig.findMany({
      where: {
        eventId: req.params.eventId,
        status: ApprovalStatus.APPROVED,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        price: true,
        currentPrice: true,
        description: true,
        quantity: true,
        sold: true,
        minPerOrder: true,
        maxPerOrder: true,
        salesStart: true,
        salesEnd: true,
      },
    });
    res.json(ticketTypes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * PATCH /ticket-types/:id
 * Update a ticket type (ORGANIZER who owns the event).
 */
router.patch(
  '/:id',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const existing = await prisma.ticketTypeConfig.findUnique({
        where: { id: req.params.id },
        include: { event: { select: { organizerId: true } } },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Ticket type not found' });
      }
      if (existing.event.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const partial = ticketTypeSchema.partial().omit({ eventId: true }).parse(req.body);

      const updated = await prisma.ticketTypeConfig.update({
        where: { id: req.params.id },
        data: {
          ...partial,
          ...(partial.price !== undefined && {
            price: partial.price,
            currentPrice: partial.price,
          }),
          ...(partial.salesStart && { salesStart: new Date(partial.salesStart) }),
          ...(partial.salesEnd && { salesEnd: new Date(partial.salesEnd) }),
        },
      });

      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

export { router };
