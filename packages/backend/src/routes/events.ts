import { Router, Request, Response } from 'express';
import { UserRole, EventStatus, EventType, RefundPolicy } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from './auth';
import slugify from 'slugify';
import { prisma } from '../lib/db';

const router = Router();

const eventSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().default('Eswatini'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  type: z.nativeEnum(EventType),
  status: z.nativeEnum(EventStatus).optional().default(EventStatus.DRAFT),
  isOnline: z.boolean().default(false),
  allowRefunds: z.boolean().default(false),
  refundPolicy: z.nativeEnum(RefundPolicy).default(RefundPolicy.NO_REFUNDS),
  imageUrl: z.string().url(),
  coverImage: z.string().url().optional(),
  capacity: z.number().int().positive().optional(),
  ageRestriction: z.number().int().min(0).optional(),
  socialLinks: z.array(z.string().url()).optional(),
  hashtags: z.array(z.string()).optional(),
});

// Create event (ORGANIZER only)
router.post(
  '/',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const eventData = eventSchema.parse(req.body);

      const baseSlug = slugify(eventData.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.event.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const event = await prisma.event.create({
        data: {
          name: eventData.name,
          description: eventData.description,
          startTime: new Date(eventData.startTime),
          endTime: eventData.endTime ? new Date(eventData.endTime) : null,
          address: eventData.address,
          city: eventData.city,
          country: eventData.country,
          coordinates: eventData.coordinates,
          type: eventData.type,
          status: eventData.status ?? EventStatus.DRAFT,
          isOnline: eventData.isOnline,
          allowRefunds: eventData.allowRefunds,
          refundPolicy: eventData.refundPolicy,
          imageUrl: eventData.imageUrl,
          coverImage: eventData.coverImage,
          capacity: eventData.capacity,
          ageRestriction: eventData.ageRestriction,
          socialLinks: eventData.socialLinks ?? [],
          hashtags: eventData.hashtags ?? [],
          organizerId: req.user!.userId,
          slug,
          isFree: false,
          dynamicPricing: false,
          isFeatured: false,
          isApproved: false,
          ussdEnabled: false,
          isArchived: false,
        },
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Get published events (public)
router.get('/', async (req, res) => {
  try {
    const { type, city, from, to, featured } = req.query;

    const events = await prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        isArchived: false,
        ...(type && { type: type as EventType }),
        ...(city && { city: { contains: city as string, mode: 'insensitive' } }),
        ...(from && { startTime: { gte: new Date(from as string) } }),
        ...(to && { startTime: { lte: new Date(to as string) } }),
        ...(featured === 'true' && { isFeatured: true }),
      },
      include: {
        organizer: {
          select: { id: true, name: true },
        },
        venue: {
          select: { name: true, address: true },
        },
        ticketTypes: {
          where: { isActive: true, status: 'APPROVED' },
          select: {
            id: true,
            name: true,
            price: true,
            currentPrice: true,
            quantity: true,
            sold: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// IMPORTANT: static path must come BEFORE /:id
router.get(
  '/organizer/mine',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const events = await prisma.event.findMany({
        where: { organizerId: req.user!.userId },
        include: {
          ticketTypes: {
            select: {
              id: true,
              name: true,
              price: true,
              quantity: true,
              sold: true,
            },
          },
          _count: { select: { tickets: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// Get single event by id or slug
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id: req.params.id }, { slug: req.params.id }],
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        venue: {
          select: { name: true, address: true, amenities: true },
        },
        ticketTypes: {
          where: { isActive: true, status: 'APPROVED' },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update event (ORGANIZER only)
router.put(
  '/:id',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const partialEventSchema = eventSchema.partial();
      const eventData = partialEventSchema.parse(req.body);
      const eventId = req.params.id;

      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true },
      });

      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (existingEvent.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updateData: Record<string, unknown> = { updatedAt: new Date() };

      if (eventData.name !== undefined) {
        updateData.name = eventData.name;
        const baseSlug = slugify(eventData.name, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;
        while (
          await prisma.event.findFirst({
            where: { slug, NOT: { id: eventId } },
          })
        ) {
          slug = `${baseSlug}-${counter++}`;
        }
        updateData.slug = slug;
      }
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.startTime !== undefined) updateData.startTime = new Date(eventData.startTime);
      if (eventData.endTime !== undefined)
        updateData.endTime = eventData.endTime ? new Date(eventData.endTime) : null;
      if (eventData.address !== undefined) updateData.address = eventData.address;
      if (eventData.city !== undefined) updateData.city = eventData.city;
      if (eventData.coordinates !== undefined) updateData.coordinates = eventData.coordinates;
      if (eventData.type !== undefined) updateData.type = eventData.type;
      if (eventData.status !== undefined) updateData.status = eventData.status;
      if (eventData.imageUrl !== undefined) updateData.imageUrl = eventData.imageUrl;
      if (eventData.coverImage !== undefined) updateData.coverImage = eventData.coverImage;
      if (eventData.capacity !== undefined) updateData.capacity = eventData.capacity;
      if (eventData.ageRestriction !== undefined)
        updateData.ageRestriction = eventData.ageRestriction;
      if (eventData.socialLinks !== undefined) updateData.socialLinks = eventData.socialLinks;
      if (eventData.hashtags !== undefined) updateData.hashtags = eventData.hashtags;

      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: updateData,
      });

      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Publish event
router.post(
  '/:id/publish',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const eventId = req.params.id;

      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true, status: true },
      });

      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (existingEvent.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: {
          status: EventStatus.PUBLISHED,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Unpublish (back to DRAFT)
router.post(
  '/:id/unpublish',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const eventId = req.params.id;

      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true },
      });

      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (existingEvent.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: {
          status: EventStatus.DRAFT,
          updatedAt: new Date(),
        },
      });

      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Soft-delete (archive)
router.delete(
  '/:id',
  requireRole([UserRole.ORGANIZER]),
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
      const eventId = req.params.id;

      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true },
      });

      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (existingEvent.organizerId !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await prisma.event.update({
        where: { id: eventId },
        data: { isArchived: true, status: EventStatus.CANCELLED, updatedAt: new Date() },
      });

      res.json({ message: 'Event archived successfully' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

export { router };
