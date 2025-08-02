import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Authentication System', () => {
    beforeAll(async () => {
        // Clear test data
        await prisma.auditLog.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Registration', () => {
        it('should register a new user with email', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    landingPage: ''
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
            expect(response.body.user.email).toBe('test@example.com');
            expect(response.body.user.role).toBe('ATTENDEE');
        });

        it('should register a new user with phone', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    phone: '+1234567890',
                    password: 'password123',
                    landingPage: ''
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
            expect(response.body.user.phone).toBe('+1234567890');
        });

        it('should register with organizer role when coming from organizer landing page', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'organizer@example.com',
                    password: 'password123',
                    landingPage: 'organizer'
                });

            expect(response.status).toBe(200);
            expect(response.body.user.role).toBe('ORGANIZER');
        });

        it('should fail with duplicate email', async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    email: 'duplicate@example.com',
                    password: 'password123',
                    landingPage: ''
                });

            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'duplicate@example.com',
                    password: 'password123',
                    landingPage: ''
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email or phone already exists');
        });
    });

    describe('Login', () => {
        const testUser = {
            email: 'login@example.com',
            phone: '+1111111111',
            password: 'testpassword'
        };

        beforeAll(async () => {
            // Create a test user
            await prisma.user.create({
                data: {
                    email: testUser.email,
                    phone: testUser.phone,
                    password: await bcrypt.hash(testUser.password, 10),
                    role: 'ATTENDEE',
                    signupMethod: 'EMAIL_PHONE'
                }
            });
        });

        it('should login with email', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should login with phone', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    phone: testUser.phone,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should fail with wrong password', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });

    describe('Protected Routes', () => {
        let organizerToken: string;
        let attendeeToken: string;

        beforeAll(async () => {
            // Create test users
            const organizer = await prisma.user.create({
                data: {
                    email: 'protected-organizer@example.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'ORGANIZER',
                    signupMethod: 'EMAIL_ONLY'
                }
            });

            const attendee = await prisma.user.create({
                data: {
                    email: 'protected-attendee@example.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'ATTENDEE',
                    signupMethod: 'EMAIL_ONLY'
                }
            });

            organizerToken = jwt.sign(
                { userId: organizer.id, role: organizer.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            attendeeToken = jwt.sign(
                { userId: attendee.id, role: attendee.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            // Store sessions in Redis (mocked by your actual Redis implementation)
            await prisma.session.create({
                data: {
                    userId: organizer.id,
                    token: organizerToken,
                    platform: 'WEB',
                    expiresAt: new Date(Date.now() + 3600000)
                }
            });

            await prisma.session.create({
                data: {
                    userId: attendee.id,
                    token: attendeeToken,
                    platform: 'WEB',
                    expiresAt: new Date(Date.now() + 3600000)
                }
            });
        });

        it('should allow access to organizer', async () => {
            const response = await request(app)
                .get('/auth/protected')
                .set('Authorization', `Bearer ${organizerToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('This is a protected route for ORGANIZER only');
        });

        it('should deny access to attendee', async () => {
            const response = await request(app)
                .get('/auth/protected')
                .set('Authorization', `Bearer ${attendeeToken}`);

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Insufficient permissions');
        });

        it('should deny access without token', async () => {
            const response = await request(app)
                .get('/auth/protected');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('No token provided');
        });

        it('should deny access with invalid token', async () => {
            const response = await request(app)
                .get('/auth/protected')
                .set('Authorization', 'Bearer invalidtoken');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid or expired session');
        });
    });
});