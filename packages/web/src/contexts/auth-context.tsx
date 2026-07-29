'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User, AuthResponse } from '@/lib/types';
import { LoginFormData, RegisterApiData } from '@/lib/validation';
import { clearTokens } from '@/lib/auth-token';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterApiData) => Promise<void>;
  logout: () => Promise<void>;
  handleGoogleAuth: (token: string) => Promise<void>;
  refresh: () => Promise<void>;
  sessionTimeout: number | null;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_TIMEOUT = 30 * 60 * 1000;
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;
const MAX_RETRY_ATTEMPTS = 3;

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

class NetworkError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(null);
  const router = useRouter();

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const isAuthenticated = !!user;

  // Always write sessionStorage so pages using getAuthToken() work.
  // Optionally also try cookie API routes if present.
  const setSecureItem = useCallback(async (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      console.warn('sessionStorage not available');
    }
    try {
      await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
        credentials: 'include',
      });
    } catch {
      // cookie route optional
    }
  }, []);

  const getSecureItem = useCallback(async (key: string): Promise<string | null> => {
    try {
      const fromSession = sessionStorage.getItem(key);
      if (fromSession) return fromSession;
    } catch {
      // ignore
    }
    try {
      const response = await fetch(`/api/auth/get-token?key=${key}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        return data.value;
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  const removeSecureItem = useCallback(async (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
    try {
      await fetch('/api/auth/remove-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
        credentials: 'include',
      });
    } catch {
      // ignore
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (tokenRefreshTimerRef.current) {
      clearTimeout(tokenRefreshTimerRef.current);
      tokenRefreshTimerRef.current = null;
    }
  }, []);

  const clearAuthState = useCallback(async () => {
    await removeSecureItem('authToken');
    await removeSecureItem('refreshToken');
    await removeSecureItem('tokenExpiry');
    clearTokens();
    setUser(null);
    setSessionTimeout(null);
    clearTimers();
    retryCountRef.current = 0;
  }, [removeSecureItem, clearTimers]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getSecureItem('authToken');
      if (token) await api.logout(token);
      await clearAuthState();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      await clearAuthState();
    } finally {
      setLoading(false);
    }
  }, [getSecureItem, clearAuthState, router]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (isAuthenticated) {
      inactivityTimerRef.current = setTimeout(() => {
        logout();
        router.push('/auth/login?error=session_timeout');
      }, SESSION_TIMEOUT);
      setSessionTimeout(Date.now() + SESSION_TIMEOUT);
    }
  }, [isAuthenticated, router, logout]);

  const refresh = useCallback(
    async (retryCount = 0): Promise<void> => {
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        await logout();
        return;
      }
      setLoading(true);
      try {
        const storedRefreshToken = await getSecureItem('refreshToken');
        if (!storedRefreshToken)
          throw new AuthError('NO_REFRESH_TOKEN', 'No refresh token available');
        const response = await api.refreshToken(storedRefreshToken);

        const { user, token, refreshToken, expiresIn = 3600 } = response;
        await setSecureItem('authToken', token);
        if (refreshToken) await setSecureItem('refreshToken', refreshToken);
        await setSecureItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString());
        setUser(user);
        resetInactivityTimer();

        if (tokenRefreshTimerRef.current) clearTimeout(tokenRefreshTimerRef.current);
        const refreshTime = expiresIn * 1000 - TOKEN_REFRESH_BUFFER;
        tokenRefreshTimerRef.current = setTimeout(() => refresh(), refreshTime);
        retryCountRef.current = 0;
      } catch (error) {
        console.error('Token refresh failed:', error);
        if (error instanceof NetworkError && error.status >= 500) {
          setTimeout(() => refresh(retryCount + 1), 1000 * Math.pow(2, retryCount));
        } else {
          await logout();
        }
      } finally {
        setLoading(false);
      }
    },
    [getSecureItem, setSecureItem, resetInactivityTimer, logout]
  );

  const handleAuthSuccess = useCallback(
    (response: AuthResponse) => {
      const { user, token, refreshToken, expiresIn = 3600 } = response;
      setSecureItem('authToken', token);
      if (refreshToken) setSecureItem('refreshToken', refreshToken);
      setSecureItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString());
      setUser(user);
      resetInactivityTimer();

      if (tokenRefreshTimerRef.current) clearTimeout(tokenRefreshTimerRef.current);
      const refreshTime = expiresIn * 1000 - TOKEN_REFRESH_BUFFER;
      tokenRefreshTimerRef.current = setTimeout(() => refresh(), refreshTime);
      retryCountRef.current = 0;
    },
    [setSecureItem, resetInactivityTimer, refresh]
  );

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => resetInactivityTimer();
    events.forEach((event) => window.addEventListener(event, handleActivity));
    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearTimers();
    };
  }, [resetInactivityTimer, clearTimers]);

  const loadUser = useCallback(async () => {
    try {
      const storedToken = await getSecureItem('authToken');
      const tokenExpiry = await getSecureItem('tokenExpiry');
      if (storedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        const user = await api.getCurrentUser(storedToken);
        setUser(user);
        resetInactivityTimer();
        const expiresIn = (parseInt(tokenExpiry) - Date.now()) / 1000;
        if (expiresIn > TOKEN_REFRESH_BUFFER / 1000) {
          if (tokenRefreshTimerRef.current) clearTimeout(tokenRefreshTimerRef.current);
          tokenRefreshTimerRef.current = setTimeout(
            () => refresh(),
            expiresIn * 1000 - TOKEN_REFRESH_BUFFER
          );
        } else {
          await refresh();
        }
      } else if (storedToken && !tokenExpiry) {
        // Token present without expiry — try to use it
        try {
          const user = await api.getCurrentUser(storedToken);
          setUser(user);
          resetInactivityTimer();
        } catch {
          await clearAuthState();
        }
      } else {
        await clearAuthState();
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      await clearAuthState();
    } finally {
      setLoading(false);
    }
  }, [getSecureItem, clearAuthState, resetInactivityTimer, refresh]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.login(data);
      handleAuthSuccess(response);
      const role = response.user.role;
      if (role === 'ORGANIZER') router.push('/organizer/dashboard');
      else if (role === 'GATE_OPERATOR') router.push('/scanner');
      else router.push('/tickets');
    } catch (error) {
      throw new AuthError(
        'LOGIN_FAILED',
        error instanceof Error ? error.message : 'Login failed',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterApiData) => {
    setLoading(true);
    try {
      const response = await api.register(data);
      handleAuthSuccess(response);
      const redirectPath =
        data.role === 'ORGANIZER'
          ? '/organizer/dashboard'
          : data.role === 'GATE_OPERATOR'
            ? '/scanner'
            : '/tickets';
      router.push(redirectPath);
    } catch (error) {
      throw new AuthError(
        'REGISTRATION_FAILED',
        error instanceof Error ? error.message : 'Registration failed',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (token: string) => {
    try {
      const response = await api.googleAuth(token);
      handleAuthSuccess(response);
      return response;
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await api.resetPassword(email);
    } catch (error) {
      throw new AuthError(
        'PASSWORD_RESET_FAILED',
        error instanceof Error ? error.message : 'Password reset failed',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setLoading(true);
    try {
      await api.verifyEmail(token);
      await loadUser();
    } catch (error) {
      throw new AuthError(
        'EMAIL_VERIFICATION_FAILED',
        error instanceof Error ? error.message : 'Email verification failed',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      await api.resendVerification();
    } catch (error) {
      throw new AuthError(
        'RESEND_VERIFICATION_FAILED',
        error instanceof Error ? error.message : 'Failed to resend verification',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        handleGoogleAuth,
        refresh,
        sessionTimeout,
        resetPassword,
        verifyEmail,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
