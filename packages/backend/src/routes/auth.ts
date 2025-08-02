import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createClient } from 'redis';

const prisma = new PrismaClient();

const redis = createClient({
    username: 'default',
    password: 'HEc6TE2GHT5SnEKuMT1evbGo4QRt9Trg',
    socket: {
        host: 'redis-17967.c341.af-south-1-1.ec2.redns.redis-cloud.com',
        port: 17967
    }
});
redis.on('error', (err) => console.error('Redis Error:', err));
redis.connect();

const router = Router();

const registerSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(8),
    landingPage: z.string()
}).refine((data) => data.email || data.phone,
    {
        message: 'Email or phone required'
    });

const roleMap: Record<string, UserRole> = {
    'organizer': UserRole.ORGANIZER,
    'vendor': UserRole.VENDOR,
    'gate-operator': UserRole.GATE_OPERATOR,
    '': UserRole.ATTENDEE
};

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, phone, password, landingPage } = registerSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = roleMap[landingPage] || UserRole.ATTENDEE;

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }] }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email or phone already exists' });
        }

        const user = await prisma.user.create({
            data: {
                email,
                phone,
                password: hashedPassword,
                role,
                signupMethod: email && phone ? 'EMAIL_PHONE' : email ? 'EMAIL_ONLY' : 'PHONE_ONLY'
            }
        });
        // Create session and store in Redis
        const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        await prisma.session.create({
            data:
            {
                userId: user.id,
                token, platform: 'WEB',
                expiresAt: new Date(Date.now() + 3600000)
            }
        });

        await redis.setEx(`session:${token}`, 3600, user.id); // Store in Redis for 1 hour
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'REGISTER',
                entityType: 'USER',
                entityId: user.id
            }
        });
        res.json({ token, user: { id: user.id, email, phone, role } });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, phone, password } = z.object({
            email: z.string().email().optional(),
            phone: z.string().optional(),
            password: z.string()
        }).refine((data) => data.email || data.phone, { message: 'Email or phone required' }).parse(req.body);
        const user = await prisma.user.findFirst({
            where: { OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }] }
        });
        if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        await prisma.session.create({
            data: { userId: user.id, token, platform: 'WEB', expiresAt: new Date(Date.now() + 3600000) }
        });
        // Store session in Redis
        await redis.setEx(`session:${token}`, 3600, user.id);
        await prisma.auditLog.create({
            data: { userId: user.id, action: 'LOGIN', entityType: 'USER', entityId: user.id }
        });

        res.json({ token, user: { id: user.id, email, phone, role: user.role } });
    } catch (error) {
        res.status(401).json({ error: (error as Error).message });
    }
});

// Protected route for testing RBAC
router.get('/protected', requireRole([UserRole.ORGANIZER]), (req, res) => {
    res.json({ message: 'This is a protected route for ORGANIZER only' });
});

export function requireRole(roles: UserRole[]) {
    return async (req: Request & { user?: { userId: string; role: UserRole } }, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token provided' });

        try {
            const token = authHeader.replace('Bearer ', '');
            const session = await redis.get(`session:${token}`);
            if (!session) return res.status(401).json({ error: 'Invalid or expired session' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: UserRole };
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
}

export { router };