import { Event, TicketTypeConfig, Vendor, RolePermission, User, Promo, Report, Payment, Refund, AnalyticsItem, } from '@/types/schema';

export const dummyReports: Report[] = [
    {
        id: '1',
        title: 'MTN Bushfire 2025 - Full Sales Report',
        description: 'Comprehensive sales and attendance report for MTN Bushfire 2025',
        type: 'SALES',
        format: 'PDF',
        status: 'COMPLETED',
        downloadUrl: '/reports/bushfire-2025-sales.pdf',
        filters: {
            dateRange: ['2025-01-01', '2025-09-17'],
            ticketTypes: ['GENERAL_ADMISSION', 'VIP'],
            includeVendorSales: true
        },
        scheduled: false,
        isArchived: false,
        createdAt: '2025-09-18T09:00:00Z',
        completedAt: '2025-09-18T09:15:00Z',
        createdById: '1',
        ownerId: '1',
        eventId: '1'
    },
    // Additional reports...
];

export const dummyEvents: Event[] = [
    {
        id: '1',
        name: 'MTN Bushfire 2025',
        localizedName: 'MTN Bushfire 2025 (Eswatini)',
        description: 'Eswatini\'s biggest music festival, featuring top African artists and cultural showcases.',
        localizedDescription: 'Umkhosi we-MTN Bushfire 2025, unemculo wase-Afrika kanye nemidlalo yamasiko.',
        startTime: '2025-09-15T18:00:00Z',
        endTime: '2025-09-17T23:59:00Z',
        imageUrl: '/events/bushfire-2025.jpg',
        coverImage: '/events/bushfire-cover.jpg',
        type: 'FESTIVAL',
        isOnline: false,
        allowRefunds: true,
        refundPolicy: 'FLEXIBLE',
        customRefundPolicy: 'Full refund up to 7 days before event',
        dynamicPricing: true,
        status: 'PUBLISHED',
        capacity: 40000,
        ageRestriction: 18,
        isFeatured: true,
        socialLinks: ['https://facebook.com/mtnbushfire', 'https://instagram.com/mtnbushfire'],
        hashtags: ['#Bushfire2025', '#EswatiniMusic'],
        isCashless: true,
        isFree: false,
        minPrice: 100,
        maxPrice: 5000,
        slug: 'mtn-bushfire-2025',
        isApproved: true,
        accessibilityFeatures: ['Wheelchair Access', 'Sign Language'],
        accessibilityDetails: {
            wheelchairAccess: true,
            parkingSpots: 20,
            signLanguageInterpreters: ['Saturday Main Stage']
        },
        ussdEnabled: true,
        address: 'House on Fire, Malkerns Valley',
        city: 'Malkerns',
        country: 'Eswatini',
        coordinates: { lat: -26.5225, lng: 31.1808 },
        popularityScore: 9.8,
        trendingBoost: 1.2,
        seoKeywords: ['music festival', 'Eswatini events', 'African music'],
        onlineDetails: null,
        doorTime: '2025-09-15T16:00:00Z',
        schedule: {
            "Day 1": [
                { time: "18:00", act: "Opening Ceremony" },
                { time: "19:30", act: "DJ Sbu" },
                { time: "21:00", act: "Major League DJz" }
            ]
        },
        culturalEngagement: {
            communityAttendance: 5000,
            traditionalPerformers: 15,
            localVendors: 120
        },
        liveAttendeeCount: 12500,
        organizerId: '1',
        venueId: 'venue1',
        ticketsSold: 20000,  // Add this
        revenue: 30000000,    // Add this

    },
];

export const dummyTicketTypes: TicketTypeConfig[] = [
    {
        id: '1',
        name: 'General Admission - Weekend Pass',
        localizedName: 'I-Ticket ye-General Admission - Weekend',
        type: 'GENERAL_ADMISSION',
        price: 1500,
        basePrice: 1500,
        currentPrice: 1500,
        description: 'Access to all festival areas for the entire weekend',
        localizedDescription: 'Ukungena kuzo zonke izindawo zomkhosi ngesonto lonke',
        quantity: 30000,
        sold: 20000,
        reserved: 500,
        salesStart: '2025-01-01T00:00:00Z',
        salesEnd: '2025-09-14T23:59:00Z',
        isActive: true,
        status: 'APPROVED',
        minPerOrder: 1,
        maxPerOrder: 10,
        isTransferable: true,
        isRefundable: true,
        visibility: 'PUBLIC',
        colorCode: '#4E84C4',
        seatingInfo: 'General standing area',
        dynamicAlgorithm: 'demand_based',
        minPrice: 1000,
        maxPrice: 2000,
        waitlistEnabled: true,
        groupDiscount: 0.1,
        resaleWaitlistThreshold: 100,
        eventId: '1'
    },
    // Additional ticket types...
];

export const dummyPromos: Promo[] = [
    {
        id: '1',
        code: 'BUSH25',
        discount: 15,
        discountType: 'PERCENTAGE',
        description: '15% off all ticket types for MTN Bushfire 2025',
        maxUses: 100,
        uses: 42,
        minAmount: null,
        isActive: true,
        isPublic: true,
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-06-30T23:59:00Z',
        createdAt: '2024-12-15T10:00:00Z',
        expiresAt: '2025-06-30T23:59:00Z',
        eventId: '1',
        createdById: '1'
    },
    // Additional promos...
];

export const dummyVendors: Vendor[] = [
    {
        id: '1',
        name: 'Swazi Eats',
        description: 'Traditional Swazi cuisine and beverages',
        logo: '/vendors/swazi-eats.png',
        website: 'https://swazieats.com',
        isApproved: true,
        taxId: 'TAX-123456',
        bankAccount: {
            bank: 'Standard Bank Eswatini',
            accountNumber: '123456789',
            accountName: 'Swazi Eats Pty Ltd',
            branchCode: '12345'
        },
        payoutSchedule: 'WEEKLY',
        minPayoutAmount: 5000,
        serviceFee: 0.1,
        marketplaceEnabled: true,
        cashReconciliationLogs: [
            { date: '2025-08-01', amount: 2500, verified: true },
            { date: '2025-08-02', amount: 3800, verified: true }
        ],
        encryptionKey: 'enc-key-123',
        fraudScore: 0.0,
        eventId: '1',
        userId: 'vendor-user-1',
        sales: 15000,
        inventory: '50 burgers, 100 drinks, 30 pizzas'
    },
    // Additional vendors...
];

export const dummyAnalytics: AnalyticsItem[] = [
    {
        id: 'analytics-1',
        eventId: '1',
        createdAt: '2025-09-18T09:00:00Z',
        data: {
            salesOverTime: [
                { date: '2025-09-01', revenue: 500000 },
                { date: '2025-09-02', revenue: 750000 },
                { date: '2025-09-03', revenue: 1200000 }, { date: '2025-09-04', revenue: 50000 },
            ],
            ticketTypes: [
                { name: 'General Admission', sold: 20000 },
                { name: 'VIP', sold: 500 },
                { name: 'Early Bird', sold: 3000 },
            ],
            checkInRate: {
                checkedIn: 12500,
                total: 20500
            },
            demographics: {
                age: [
                    { range: '18-25', count: 8000 },
                    { range: '26-35', count: 10000 },
                    { range: '36-45', count: 2000 },
                ],
                location: [
                    { name: 'Eswatini', percentage: 60 },
                    { name: 'South Africa', percentage: 25 },
                    { name: 'Other', percentage: 15 },
                ]
            }
        }
    }
];

export const dummyAttendees: { id: string; name: string; email: string; ticketId: string; checkedIn: boolean, eventId?: string; }[] = [
    {
        id: '1',
        name: 'Thabo Mkhize',
        email: 'thabo@example.com',
        ticketId: '1',
        checkedIn: true,
    },
    {
        id: '2',
        name: 'Lindiwe Dlamini',
        email: 'lindiwe@example.com',
        ticketId: '2',
        checkedIn: false,
    },
    {
        id: '3',
        name: 'Sipho Ndlovu',
        email: 'sipho@example.com',
        ticketId: '3',
        checkedIn: true,
    },
    {
        id: '4',
        name: 'Nomsa Mabuza',
        email: 'nomsa@example.com',
        ticketId: '5',
        checkedIn: false,
    },
];

export const dummyPayments: Payment[] = [
    {
        id: '1',
        amount: 1500,
        fee: 75,
        currency: 'SZL',
        method: 'MOMO',
        status: 'APPROVED',
        reference: 'PAY-123456',
        processorId: 'MOMO-789012',
        isRefunded: false,
        refundAmount: 0,
        isOffline: false,
        exchangeRate: 1,
        riskScore: 0.1,
        currencyLocked: true,
        fraudStatus: 'CLEAR',
        createdAt: '2025-08-01T10:30:00Z',
        updatedAt: '2025-08-01T10:30:00Z',
        eventId: '1',
        userId: 'attendee-1',
        cashierId: null
    },
    // Additional payments...
];

export const dummyRefunds: Refund[] = [
    {
        id: '1',
        amount: 1500,
        reason: 'Event postponed',
        status: 'APPROVED',
        processedAt: '2025-08-15T14:30:00Z',
        isOffline: false,
        paymentId: '1',
        ticketId: 'ticket-123',
        processedById: '1'
    },
    // Additional refunds...
];

export const dummyUsers: User[] = [
    {
        id: '1',
        name: 'Siyabonga Dlamini',
        email: 'siyabonga@eswatickets.com',
        phone: '+26812345678',
        role: 'ORGANIZER',
        permissions: [
            'EVENT_CREATE', 'EVENT_PUBLISH', 'EVENT_DELETE',
            'TICKET_MANAGE', 'VENDOR_APPROVE', 'REFUND_PROCESS',
            'PAYOUT_INITIATE', 'CONTENT_MODERATE', 'ANALYTICS_VIEW',
            'REPORTS_GENERATE'
        ],
        profilePhoto: '/profiles/siyabonga.jpg',
        isVerified: true,
        lastSeenOffline: new Date().toISOString(),
        fraudScore: 0.0,
        biometricId: 'bio-12345',
        biometricConsent: true
    },
    {
        id: '2',
        name: 'Thandiwe Maseko',
        email: 'thandiwe@eswatickets.com',
        phone: '+26887654321',
        role: 'ORGANIZER',
        permissions: [
            'EVENT_CREATE', 'TICKET_MANAGE', 'ANALYTICS_VIEW'
        ],
        profilePhoto: '/profiles/thandiwe.jpg',
        isVerified: true,
        lastSeenOffline: new Date(Date.now() - 3600000).toISOString(),
        fraudScore: 0.1
    },
    {
        id: '3',
        name: 'MTN Bushfire Admin',
        email: 'admin@mtnbushfire.com',
        phone: '+26898765432',
        role: 'ORGANIZER',
        permissions: [
            'EVENT_CREATE', 'EVENT_PUBLISH', 'TICKET_MANAGE',
            'VENDOR_APPROVE', 'ANALYTICS_VIEW', 'REPORTS_GENERATE'
        ],
        profilePhoto: '/profiles/mtn-admin.jpg',
        isVerified: true,
        lastSeenOffline: new Date(Date.now() - 86400000).toISOString(), fraudScore: 0.0,
    }
];

export const dummyRolePermissions: RolePermission[] = [
    {
        id: '1',
        role: 'ORGANIZER',
        permission: 'CREATE_EVENT',
    },
    {
        id: '2',
        role: 'ORGANIZER',
        permission: 'MANAGE_TICKETS',
    },
    {
        id: '3',
        role: 'ORGANIZER',
        permission: 'VIEW_ANALYTICS',
    },
    {
        id: '4',
        role: 'ORGANIZER',
        permission: 'MANAGE_VENDORS',
    },
    {
        id: '5',
        role: 'ORGANIZER',
        permission: 'MANAGE_BILLING',
    },
];

