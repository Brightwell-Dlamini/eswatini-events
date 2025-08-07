import { Router, Request, Response } from 'express';
import { PrismaClient, UserRole, EventStatus, EventType, RefundPolicy } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from './auth';
import slugify from 'slugify';
import { prisma } from '../lib/db';


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


// Update event (ORGANIZER only) - Partial updates allowed
// Update event (ORGANIZER only) - Partial updates allowed
router.put('/:id', requireRole([UserRole.ORGANIZER]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const partialEventSchema = eventSchema.partial();
        const eventData = partialEventSchema.parse(req.body);
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

        // Define type for update data
        type EventUpdateData = {
            updatedAt: Date;
            name?: string;
            slug?: string;
            description?: string;
            startTime?: Date;
            endTime?: Date | null;
            address?: string;
            city?: string;
            coordinates?: { lat: number; lng: number };
            type?: EventType;
            status?: EventStatus;
            imageUrl?: string;
            coverImage?: string;
            capacity?: number;
            ageRestriction?: number;
            socialLinks?: string[];
            hashtags?: string[];
        };

        // Prepare update data - only include fields that were actually provided
        const updateData: EventUpdateData = {
            updatedAt: new Date()
        };

        if (eventData.name !== undefined) {
            updateData.name = eventData.name;
            updateData.slug = slugify(eventData.name, { lower: true, strict: true });
        }
        if (eventData.description !== undefined) updateData.description = eventData.description;
        if (eventData.startTime !== undefined) updateData.startTime = new Date(eventData.startTime);
        if (eventData.endTime !== undefined) updateData.endTime = eventData.endTime ? new Date(eventData.endTime) : null;
        if (eventData.address !== undefined) updateData.address = eventData.address;
        if (eventData.city !== undefined) updateData.city = eventData.city;
        if (eventData.coordinates !== undefined) updateData.coordinates = eventData.coordinates;
        if (eventData.type !== undefined) updateData.type = eventData.type;
        if (eventData.status !== undefined) updateData.status = eventData.status;
        if (eventData.imageUrl !== undefined) updateData.imageUrl = eventData.imageUrl;
        if (eventData.coverImage !== undefined) updateData.coverImage = eventData.coverImage;
        if (eventData.capacity !== undefined) updateData.capacity = eventData.capacity;
        if (eventData.ageRestriction !== undefined) updateData.ageRestriction = eventData.ageRestriction;
        if (eventData.socialLinks !== undefined) updateData.socialLinks = eventData.socialLinks;
        if (eventData.hashtags !== undefined) updateData.hashtags = eventData.hashtags;

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData
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