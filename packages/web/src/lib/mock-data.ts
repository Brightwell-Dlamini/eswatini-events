// lib/mock-data.ts
export type EventStatus = 'draft' | 'published' | 'completed' | 'canceled';

export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    status: EventStatus;
    attendees: number;
    capacity: number;
    revenue: number;
    image: string;
    ticketsSold: number;
}

export const mockEvents: Event[] = [
    {
        id: '1',
        title: 'Tech Conference 2023',
        date: '2023-11-15T09:00:00',
        location: 'Convention Center, San Francisco',
        status: 'published',
        attendees: 245,
        capacity: 500,
        revenue: 24500,
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
        ticketsSold: 150,
    },
    {
        id: '2',
        title: 'Music Festival',
        date: '2023-12-20T14:00:00',
        location: 'Central Park, New York',
        status: 'published',
        attendees: 1200,
        capacity: 1500,
        revenue: 36000,
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
        ticketsSold: 150,
    },
    {
        id: '3',
        title: 'Art Exhibition',
        date: '2023-10-05T10:00:00',
        location: 'Modern Art Museum, Chicago',
        status: 'draft',
        attendees: 0,
        capacity: 200,
        revenue: 0,
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04',
        ticketsSold: 150,
    },
    {
        id: '4',
        title: 'Startup Pitch Night',
        date: '2023-09-28T18:30:00',
        location: 'Innovation Hub, Austin',
        status: 'published',
        attendees: 85,
        capacity: 100,
        revenue: 8500,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
        ticketsSold: 150,
    },
    {
        id: '5',
        title: 'Charity Gala',
        date: '2024-02-14T19:00:00',
        location: 'Grand Hotel, Miami',
        status: 'published',
        attendees: 180,
        capacity: 200,
        revenue: 36000,
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
        ticketsSold: 150,
    },
    {
        id: '6',
        title: 'Canceled Workshop',
        date: '2023-08-10T11:00:00',
        location: 'Co-working Space, Seattle',
        status: 'canceled',
        attendees: 0,
        capacity: 30,
        revenue: 0,
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
        ticketsSold: 150,
    },
];