'use client';

import { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/site/Shell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Shell hideFooter>
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-white">
          Reset password
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Enter your email and we’ll send reset instructions when the mail service is connected.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-6 text-center text-sm">
            If an account exists for <strong>{email}</strong>, you’ll receive an email shortly.
            <Link href="/auth/login" className="mt-4 block font-semibold text-indigo-600">
              Back to login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4"
          >
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-3 hover:bg-indigo-500"
            >
              Send reset link
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/auth/login" className="text-indigo-600 font-medium hover:underline">
            ← Back to login
          </Link>
        </p>
      </div>
    </Shell>
  );
}
