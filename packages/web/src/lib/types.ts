export type EventStatus = 'draft' | 'published' | 'completed' | 'canceled';

export type UserRole = 'ATTENDEE' | 'ORGANIZER' | 'VENDOR' | 'GATE_OPERATOR';

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: UserRole;
    isVerified: boolean;
    profilePhoto?: string | null;
};

export type AuthResponse = {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
};

export type AuthErrorResponse = {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
};

export type AuthErrorCode =
    | 'auth/invalid-email'
    | 'auth/invalid-credential'
    | 'auth/email-already-in-use'
    | 'auth/invalid-token'
    | 'auth/no-token'
    | 'auth/user-not-found'
    | 'auth/invalid-refresh'
    | 'validation/error'
    | 'auth/email-not-verified'
    | 'auth/reset-password-failed'
    | string;

export interface AuthError {
    code?: AuthErrorCode;
    message: string;
    errors?: Record<string, string[]>;
}



export type Event = {
    id: number;
    name: string;
    date: string;
    location: string;
    image: string;
    ticketsLeft: number | null;
    imagePriority: boolean;
    category: string;
    price: number;
    status?: EventStatus;
};

export type MainEvents = {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    price: number;
    category: string;
    isFree?: boolean;
    isTrending?: boolean;
    isPopular?: boolean;
    rating: number;
    ticketsLeft: number;
    totalTickets: number;
    ticketsSold: number;
    earlyBirdPrice?: number;
    earlyBirdCutoff?: string;
}

export type TextVariation = {
    title: string;
    description: string;
};

export interface OrganizerEvent {
    id: number;
    title: string;
    date: string;
    status: EventStatus;
    attendees: number;
    revenue: number;
    ticketsSold: number;
    capacity: number;
    image?: string;
}

export interface Artist {
    id: string;
    name: string;
    image: string;
    genre: string;
    rating: number;
    upcomingEvents: number;
    isLocal: boolean;
    socialMedia?: {
        twitter?: string;
        instagram?: string;
        facebook?: string;
    };
    nextThreeShows?: Performance[];
    location?: string
}

export interface Performance {
    id: string;
    date: string;
    venue: string;
    city: string;
    ticketUrl?: string;
}

export interface FormData {
    email: string;
    password: string;
}