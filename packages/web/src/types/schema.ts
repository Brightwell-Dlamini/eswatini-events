export interface Report {
    id: string;
    title: string;
    description: string;
    type: string;
    format: string;
    status: string;
    downloadUrl: string;
    filters: {
        dateRange: [string, string];
        ticketTypes: string[];
        includeVendorSales: boolean;
    };
    scheduled: boolean;
    isArchived: boolean;
    createdAt: string;
    completedAt: string;
    createdById: string;
    ownerId: string;
    eventId: string;
}


export interface Event {
    id: string;
    name: string;
    localizedName?: string;
    description?: string;
    localizedDescription?: string;
    startTime: string;
    endTime: string;
    imageUrl?: string;
    coverImage?: string;
    type: 'MUSIC' | 'FESTIVAL' | 'CONFERENCE' | 'SPORTS' | 'COMMUNITY' | 'CORPORATE' | 'ARTS' | 'FOOD' | 'RELIGIOUS' | 'EDUCATION' | 'WEDDING' | 'EXPOSURE' | 'NETWORKING' | 'FUNDRAISER';
    isOnline: boolean;
    allowRefunds: boolean;
    refundPolicy: 'NO_REFUNDS' | 'FLEXIBLE' | 'MODERATE' | 'STRICT' | 'CUSTOM';
    customRefundPolicy?: string;
    dynamicPricing: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | 'POSTPONED';
    capacity: number;
    ageRestriction?: number;
    isFeatured?: boolean;
    socialLinks?: string[];
    hashtags?: string[];
    isCashless?: boolean;
    isFree?: boolean;
    minPrice?: number;
    maxPrice?: number;
    slug?: string;
    isApproved?: boolean;
    accessibilityFeatures?: string[];
    accessibilityDetails?: {
        wheelchairAccess: boolean;
        parkingSpots: number;
        signLanguageInterpreters: string[];
    };
    ussdEnabled?: boolean;
    address?: string;
    city: string;
    country?: string;
    coordinates?: { lat: number; lng: number };
    popularityScore?: number;
    trendingBoost?: number;
    seoKeywords?: string[];
    onlineDetails?: null;
    doorTime?: string;
    schedule?: Record<string, Array<{ time: string; act: string }>>;
    culturalEngagement?: {
        communityAttendance: number;
        traditionalPerformers: number;
        localVendors: number;
    };
    liveAttendeeCount?: number;
    organizerId: string;
    venueId: string;
    ticketsSold: number;
    revenue: number;
}

export interface TicketTypeConfig {
    id: string;
    name: string;
    localizedName?: string;
    type: 'GENERAL_ADMISSION' | 'VIP' | 'EARLY_BIRD' | 'STUDENT' | 'SENIOR' | 'GROUP' | 'SEASON_PASS' | 'BACKSTAGE' | 'TABLE' | 'BOOTH' | 'MERCHANDISE';
    price: number;
    basePrice: number;
    currentPrice: number;
    description?: string;
    localizedDescription?: string;
    quantity: number;
    sold: number;
    reserved: number;
    salesStart: string;
    salesEnd: string;
    isActive: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    minPerOrder: number;
    maxPerOrder: number;
    isTransferable: boolean;
    isRefundable: boolean;
    visibility: string;
    colorCode?: string;
    seatingInfo?: string;
    dynamicAlgorithm?: string;
    minPrice?: number;
    maxPrice?: number;
    waitlistEnabled?: boolean;
    groupDiscount?: number;
    resaleWaitlistThreshold?: number;
    eventId: string;
}

export interface Promo {
    id: string;
    code: string;
    discount: number;
    discountType: 'PERCENTAGE' | 'FIXED';
    description: string;
    maxUses: number;
    uses: number;
    minAmount: number | null;
    isActive: boolean;
    isPublic: boolean;
    startDate: string;
    endDate: string;
    createdAt: string;
    expiresAt: string;
    eventId: string;
    createdById: string;
}

export interface Vendor {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    isApproved: boolean;
    taxId?: string;
    bankAccount?: {
        bank: string;
        accountNumber: string;
        accountName: string;
        branchCode: string;
    };
    payoutSchedule?: string;
    minPayoutAmount?: number;
    serviceFee?: number;
    marketplaceEnabled?: boolean;
    cashReconciliationLogs?: Array<{
        date: string;
        amount: number;
        verified: boolean;
    }>;
    encryptionKey?: string;
    fraudScore: number;
    eventId: string;
    userId: string;
    sales: number;
    inventory: string;
}

export interface Payment {
    id: string;
    amount: number;
    fee: number;
    currency: string;
    method: string;
    status: string;
    reference: string;
    processorId: string;
    isRefunded: boolean;
    refundAmount: number;
    isOffline: boolean;
    exchangeRate: number;
    riskScore: number;
    currencyLocked: boolean;
    fraudStatus: string;
    createdAt: string;
    updatedAt: string;
    eventId: string;
    userId: string;
    cashierId: string | null;
}

export interface Refund {
    id: string;
    amount: number;
    reason: string;
    status: string;
    processedAt: string;
    isOffline: boolean;
    paymentId: string;
    ticketId: string;
    processedById: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    permissions: string[];
    profilePhoto?: string;
    isVerified: boolean;
    lastSeenOffline: string;
    fraudScore: number;
    biometricId?: string;
    biometricConsent?: boolean;
}

export interface RolePermission {
    id: string;
    role: string;
    permission: string;
}

export interface Venue {
    id: string;
    name: string;
    address: string;
    city: string;
    capacity: number;
    coordinates: { lat: number; lng: number };
}

export interface AnalyticsSummaryItem {
    date: string;
    ticketsSold: number;
    revenue: number;
    attendanceRate?: number;
    type?: string;
    id?: string;
    name?: string;
    value?: number;
    change?: number;
    fraudScore?: number;
}
// Add to your existing schema.ts
export type SalesPoint = {
    date: string;
    revenue: number;
};

export type TicketTypeStats = {
    name: string;
    sold: number;
};

export type CheckInRate = {
    checkedIn: number;
    total: number;
};

export type AgeDemographic = {
    range: string;
    count: number;
};

export type LocationDemographic = {
    name: string;
    percentage: number;
};

export type Demographics = {
    age: AgeDemographic[];
    location: LocationDemographic[];
};

export type AnalyticsData = {
    salesOverTime: SalesPoint[];
    ticketTypes: TicketTypeStats[];
    checkInRate: CheckInRate;
    demographics: Demographics;
};

export interface AnalyticsItem {
    id: string;
    eventId: string;
    data: AnalyticsData;
    createdAt: string;
}