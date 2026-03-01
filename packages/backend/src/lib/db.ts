import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const basePrisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});

// Extend the client with query interception for timing and error logging
const prisma = basePrisma.$extends({
    query: {
        $allModels: {
            $allOperations: async ({ model, operation, args, query }) => {
                // Start timing
                const start = Date.now();

                try {
                    const result = await query(args);

                    // Log successful query
                    const duration = Date.now() - start;
                    console.log(`Query ${model}.${operation} took ${duration}ms`);

                    return result;
                } catch (error) {
                    // Log error with context
                    console.error('Prisma Error:', {
                        model,
                        operation,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });

                    throw error;
                }
            },
        },
    },
});

// Then connect to the database
prisma.$connect()
    .then(() => console.log('Connected to database successfully'))
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export { prisma };