/**
 * Simple client-side token helpers used by pages that need a quick sync read.
 * The AuthContext also writes to sessionStorage as a fallback.
 */

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('authToken');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    sessionStorage.setItem('authToken', token);
  } catch {
    // ignore
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('refreshToken');
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string) {
  try {
    sessionStorage.setItem('refreshToken', token);
  } catch {
    // ignore
  }
}

export function clearTokens() {
  try {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('tokenExpiry');
  } catch {
    // ignore
  }
}
