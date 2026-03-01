'use client';

import { useEffect, Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { Spinner } from '@/components/ui/spinner';

import { useAuth } from '@/contexts/auth-context';

import { useRouter } from 'next/navigation';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const { handleGoogleAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    const error = searchParams.get('error');

    const message = searchParams.get('message');

    const handleAuth = async () => {
      if (token) {
        try {
          await handleGoogleAuth(token);

          // Redirect to appropriate dashboard based on user role

          router.push('/profile');
        } catch (err) {
          console.error('Google auth failed:', err);

          const errorMessage =
            err instanceof Error ? err.message : 'Authentication failed';

          router.push(
            `/auth/login?error=google_auth_failed&message=${encodeURIComponent(errorMessage)}`
          );
        }
      } else if (error) {
        const errorMsg = message || 'Google authentication failed';

        router.push(
          `/auth/login?error=${error}&message=${encodeURIComponent(errorMsg)}`
        );
      } else {
        router.push('/auth/login?error=unknown_error');
      }
    };

    handleAuth();
  }, [searchParams, handleGoogleAuth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner className="h-12 w-12 mx-auto" />

        <p className="mt-4 text-lg">Completing Google sign in...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner className="h-12 w-12 mx-auto" />

            <p className="mt-4 text-lg">Processing authentication...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
