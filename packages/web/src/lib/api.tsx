import {
  User,
  AuthResponse,
  AuthErrorResponse,
  ApiEvent,
  TicketTypeConfig,
  Ticket,
  PurchaseRequest,
  PurchaseResponse,
  OrganizerSummary,
} from '@/lib/types';
import { API_BASE_URL } from './constants';
import { LoginFormData, RegisterApiData } from './validation';

class NetworkError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData: AuthErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        code: `HTTP_${response.status}`,
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      };
    }

    const message =
      errorData.error || errorData.message || `Request failed (${response.status})`;

    if (response.status >= 500) {
      throw new NetworkError(response.status, message);
    }

    throw new AuthError(
      errorData.code || `HTTP_${response.status}`,
      message,
      errorData
    );
  }

  return response.json();
};

function authHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await handleResponse(response);
    } catch (error) {
      if (error instanceof NetworkError || error instanceof AuthError) {
        throw error;
      }
      throw new NetworkError(0, 'Network request failed');
    }
  },

  // ── Auth ──────────────────────────────────────────────
  async login(data: LoginFormData): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async register(data: RegisterApiData): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(token: string): Promise<User> {
    return this.request('/auth/me', {
      headers: authHeaders(token),
    });
  },

  async logout(token: string): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
      headers: authHeaders(token),
    });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  async googleAuth(googleToken: string): Promise<AuthResponse> {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    });
  },

  async resetPassword(email: string): Promise<void> {
    await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyEmail(token: string): Promise<void> {
    await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async resendVerification(): Promise<void> {
    await this.request('/auth/resend-verification', { method: 'POST' });
  },

  // ── Events ────────────────────────────────────────────
  async getEvents(params?: {
    type?: string;
    city?: string;
    from?: string;
    to?: string;
    featured?: boolean;
  }): Promise<ApiEvent[]> {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.city) qs.set('city', params.city);
    if (params?.from) qs.set('from', params.from);
    if (params?.to) qs.set('to', params.to);
    if (params?.featured) qs.set('featured', 'true');
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return this.request(`/events${query}`);
  },

  async getEvent(idOrSlug: string): Promise<ApiEvent> {
    return this.request(`/events/${idOrSlug}`);
  },

  async getMyEvents(token: string): Promise<ApiEvent[]> {
    return this.request('/events/organizer/mine', {
      headers: authHeaders(token),
    });
  },

  async createEvent(token: string, data: Record<string, unknown>): Promise<ApiEvent> {
    return this.request('/events', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  async updateEvent(
    token: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<ApiEvent> {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  async publishEvent(token: string, id: string): Promise<ApiEvent> {
    return this.request(`/events/${id}/publish`, {
      method: 'POST',
      headers: authHeaders(token),
    });
  },

  async unpublishEvent(token: string, id: string): Promise<ApiEvent> {
    return this.request(`/events/${id}/unpublish`, {
      method: 'POST',
      headers: authHeaders(token),
    });
  },

  async deleteEvent(token: string, id: string): Promise<void> {
    await this.request(`/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
  },

  // ── Ticket Types ──────────────────────────────────────
  async getTicketTypes(eventId: string): Promise<TicketTypeConfig[]> {
    return this.request(`/ticket-types/event/${eventId}`);
  },

  async createTicketType(
    token: string,
    data: Record<string, unknown>
  ): Promise<TicketTypeConfig> {
    return this.request('/ticket-types', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  async updateTicketType(
    token: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<TicketTypeConfig> {
    return this.request(`/ticket-types/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  // ── Purchase & Tickets ────────────────────────────────
  async purchase(token: string, data: PurchaseRequest): Promise<PurchaseResponse> {
    return this.request('/payments/purchase', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  async getMyTickets(token: string): Promise<Ticket[]> {
    return this.request('/tickets/my', {
      headers: authHeaders(token),
    });
  },

  async getEventTickets(token: string, eventId: string): Promise<Ticket[]> {
    return this.request(`/tickets/event/${eventId}`, {
      headers: authHeaders(token),
    });
  },

  async validateTicket(
    token: string,
    ticketNumber: string,
    eventId?: string
  ): Promise<{
    message: string;
    ticket: Ticket;
  }> {
    return this.request('/tickets/validate', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ ticketNumber, eventId }),
    });
  },

  // ── Analytics ─────────────────────────────────────────
  async getOrganizerSummary(token: string): Promise<OrganizerSummary> {
    return this.request('/analytics/organizer/summary', {
      headers: authHeaders(token),
    });
  },

  async getEventAnalytics(token: string, eventId: string) {
    return this.request(`/analytics/events/${eventId}`, {
      headers: authHeaders(token),
    });
  },
};

export { NetworkError, AuthError };
