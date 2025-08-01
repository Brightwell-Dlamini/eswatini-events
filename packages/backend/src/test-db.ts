import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function testDb() {
    try {
        // Create a test user
        const user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                password: 'testpassword',
                role: 'ATTENDEE',
                signupMethod: 'EMAIL_ONLY'
            }
        });
        console.log('Created user:', user);
        // Fetch the user
        const fetchedUser = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        });
        console.log('Fetched user:', fetchedUser);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDb();