'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/app/contexts/auth-context';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');
  const { handleGoogleAuth } = useAuth();

  useEffect(() => {
    if (token) {
      handleGoogleAuth(token).catch(() => {
        window.location.href = '/auth/login?error=google_auth_failed';
      });
    } else if (error) {
      window.location.href = `/auth/login?error=${error}`;
    } else {
      window.location.href = '/auth/login?error=unknown_error';
    }
  }, [token, error, handleGoogleAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner className="h-12 w-12 mx-auto" />
        <p className="mt-4 text-lg">Signing in with Google...</p>
      </div>
    </div>
  );
}
