import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.test' });

// Ensure we're using the test database
const prisma = new PrismaClient();

beforeAll(async () => {
    // Any global test setup
});

afterAll(async () => {
    await prisma.$disconnect();
});