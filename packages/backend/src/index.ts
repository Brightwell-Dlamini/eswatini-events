import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { router as authRouter } from './routes/auth';
import { router as googleAuthRouter } from './routes/auth.google';
import { router as eventRouter } from './routes/events';
import { router as ticketRouter } from './routes/tickets';

const app = express();

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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;