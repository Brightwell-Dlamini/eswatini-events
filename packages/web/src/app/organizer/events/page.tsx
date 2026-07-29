'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      const data = await api.getMyEvents(token);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || user?.role !== 'ORGANIZER') {
      router.push('/auth/login?redirect=/organizer/events');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user]);

  const handlePublish = async (id: string) => {
    setActionLoading(id);
    try {
      const token = getAuthToken()!;
      await api.publishEvent(token, id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    setActionLoading(id);
    try {
      const token = getAuthToken()!;
      await api.unpublishEvent(token, id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unpublish failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this event?')) return;
    setActionLoading(id);
    try {
      const token = getAuthToken()!;
      await api.deleteEvent(token, id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Events</h1>
          <Link
            href="/organizer/events/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            + New Event
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {events.length === 0 && !error && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-500 mb-4">No events yet.</p>
            <Link
              href="/organizer/events/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create your first event
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event) => {
            const sold =
              event.ticketTypes?.reduce((s, t) => s + (t.sold || 0), 0) ?? 0;
            return (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg truncate">{event.name}</h2>
                    <StatusBadge status={event.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.startTime).toLocaleString('en-SZ', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                    {event.city && ` · ${event.city}`}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">{sold} tickets sold</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    View
                  </Link>
                  {event.status !== 'PUBLISHED' && (
                    <button
                      disabled={actionLoading === event.id}
                      onClick={() => handlePublish(event.id)}
                      className="text-sm px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Publish
                    </button>
                  )}
                  {event.status === 'PUBLISHED' && (
                    <button
                      disabled={actionLoading === event.id}
                      onClick={() => handleUnpublish(event.id)}
                      className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    disabled={actionLoading === event.id}
                    onClick={() => handleDelete(event.id)}
                    className="text-sm px-3 py-1.5 rounded text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50"
                  >
                    Archive
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-800',
    DRAFT: 'bg-gray-100 text-gray-600',
    CANCELLED: 'bg-red-100 text-red-700',
    PENDING: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  );
}
