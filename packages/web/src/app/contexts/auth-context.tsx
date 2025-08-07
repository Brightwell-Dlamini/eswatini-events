// contexts/auth-context.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Define a simplified User type that matches what you need
type User = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  profilePhoto?: string | null;
  isVerified?: boolean;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  handleGoogleAuth: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          const user = await api.getCurrentUser(storedToken);
          setUser(user);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, token } = await api.login({ email, password });
      localStorage.setItem('authToken', token);
      setUser(user);
      setToken(token);
      router.push('/profile');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { user, token } = await api.register(data);
      localStorage.setItem('authToken', token);
      setUser(user);
      setToken(token);
      router.push('/profile');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = async (token: string) => {
    setLoading(true);
    try {
      localStorage.setItem('authToken', token);
      const user = await api.getCurrentUser(token);
      setUser(user);
      setToken(token);
      router.push('/profile');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        register,
        logout,
        handleGoogleAuth,
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
