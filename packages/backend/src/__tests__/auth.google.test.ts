import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nock from 'nock';

const prisma = new PrismaClient();

// Mock Google OAuth responses
const mockGoogleAuth = () => {
    nock('https://oauth2.googleapis.com')
        .post('/token')
        .reply(200, {
            access_token: 'mock_access_token',
            expires_in: 3600,
            token_type: 'Bearer'
        });
    nock('https://www.googleapis.com')
        .get('/oauth2/v2/userinfo')
        .reply(200, {
            id: '123456789',
            email: 'googleuser@example.com',
            name: 'Google User',
            verified_email: true
        });
};

describe('Google OAuth Authentication', () => {
    beforeAll(async () => {
        await prisma.auditLog.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
    });
    afterAll(async () => {
        await prisma.$disconnect();
        nock.cleanAll();
    });
    it('should redirect to Google auth URL', async () => {
        const response = await request(app)
            .get('/auth/google');
        expect(response.status).toBe(302);
        expect(response.header.location).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    });
    it('should handle Google callback and create new user', async () => {
        mockGoogleAuth();
        const response = await request(app)
            .get('/auth/google/callback')
            .query({ code: 'mock_auth_code' });
        expect(response.status).toBe(302);
        expect(response.header.location).toContain('http://localhost:3000/dashboard?token=');

        // Extract token from redirect URL
        const redirectUrl = response.header.location;
        const token = redirectUrl.split('token=')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        expect(decoded.userId).toBeDefined();

        // Check user was created
        const user = await prisma.user.findUnique({
            where: { email: 'googleuser@example.com' }
        });
        expect(user).toBeTruthy();
        expect(user?.signupMethod).toBe('SOCIAL');
        expect(user?.password).toBe('');
    });
});