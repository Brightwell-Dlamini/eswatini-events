import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Optional: Add error handling and connection logging
prisma.$connect()
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Database connection error:', err));

export { prisma };