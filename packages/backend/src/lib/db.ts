import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    // Add this if needed:
});

// Optional: Add error handling and connection logging
prisma.$connect()
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Database connection error:', err));

// Handle process termination
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    } catch (error) {
        console.error('Prisma Error:', error);
        throw error;
    }
});

export { prisma };