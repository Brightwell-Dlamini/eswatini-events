'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';

function LoginForm() {
  const { login, loading } = useAuth();
  const search = useSearchParams();
  const redirect = search.get('redirect');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      // Auth context handles default redirect; optional override:
      if (redirect && typeof window !== 'undefined') {
        window.location.href = redirect;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-20">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-500">Log in to manage tickets and events</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-5"
      >
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>
        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-xs text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 transition"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        No account?{' '}
        <Link href="/auth/register" className="font-semibold text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Shell hideFooter>
      <Suspense fallback={<div className="py-32 text-center text-sm text-zinc-500">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </Shell>
  );
}
