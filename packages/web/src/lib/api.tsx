import { User, AuthResponse, AuthErrorResponse,  } from '@/lib/types';
import { API_BASE_URL } from './constants';
import { LoginFormData, RegisterApiData,  } from './validation';

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

    if (response.status >= 500) {
      throw new NetworkError(
        response.status,
        errorData.message || 'Server error'
      );
    }

    throw new AuthError(
      errorData.code || `HTTP_${response.status}`,
      errorData.message || 'Request failed',
      errorData
    );
  }

  return response.json();
};

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

  async login(data: LoginFormData): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<AuthResponse>;
  },
  async register(data: RegisterApiData): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<AuthResponse>;
  },
  async getCurrentUser(token: string): Promise<User> {
    return this.request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Promise<User>;
  },

  async logout(token: string): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }) as Promise<AuthResponse>;
  },

  async googleAuth(googleToken: string): Promise<AuthResponse> {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    }) as Promise<AuthResponse>;
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
    await this.request('/auth/resend-verification', {
      method: 'POST',
    });
  },
};
