import { Router, Request, Response } from 'express';
import { UserRole, TicketStatus } from '@prisma/client';
import { requireRole } from './auth';
import { prisma } from '../lib/db';

const router = Router();

/**
 * GET /analytics/events/:eventId
 * Sales summary for a single event (organizer only).
 */
router.get(
  '/events/:eventId',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: req.params.eventId },
        select: {
          id: true,
          name: true,
          organizerId: true,
          capacity: true,
          startTime: true,
          status: true,
        },
      });

      if (!event) return res.status(404).json({ error: 'Event not found' });
      if (event.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const tickets = await prisma.ticket.findMany({
        where: { eventId: event.id },
        select: { status: true, price: true, ticketTypeId: true },
      });

      const soldStatuses: TicketStatus[] = [TicketStatus.VALID, TicketStatus.SCANNED];
      const soldTickets = tickets.filter((t) => soldStatuses.includes(t.status));
      const scannedTickets = tickets.filter((t) => t.status === TicketStatus.SCANNED);
      const revenue = soldTickets.reduce((sum, t) => sum + t.price, 0);

      const byType = await prisma.ticketTypeConfig.findMany({
        where: { eventId: event.id },
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          sold: true,
        },
      });

      res.json({
        eventId: event.id,
        eventName: event.name,
        status: event.status,
        startTime: event.startTime,
        capacity: event.capacity,
        totalTicketsIssued: tickets.length,
        soldTickets: soldTickets.length,
        scannedTickets: scannedTickets.length,
        pendingTickets: tickets.filter((t) => t.status === TicketStatus.PENDING).length,
        revenue,
        currency: 'SZL',
        ticketTypes: byType.map((tt) => ({
          ...tt,
          remaining: tt.quantity != null ? tt.quantity - tt.sold : null,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * GET /analytics/organizer/summary
 * Aggregate stats across all events for the current organizer.
 */
router.get(
  '/organizer/summary',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const events = await prisma.event.findMany({
        where: { organizerId: req.user!.userId, isArchived: false },
        select: {
          id: true,
          name: true,
          status: true,
          startTime: true,
          tickets: {
            select: { status: true, price: true },
          },
          _count: { select: { tickets: true } },
        },
        orderBy: { startTime: 'desc' },
      });

      let totalRevenue = 0;
      let totalSold = 0;
      let totalScanned = 0;

      const eventSummaries = events.map((ev) => {
        const sold = ev.tickets.filter(
          (t) => t.status === TicketStatus.VALID || t.status === TicketStatus.SCANNED
        );
        const scanned = ev.tickets.filter((t) => t.status === TicketStatus.SCANNED);
        const revenue = sold.reduce((s, t) => s + t.price, 0);
        totalRevenue += revenue;
        totalSold += sold.length;
        totalScanned += scanned.length;

        return {
          id: ev.id,
          name: ev.name,
          status: ev.status,
          startTime: ev.startTime,
          ticketsSold: sold.length,
          ticketsScanned: scanned.length,
          revenue,
        };
      });

      res.json({
        totalEvents: events.length,
        publishedEvents: events.filter((e) => e.status === 'PUBLISHED').length,
        totalRevenue,
        totalSold,
        totalScanned,
        currency: 'SZL',
        events: eventSummaries,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

export { router };
