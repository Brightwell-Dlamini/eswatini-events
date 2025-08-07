import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { router as authRouter } from './routes/auth';
import { router as googleAuthRouter } from './routes/auth.google';
import { router as eventRouter } from './routes/events';
import { router as ticketRouter } from './routes/tickets';
import { router as analyticsRouter } from './routes/analytics';
import { router as userRouter } from './routes/users';
import { router as ticketTypeRouter } from './routes/ticket-types';
import { router as paymentRouter } from './routes/payments';
import { router as venueRouter } from './routes/venues';
import logger from './lib/logger';
import { redis } from "./lib/redis";
import z from "zod";


const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: { origin: ['http://localhost:3000'] }
});

const subClient = redis.duplicate();
subClient.connect();
// Add request logging middleware
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        ip: req.ip,
    });
    next();
});

// Error logging
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            error: 'Validation error',
            details: err.issues
        });
    }
    logger.error({
        error: err.message,
        stack: err.stack,
        path: req.path,
    });
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
        const decoded = require('./routes/auth').verifyToken(token);
        socket.data.userId = decoded.userId;
        socket.data.role = decoded.role;
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

io.adapter(createAdapter(redis, subClient));

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.userId}`);
    socket.join(socket.data.userId); // Personal room
    socket.join(socket.data.role); // Role-based room

    // Handle real-time events
    socket.on('joinEventRoom', (eventId) => {
        socket.join(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.data.userId}`);
    });
});
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000'] }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/auth', authRouter);
app.use('/auth', googleAuthRouter);
app.use('/events', eventRouter);
app.use('/tickets', ticketRouter);
app.use('/analytics', analyticsRouter); app.use('/users', userRouter);
app.use('/ticket-types', ticketTypeRouter);
app.use('/payments', paymentRouter);
app.use('/venues', venueRouter);


const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
export default app;