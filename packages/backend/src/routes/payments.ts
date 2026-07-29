import { Router, Request, Response } from 'express';
import {
  PaymentMethod,
  ApprovalStatus,
  UserRole,
  TicketStatus,
} from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod';
import { prisma } from '../lib/db';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../lib/redis';
import logger from '../lib/logger';

const router = Router();

const purchaseSchema = z.object({
  eventId: z.string().min(1),
  items: z
    .array(
      z.object({
        ticketTypeId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
  method: z.nativeEnum(PaymentMethod),
  currency: z.string().default('SZL'),
  idempotencyKey: z.string().min(8).optional(),
});

/**
 * POST /payments/purchase
 * Attendee purchases one or more ticket types for an event.
 * Creates Payment + Ticket records with QR codes in a single transaction.
 */
router.post(
  '/purchase',
  requireRole([UserRole.ATTENDEE]),
  async (req: Request & { user?: { userId: string; role: UserRole } }, res: Response) => {
    try {
      const body = purchaseSchema.parse(req.body);
      const userId = req.user!.userId;

      // Idempotency: if key provided and payment already exists, return it
      if (body.idempotencyKey) {
        const existing = await prisma.payment.findUnique({
          where: { idempotencyKey: body.idempotencyKey },
          include: { tickets: true },
        });
        if (existing) {
          return res.status(200).json(existing);
        }
      }

      // Load event (must be published)
      const event = await prisma.event.findUnique({
        where: { id: body.eventId },
        select: { id: true, status: true, name: true },
      });
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (event.status !== 'PUBLISHED') {
        return res.status(400).json({ error: 'Event is not available for purchase' });
      }

      // Load and validate ticket types
      const ticketTypeIds = body.items.map((i) => i.ticketTypeId);
      const ticketTypes = await prisma.ticketTypeConfig.findMany({
        where: {
          id: { in: ticketTypeIds },
          eventId: body.eventId,
          isActive: true,
        },
      });

      if (ticketTypes.length !== ticketTypeIds.length) {
        return res.status(400).json({ error: 'One or more ticket types are invalid or inactive' });
      }

      const typeMap = new Map(ticketTypes.map((t) => [t.id, t]));

      // Capacity & quantity checks
      let totalAmount = 0;
      for (const item of body.items) {
        const tt = typeMap.get(item.ticketTypeId)!;

        if (tt.minPerOrder && item.quantity < tt.minPerOrder) {
          return res.status(400).json({
            error: `Minimum ${tt.minPerOrder} tickets required for "${tt.name}"`,
          });
        }
        if (tt.maxPerOrder && item.quantity > tt.maxPerOrder) {
          return res.status(400).json({
            error: `Maximum ${tt.maxPerOrder} tickets allowed for "${tt.name}"`,
          });
        }

        if (tt.quantity != null) {
          const remaining = tt.quantity - tt.sold - tt.reserved;
          if (item.quantity > remaining) {
            return res.status(400).json({
              error: `Only ${remaining} tickets remaining for "${tt.name}"`,
            });
          }
        }

        const unitPrice = tt.currentPrice ?? tt.price;
        totalAmount += unitPrice * item.quantity;
      }

      if (totalAmount <= 0) {
        return res.status(400).json({ error: 'Invalid total amount' });
      }

      // Simulated payment gateway — always succeeds for MVP except explicit CASH pending
      const paymentStatus: ApprovalStatus =
        body.method === 'CASH' ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED;

      // Create payment + tickets in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            amount: totalAmount,
            method: body.method,
            currency: body.currency,
            status: paymentStatus,
            userId,
            eventId: body.eventId,
            idempotencyKey: body.idempotencyKey ?? undefined,
            reference: `PAY-${uuidv4().slice(0, 8).toUpperCase()}`,
          },
        });

        const createdTickets = [];

        for (const item of body.items) {
          const tt = typeMap.get(item.ticketTypeId)!;
          const unitPrice = tt.currentPrice ?? tt.price;

          for (let i = 0; i < item.quantity; i++) {
            const ticketNumber = `TKT-${uuidv4().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
            const qrCode = await QRCode.toDataURL(ticketNumber, {
              errorCorrectionLevel: 'M',
              margin: 1,
              width: 256,
            });

            const ticket = await tx.ticket.create({
              data: {
                ticketNumber,
                qrCode,
                price: unitPrice,
                originalPrice: unitPrice,
                status:
                  paymentStatus === ApprovalStatus.APPROVED
                    ? TicketStatus.VALID
                    : TicketStatus.PENDING,
                eventId: body.eventId,
                ticketTypeId: item.ticketTypeId,
                paymentId: payment.id,
                ownerId: userId,
              },
            });
            createdTickets.push(ticket);

            // Cache for fast validation
            if (paymentStatus === ApprovalStatus.APPROVED) {
              await redis.setEx(`ticket:${ticketNumber}`, 60 * 60 * 24 * 7, TicketStatus.VALID);
            }
          }

          // Increment sold count
          await tx.ticketTypeConfig.update({
            where: { id: item.ticketTypeId },
            data: { sold: { increment: item.quantity } },
          });
        }

        return { payment, tickets: createdTickets };
      });

      logger.info(`Purchase completed`, {
        userId,
        eventId: body.eventId,
        paymentId: result.payment.id,
        ticketCount: result.tickets.length,
        amount: totalAmount,
      });

      res.status(201).json({
        payment: result.payment,
        tickets: result.tickets.map((t) => ({
          id: t.id,
          ticketNumber: t.ticketNumber,
          qrCode: t.qrCode,
          price: t.price,
          status: t.status,
          ticketTypeId: t.ticketTypeId,
        })),
      });
    } catch (error) {
      logger.error('Purchase error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.issues });
      }
      res.status(400).json({
        error: (error as Error).message || 'Purchase failed',
      });
    }
  }
);

/**
 * GET /payments/my
 * List payments belonging to the current attendee.
 */
router.get(
  '/my',
  requireRole([UserRole.ATTENDEE]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId: req.user!.userId },
        include: {
          tickets: {
            select: {
              id: true,
              ticketNumber: true,
              status: true,
              price: true,
              qrCode: true,
              ticketType: { select: { name: true } },
              event: { select: { id: true, name: true, startTime: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

export { router };
