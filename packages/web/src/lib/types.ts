export type UserRole =
  | 'ATTENDEE'
  | 'ORGANIZER'
  | 'VENDOR'
  | 'GATE_OPERATOR'
  | 'SUPER_ADMIN';

export type EventStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'POSTPONED';

export type TicketStatus =
  | 'PENDING'
  | 'VALID'
  | 'SCANNED'
  | 'REFUNDED'
  | 'TRANSFERRED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PaymentMethod =
  | 'MOMO'
  | 'MPESA'
  | 'VISA'
  | 'MASTERCARD'
  | 'CASH'
  | 'BANK_TRANSFER';

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  isVerified: boolean;
  profilePhoto?: string | null;
  company?: string | null;
};

export type AuthResponse = {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn?: number;
};

export type AuthErrorResponse = {
  code?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  details?: unknown;
};

export type TicketTypeConfig = {
  id: string;
  name: string;
  type: string;
  price: number;
  currentPrice?: number | null;
  description?: string | null;
  quantity?: number | null;
  sold: number;
  minPerOrder?: number;
  maxPerOrder?: number;
  salesStart?: string | null;
  salesEnd?: string | null;
};

export type ApiEvent = {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string;
  type: string;
  status: EventStatus;
  imageUrl: string;
  coverImage?: string | null;
  capacity?: number | null;
  slug: string;
  isFeatured?: boolean;
  isFree?: boolean;
  minPrice?: number | null;
  maxPrice?: number | null;
  organizer?: { id: string; name: string; email?: string };
  venue?: { name: string; address?: string; amenities?: string[] } | null;
  ticketTypes?: TicketTypeConfig[];
  publishedAt?: string | null;
  createdAt?: string;
};

export type Ticket = {
  id: string;
  ticketNumber: string;
  qrCode: string;
  price: number;
  status: TicketStatus;
  ticketTypeId: string;
  eventId: string;
  event?: {
    id: string;
    name: string;
    startTime: string;
    endTime?: string | null;
    address?: string | null;
    city?: string | null;
    imageUrl?: string;
  };
  ticketType?: { name: string; type?: string };
  owner?: { id: string; name: string; email?: string; phone?: string } | null;
  createdAt?: string;
};

export type PurchaseItem = {
  ticketTypeId: string;
  quantity: number;
};

export type PurchaseRequest = {
  eventId: string;
  items: PurchaseItem[];
  method: PaymentMethod;
  currency?: string;
  idempotencyKey?: string;
};

export type PurchaseResponse = {
  payment: {
    id: string;
    amount: number;
    method: PaymentMethod;
    status: string;
    currency: string;
    reference?: string;
  };
  tickets: Ticket[];
};

export type OrganizerSummary = {
  totalEvents: number;
  publishedEvents: number;
  totalRevenue: number;
  totalSold: number;
  totalScanned: number;
  currency: string;
  events: {
    id: string;
    name: string;
    status: EventStatus;
    startTime: string;
    ticketsSold: number;
    ticketsScanned: number;
    revenue: number;
  }[];
};

// Legacy types kept for existing UI components that still use mock shapes
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
  status?: string;
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
};

export type TextVariation = {
  title: string;
  description: string;
};

export interface OrganizerEvent {
  id: number;
  title: string;
  date: string;
  status: string;
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
  location?: string;
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
