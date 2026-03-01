'use client';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';

interface GoogleButtonProps {
  loading?: boolean;
}

export function GoogleButton({ loading }: GoogleButtonProps) {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.671-0.069-1.325-0.189-1.955h-9.811z" />
          </svg>
          Sign in with Google
        </>
      )}
    </button>
  );
}
