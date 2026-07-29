'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Ticket } from '@/lib/types';
import { getAuthToken } from '@/lib/auth-token';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MyTicketsPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/tickets');
      return;
    }

    (async () => {
      try {
        const token = getAuthToken();
        if (!token) throw new Error('Not authenticated');
        const data = await api.getMyTickets(token);
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">My Tickets</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Present the QR code at the gate for entry.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {tickets.length === 0 && !error && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-500 mb-4">You have no tickets yet.</p>
            <a
              href="/events"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Events
            </a>
          </div>
        )}

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col sm:flex-row gap-4 items-start"
            >
              {ticket.event?.imageUrl && (
                <div className="relative w-full sm:w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={ticket.event.imageUrl}
                    alt={ticket.event.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                  {ticket.event?.name ?? 'Event'}
                </h2>
                <p className="text-sm text-gray-500">
                  {ticket.ticketType?.name} · E{ticket.price.toFixed(2)}
                </p>
                {ticket.event?.startTime && (
                  <p className="text-sm text-gray-500">
                    {new Date(ticket.event.startTime).toLocaleString('en-SZ', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1 font-mono">{ticket.ticketNumber}</p>
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                    ticket.status === 'VALID'
                      ? 'bg-green-100 text-green-800'
                      : ticket.status === 'SCANNED'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              {ticket.qrCode && ticket.status === 'VALID' && (
                <button
                  onClick={() => setSelectedQr(ticket.qrCode)}
                  className="flex-shrink-0 border rounded-lg p-1 hover:ring-2 ring-blue-500 transition"
                  title="Show QR code"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ticket.qrCode} alt="QR" width={80} height={80} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedQr && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedQr(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4">Entry QR Code</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedQr} alt="Ticket QR" className="mx-auto w-64 h-64" />
            <p className="text-sm text-gray-500 mt-4">Show this at the gate</p>
            <button
              onClick={() => setSelectedQr(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
