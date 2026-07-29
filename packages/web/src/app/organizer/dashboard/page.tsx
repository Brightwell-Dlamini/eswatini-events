'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { OrganizerSummary } from '@/lib/types';
import { getAuthToken } from '@/lib/auth-token';

export default function OrganizerDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<OrganizerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== 'ORGANIZER') {
      router.push('/auth/login?redirect=/organizer/dashboard');
      return;
    }
    const token = getAuthToken();
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    api
      .getOrganizerSummary(token)
      .then(setSummary)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || loading) {
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Welcome back{user?.name ? `, ${user.name}` : ''}</p>
          </div>
          <Link
            href="/organizer/events/new"
            className="inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + New event
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {error} — showing empty state until the API is available.
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <Stat label="Events" value={String(summary?.totalEvents ?? 0)} />
          <Stat label="Published" value={String(summary?.publishedEvents ?? 0)} />
          <Stat label="Tickets sold" value={String(summary?.totalSold ?? 0)} />
          <Stat
            label="Revenue"
            value={`E${(summary?.totalRevenue ?? 0).toLocaleString()}`}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Your events</h2>
          <Link href="/organizer/events" className="text-sm text-indigo-600 font-medium">
            Manage all →
          </Link>
        </div>

        {(summary?.events?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center">
            <p className="text-zinc-500">No events yet.</p>
            <Link
              href="/organizer/events/new"
              className="mt-4 inline-block text-sm font-semibold text-indigo-600"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {summary!.events.slice(0, 5).map((ev) => (
              <li
                key={ev.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{ev.name}</p>
                  <p className="text-xs text-zinc-500">
                    {ev.status} · {ev.ticketsSold} sold · E{ev.revenue.toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/events/${ev.id}`}
                  className="text-sm text-indigo-600 font-medium shrink-0"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5">
      <p className="text-xs sm:text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}
