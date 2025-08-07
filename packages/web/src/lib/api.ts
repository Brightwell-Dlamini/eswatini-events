import { Event, TicketTypeConfig, Vendor, User } from '@/types/schema';
import { dummyEvents, dummyTicketTypes, dummyVendors, dummyAnalytics, dummyAttendees, dummyRefunds, dummyUsers } from './dummyData';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
// Simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    /**
     * Registers a new user.
     * @param data - Registration data including name, email, phone, password, and optional landing page.
     * @returns A promise that resolves to the registered user and token.
     */
    register: async (data: {
        name: string;
        email: string;
        phone: string;
        password: string;
        landingPage?: string;
    }): Promise<{ user: User; token: string }> => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: data.email,
                phone: data.phone,
                password: data.password,
                landingPage: data.landingPage || '', // Empty string for ATTENDEE role
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }

        return await response.json();
    },

    login: async (credentials: {
        email: string;
        password: string;
    }): Promise<{ user: User; token: string }> => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        return await response.json();
    },

    getCurrentUser: async (token: string): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return await response.json();
    },


    getEvents: async (): Promise<Event[]> => {
        await delay(500); // Simulate network latency
        return dummyEvents;
    },

    getEventById: async (id: string): Promise<Event | undefined> => {
        await delay(500);
        return dummyEvents.find(event => event.id === id);
    },

    createEvent: async (data: Partial<Event>): Promise<Event> => {
        await delay(500);
        const newEvent = {
            ...data,
            id: `event-${Date.now()}`,
            ticketsSold: 0,
            revenue: 0,
            status: data.status || 'DRAFT',
            venueId: data.venueId || `venue-${Date.now()}`,
        } as Event;
        dummyEvents.push(newEvent);
        return newEvent;
    },

    updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
        await delay(500);
        const index = dummyEvents.findIndex(event => event.id === id);
        if (index === -1) throw new Error('Event not found');
        dummyEvents[index] = { ...dummyEvents[index], ...data };
        return dummyEvents[index];
    },

    getTicketTypes: async (eventId?: string): Promise<TicketTypeConfig[]> => {
        await delay(500);
        if (eventId) {
            return dummyTicketTypes.filter(ticket => ticket.eventId === eventId);
        }
        return dummyTicketTypes;
    },

    getTicketTypeById: async (id: string): Promise<TicketTypeConfig | undefined> => {
        await delay(500);
        return dummyTicketTypes.find(ticket => ticket.id === id);
    },

    createTicketType: async (data: Partial<TicketTypeConfig>): Promise<TicketTypeConfig> => {
        await delay(500);
        const newTicket = {
            ...data,
            id: `ticket-${Date.now()}`,
            sold: 0,
        } as TicketTypeConfig;
        dummyTicketTypes.push(newTicket);
        return newTicket;
    },

    updateTicketType: async (id: string, data: Partial<TicketTypeConfig>): Promise<TicketTypeConfig> => {
        await delay(500);
        const index = dummyTicketTypes.findIndex(ticket => ticket.id === id);
        if (index === -1) throw new Error('Ticket not found');
        dummyTicketTypes[index] = { ...dummyTicketTypes[index], ...data };
        return dummyTicketTypes[index];
    },

    getVendors: async (eventId?: string): Promise<Vendor[]> => {
        await delay(500);
        if (eventId) {
            return dummyVendors.filter(vendor => vendor.eventId === eventId);
        }
        return dummyVendors;
    },

    createVendor: async (data: Partial<Vendor>): Promise<Vendor> => {
        await delay(500);
        const newVendor = {
            ...data,
            id: `vendor-${Date.now()}`,
            sales: 0,
            fraudScore: data.fraudScore || 0,
        } as Vendor;
        dummyVendors.push(newVendor);
        return newVendor;
    },

    getAnalytics: async (): Promise<any> => {
        await delay(500);
        return dummyAnalytics[0].data;
    },

    getAttendees: async (eventId?: string): Promise<any[]> => {
        await delay(500);
        if (eventId) {
            const ticketIds = dummyTicketTypes.filter(ticket => ticket.eventId === eventId).map(ticket => ticket.id);
            return dummyAttendees.filter(attendee => ticketIds.includes(attendee.ticketId));
        }
        return dummyAttendees;
    },

    checkInAttendee: async (attendeeId: string): Promise<void> => {
        await delay(500);
        const index = dummyAttendees.findIndex(attendee => attendee.id === attendeeId);
        if (index === -1) throw new Error('Attendee not found');
        dummyAttendees[index].checkedIn = true;
    },

    getRefundRequests: async (eventId?: string): Promise<any[]> => {
        await delay(500);
        if (eventId) {
            const ticketIds = dummyTicketTypes.filter(ticket => ticket.eventId === eventId).map(ticket => ticket.id);
            return dummyRefunds.filter(refund => ticketIds.includes(refund.ticketId));
        }
        return dummyRefunds;
    },

    processRefund: async (refundId: string, action: 'APPROVE' | 'DENY', customAmount?: number): Promise<void> => {
        await delay(500);
        const index = dummyRefunds.findIndex(refund => refund.id === refundId);
        if (index === -1) throw new Error('Refund request not found');
        dummyRefunds[index].status = action;
        if (customAmount) {
            dummyRefunds[index].amount = customAmount;
        }
    },

    getUser: async (id: string): Promise<User | undefined> => {
        await delay(500);
        return dummyUsers.find(user => user.id === id);
    },

    updateUser: async (id: string, data: Partial<User>): Promise<User> => {
        await delay(500);
        const index = dummyUsers.findIndex(user => user.id === id);
        if (index === -1) throw new Error('User not found');
        dummyUsers[index] = { ...dummyUsers[index], ...data };
        return dummyUsers[index];
    },

    sendEmailCampaign: async (data: { template: string; audience: string; subject: string; content: string }): Promise<void> => {
        await delay(500);
        console.log('Mock email campaign sent:', data);
    },

    createPromoCode: async (data: { code: string; discountType: 'PERCENTAGE' | 'FIXED'; discountValue: number; usageLimit: number; expiryDate: string }): Promise<void> => {
        await delay(500);
        console.log('Mock promo code created:', data);
    },
};