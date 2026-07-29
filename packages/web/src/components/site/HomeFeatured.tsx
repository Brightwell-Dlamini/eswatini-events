'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { ApiEvent } from '@/lib/types';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function HomeFeatured() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEvents({ featured: true })
      .then((data) => setEvents(data.slice(0, 6)))
      .catch(() =>
        api
          .getEvents()
          .then((data) => setEvents(data.slice(0, 6)))
          .catch(() => setEvents([]))
      )
      .finally(() => setLoading(false));
  }, []);

  const minPrice = (e: ApiEvent) => {
    if (!e.ticketTypes?.length) return null;
    return Math.min(...e.ticketTypes.map((t) => t.currentPrice ?? t.price));
  };

  return (
    <section className="bg-white dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Upcoming events
            </h2>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
              Happening across Eswatini
            </p>
          </div>
          <Link
            href="/events"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
          >
            View all →
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 h-72 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
            <p className="text-zinc-500">No published events yet. Check back soon.</p>
            <Link
              href="/organizer/events/new"
              className="mt-4 inline-block text-sm font-semibold text-indigo-600"
            >
              Be the first to host one
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const price = minPrice(event);
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition"
              >
                <div className="relative h-44 sm:h-48">
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 dark:bg-zinc-900/90 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 text-indigo-700 dark:text-indigo-300">
                    {event.type}
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {event.name}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <p className="flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4 shrink-0" />
                      {new Date(event.startTime).toLocaleDateString('en-SZ', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    {(event.city || event.address) && (
                      <p className="flex items-center gap-1.5">
                        <MapPinIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{event.city || event.address}</span>
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {price != null ? `From E${price.toFixed(0)}` : 'See tickets'}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      Get tickets
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
