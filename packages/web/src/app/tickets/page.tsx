'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Ticket } from '@/lib/types';
import { getAuthToken } from '@/lib/auth-token';

export default function MyTicketsPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/tickets');
      return;
    }
    const token = getAuthToken();
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    api
      .getMyTickets(token)
      .then(setTickets)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, router]);

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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">My tickets</h1>
        <p className="mt-1 text-zinc-500">Show the QR code at the entrance.</p>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {!error && tickets.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
            <p className="text-zinc-500">No tickets yet.</p>
            <Link
              href="/events"
              className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Browse events
            </Link>
          </div>
        )}

        <ul className="mt-8 space-y-4">
          {tickets.map((t) => (
            <li
              key={t.id}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5"
            >
              {t.event?.imageUrl && (
                <div className="relative h-24 w-full sm:w-28 rounded-xl overflow-hidden shrink-0">
                  <Image src={t.event.imageUrl} alt="" fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 dark:text-white truncate">
                  {t.event?.name ?? 'Event'}
                </p>
                <p className="text-sm text-zinc-500">
                  {t.ticketType?.name} · E{t.price.toFixed(2)}
                </p>
                {t.event?.startTime && (
                  <p className="text-sm text-zinc-500">
                    {new Date(t.event.startTime).toLocaleString('en-SZ', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                )}
                <p className="mt-1 font-mono text-xs text-zinc-400">{t.ticketNumber}</p>
                <span
                  className={`mt-2 inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    t.status === 'VALID'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      : t.status === 'SCANNED'
                        ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {t.status}
                </span>
              </div>
              {t.qrCode && t.status === 'VALID' && (
                <button
                  type="button"
                  onClick={() => setQr(t.qrCode)}
                  className="self-center shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-700 p-1 hover:ring-2 ring-indigo-500 transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.qrCode} alt="QR" width={72} height={72} className="rounded-lg" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {qr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setQr(null)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-zinc-900 mb-4">Entry QR</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Ticket QR" className="mx-auto w-56 h-56" />
            <button
              type="button"
              onClick={() => setQr(null)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
