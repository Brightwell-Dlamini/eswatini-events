// routes/payments.ts
import { Router, Request, Response } from 'express';
import { PrismaClient, PaymentMethod, ApprovalStatus, UserRole } from '@prisma/client';
import { requireRole } from './auth';
import { z } from 'zod'; import { prisma } from '../lib/db';


const router = Router();

const paymentSchema = z.object({
    amount: z.number().positive(),
    method: z.nativeEnum(PaymentMethod),
    ticketIds: z.array(z.string()),
    currency: z.string().default('SZL')
});

// Process payment
router.post('/', requireRole([UserRole.ATTENDEE]), async (req: Request & { user?: { userId: string } }, res: Response) => {
    try {
        const { amount, method, ticketIds, currency } = paymentSchema.parse(req.body);

        // Verify tickets exist and are available
        const tickets = await prisma.ticket.findMany({
            where: { id: { in: ticketIds }, status: 'PENDING' }
        });

        if (tickets.length !== ticketIds.length) {
            return res.status(400).json({ error: 'Some tickets are unavailable' });
        }

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                amount,
                method,
                currency,
                status: method === 'CASH' ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED,
                userId: req.user!.userId,
                tickets: {
                    connect: ticketIds.map(id => ({ id }))
                }
            },
            include: { tickets: true }
        });

        // Update ticket statuses
        await prisma.ticket.updateMany({
            where: { id: { in: ticketIds } },
            data: {
                status: 'VALID',
                ownerId: req.user!.userId
            }
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export { router };