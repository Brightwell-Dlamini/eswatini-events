import { Router, Request, Response } from 'express';
import { PrismaClient, UserRole, EventStatus, EventType, RefundPolicy } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from './auth';
import slugify from 'slugify';

const prisma = new PrismaClient();
const router = Router();

const eventSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    startTime: z.string().datetime(),
    endTime: z.string().datetime().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().default('Eswatini'),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
    type: z.nativeEnum(EventType),
    status: z.nativeEnum(EventStatus).optional().default('DRAFT'),
    isOnline: z.boolean().default(false),
    allowRefunds: z.boolean().default(false),
    refundPolicy: z.nativeEnum(RefundPolicy).default('NO_REFUNDS'),
    imageUrl: z.string().url(), // Made required to match Prisma schema
    coverImage: z.string().url().optional(),
    capacity: z.number().int().positive().optional(),
    ageRestriction: z.number().int().min(0).optional(),
    socialLinks: z.array(z.string().url()).optional(),
    hashtags: z.array(z.string()).optional()
});

// Create event (ORGANIZER only)
router.post('/', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const eventData = eventSchema.parse(req.body);

        // Prepare required fields that might not come from request
        const eventInput = {
            name: eventData.name,
            description: eventData.description,
            startTime: new Date(eventData.startTime),
            endTime: eventData.endTime ? new Date(eventData.endTime) : null,
            address: eventData.address,
            city: eventData.city,
            country: eventData.country,
            coordinates: eventData.coordinates,
            type: eventData.type,
            status: eventData.status,
            isOnline: eventData.isOnline,
            allowRefunds: eventData.allowRefunds,
            refundPolicy: eventData.refundPolicy,
            imageUrl: eventData.imageUrl, // Now required
            coverImage: eventData.coverImage,
            capacity: eventData.capacity,
            ageRestriction: eventData.ageRestriction,
            socialLinks: eventData.socialLinks,
            hashtags: eventData.hashtags,
            organizerId: req.user!.userId,
            slug: slugify(eventData.name, { lower: true, strict: true }),
            createdAt: new Date(),
            updatedAt: new Date(),
            // Set other required fields from Prisma schema with defaults
            isFree: false, // Example default
            dynamicPricing: false, // Example default
            isFeatured: false, // Example default
            isApproved: false, // Example default
            ussdEnabled: false, // Example default
            isArchived: false // Example default
        };

        const event = await prisma.event.create({
            data: eventInput
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Get all published events (public)
router.get('/', async (req, res) => {
    try {
        const { type, city, from, to } = req.query;

        const events = await prisma.event.findMany({
            where: {
                // status: 'PUBLISHED',
                ...(type && { type: type as EventType }),
                ...(city && { city: city as string }),
                ...(from && { startTime: { gte: new Date(from as string) } }),
                ...(to && { startTime: { lte: new Date(to as string) } })
            },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                venue: {
                    select: {
                        name: true,
                        address: true
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Get single event (public)
router.get('/:id', async (req, res) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                venue: {
                    select: {
                        name: true,
                        address: true,
                        amenities: true
                    }
                },
                ticketTypes: {
                    where: {
                        isActive: true,
                        status: 'APPROVED'
                    }
                }
            }
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
router.put('/:id', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const eventData = eventSchema.parse(req.body);
        const eventId = req.params.id;

        // Verify event exists and user is the organizer
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true }
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
                name: eventData.name,
                description: eventData.description,
                startTime: new Date(eventData.startTime),
                endTime: eventData.endTime ? new Date(eventData.endTime) : null,
                address: eventData.address,
                city: eventData.city,
                country: eventData.country,
                coordinates: eventData.coordinates,
                type: eventData.type,
                status: eventData.status,
                isOnline: eventData.isOnline,
                allowRefunds: eventData.allowRefunds,
                refundPolicy: eventData.refundPolicy,
                imageUrl: eventData.imageUrl,
                coverImage: eventData.coverImage,
                capacity: eventData.capacity,
                ageRestriction: eventData.ageRestriction,
                socialLinks: eventData.socialLinks,
                hashtags: eventData.hashtags,
                updatedAt: new Date()
            }
        });

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Publish event (ORGANIZER only)
router.post('/:id/publish', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const eventId = req.params.id;

        // Verify event exists and user is the organizer
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true, status: true }
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
                status: 'PUBLISHED',
                publishedAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Delete event (ORGANIZER only)
router.delete('/:id', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const eventId = req.params.id;

        // Verify event exists and user is the organizer
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true }
        });

        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (existingEvent.organizerId !== req.user!.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await prisma.event.delete({ where: { id: eventId } });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export { router };