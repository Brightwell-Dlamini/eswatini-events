'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Shell from '@/components/site/Shell';
import { api } from '@/lib/api';
import { ApiEvent } from '@/lib/types';
import { EVENT_TYPES } from '@/lib/constants';

export default function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    api
      .getEvents()
      .then(setEvents)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchType = filter === 'all' || e.type === filter;
    const query = q.toLowerCase();
    const matchQ =
      !query ||
      e.name.toLowerCase().includes(query) ||
      (e.city || '').toLowerCase().includes(query) ||
      (e.address || '').toLowerCase().includes(query);
    return matchType && matchQ;
  });

  const minPrice = (e: ApiEvent) => {
    if (!e.ticketTypes?.length) return null;
    return Math.min(...e.ticketTypes.map((t) => t.currentPrice ?? t.price));
  };

  return (
    <Shell>
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Events</h1>
          <p className="mt-2 text-indigo-100">Discover what’s on across Eswatini</p>
          <div className="mt-6 relative max-w-xl">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-200" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or city…"
              className="w-full rounded-xl border-0 bg-white/15 backdrop-blur pl-10 pr-4 py-3 text-white placeholder:text-indigo-200 focus:ring-2 focus:ring-white/50 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-8">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
          {EVENT_TYPES.slice(0, 8).map((t) => (
            <Chip
              key={t.value}
              active={filter === t.value}
              onClick={() => setFilter(t.value)}
              label={t.label}
            />
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-8 text-center">
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            <p className="mt-2 text-sm text-red-600/70">
              Is the API running? Set NEXT_PUBLIC_API_URL if needed.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-zinc-300" />
            <p className="mt-4 font-medium text-zinc-900 dark:text-white">No events found</p>
            <p className="text-sm text-zinc-500">Try a different search or filter</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => {
            const price = minPrice(event);
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative h-48">
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition duration-500"
                    unoptimized
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 dark:bg-zinc-900/90 text-[11px] font-bold uppercase px-2.5 py-1 text-indigo-700 dark:text-indigo-300">
                    {event.type}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-semibold text-lg text-zinc-900 dark:text-white line-clamp-1">
                    {event.name}
                  </h2>
                  <div className="mt-2 space-y-1 text-sm text-zinc-500">
                    <p className="flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(event.startTime).toLocaleDateString('en-SZ', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {(event.city || event.address) && (
                      <p className="flex items-center gap-1.5">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="truncate">{event.city || event.address}</span>
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {price != null ? `From E${price.toFixed(0)}` : 'Tickets'}
                    </span>
                    <span className="rounded-full bg-indigo-600 text-white text-xs font-semibold px-3 py-1">
                      Get tickets
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'
      }`}
    >
      {label}
    </button>
  );
}
