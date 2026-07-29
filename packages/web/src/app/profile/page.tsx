'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !user) {
    return (
      <Shell>
        <div className="flex justify-center py-32">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Account</h1>
        <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
          <Row label="Name" value={user.name || '—'} />
          <Row label="Email" value={user.email || '—'} />
          <Row label="Phone" value={user.phone || '—'} />
          <Row label="Role" value={user.role} />
          <Row label="Verified" value={user.isVerified ? 'Yes' : 'No'} />
        </div>

        <div className="mt-6 grid gap-2">
          <Link
            href="/tickets"
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            My tickets
          </Link>
          {user.role === 'ORGANIZER' && (
            <Link
              href="/organizer/dashboard"
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Organizer dashboard
            </Link>
          )}
          {user.role === 'GATE_OPERATOR' && (
            <Link
              href="/scanner"
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Open scanner
            </Link>
          )}
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-xl border border-red-200 dark:border-red-900 text-red-600 px-4 py-3 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
          >
            Log out
          </button>
        </div>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-white text-right">{value}</span>
    </div>
  );
}
