'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { ApiEvent } from '@/lib/types';
import { getAuthToken } from '@/lib/auth-token';

export default function OrganizerEventsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');
    setEvents(await api.getMyEvents(token));
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== 'ORGANIZER') {
      router.push('/auth/login?redirect=/organizer/events');
      return;
    }
    load()
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user]);

  const act = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id);
    try {
      await fn();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  };

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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My events</h1>
          <Link
            href="/organizer/events/new"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + New
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {events.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-zinc-500">
            No events yet.{' '}
            <Link href="/organizer/events/new" className="text-indigo-600 font-semibold">
              Create one
            </Link>
          </div>
        )}

        <ul className="space-y-3">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold truncate">{ev.name}</h2>
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600">
                    {ev.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {new Date(ev.startTime).toLocaleString('en-SZ', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                  {ev.city ? ` · ${ev.city}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/events/${ev.id}`}
                  className="text-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  View
                </Link>
                {ev.status !== 'PUBLISHED' && (
                  <button
                    type="button"
                    disabled={busy === ev.id}
                    onClick={() =>
                      act(ev.id, () => api.publishEvent(getAuthToken()!, ev.id))
                    }
                    className="text-sm px-3 py-1.5 rounded-lg bg-green-600 text-white disabled:opacity-50"
                  >
                    Publish
                  </button>
                )}
                {ev.status === 'PUBLISHED' && (
                  <button
                    type="button"
                    disabled={busy === ev.id}
                    onClick={() =>
                      act(ev.id, () => api.unpublishEvent(getAuthToken()!, ev.id))
                    }
                    className="text-sm px-3 py-1.5 rounded-lg border disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy === ev.id}
                  onClick={() => {
                    if (confirm('Archive this event?')) {
                      act(ev.id, () => api.deleteEvent(getAuthToken()!, ev.id));
                    }
                  }}
                  className="text-sm px-3 py-1.5 rounded-lg text-red-600 border border-red-200 disabled:opacity-50"
                >
                  Archive
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
