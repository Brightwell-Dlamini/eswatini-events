'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ApiEvent, TicketTypeConfig, PaymentMethod } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { getAuthToken } from '@/lib/auth-token';
import Image from 'next/image';
import { PAYMENT_METHODS } from '@/lib/constants';

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<PaymentMethod>('MOMO');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getEvent(id);
        setEvent(data);
        const initial: Record<string, number> = {};
        data.ticketTypes?.forEach((tt) => {
          initial[tt.id] = 0;
        });
        setQuantities(initial);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const total = (event?.ticketTypes ?? []).reduce((sum, tt) => {
    const qty = quantities[tt.id] || 0;
    const price = tt.currentPrice ?? tt.price;
    return sum + price * qty;
  }, 0);

  const totalQty = Object.values(quantities).reduce((s, q) => s + q, 0);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/events/${id}`);
      return;
    }
    if (user?.role !== 'ATTENDEE') {
      setPurchaseError('Only attendees can purchase tickets. Please register as an attendee.');
      return;
    }
    if (totalQty === 0) {
      setPurchaseError('Select at least one ticket.');
      return;
    }

    setPurchasing(true);
    setPurchaseError(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const items = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

      await api.purchase(token, {
        eventId: event!.id,
        items,
        method,
        currency: 'SZL',
        idempotencyKey: `purchase-${event!.id}-${Date.now()}`,
      });

      setPurchaseSuccess(true);
    } catch (err) {
      setPurchaseError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
          <a href="/events" className="text-blue-600 underline">
            Back to events
          </a>
        </div>
      </div>
    );
  }

  if (purchaseSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your tickets for <strong>{event.name}</strong> are ready.
          </p>
          <a
            href="/tickets"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            View My Tickets
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative h-64 sm:h-80 w-full">
        <Image
          src={event.imageUrl}
          alt={event.name}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <span className="text-xs uppercase tracking-wide bg-blue-600 px-2 py-0.5 rounded">
            {event.type}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">{event.name}</h1>
          <p className="text-sm mt-1 opacity-90">
            {new Date(event.startTime).toLocaleString('en-SZ', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
            {event.city && ` · ${event.city}`}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-3">About</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {event.description}
            </p>
          </section>

          {(event.address || event.city) && (
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h2 className="font-semibold text-lg mb-3">Location</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {event.address}
                {event.city && `, ${event.city}`}
                {event.country && `, ${event.country}`}
              </p>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow sticky top-6">
            <h2 className="font-semibold text-lg mb-4">Get Tickets</h2>

            {(event.ticketTypes ?? []).length === 0 && (
              <p className="text-gray-500 text-sm">No tickets available yet.</p>
            )}

            <div className="space-y-4">
              {(event.ticketTypes ?? []).map((tt: TicketTypeConfig) => {
                const remaining =
                  tt.quantity != null ? tt.quantity - tt.sold : null;
                const price = tt.currentPrice ?? tt.price;
                const max = Math.min(tt.maxPerOrder ?? 10, remaining ?? 10);

                return (
                  <div
                    key={tt.id}
                    className="border-b border-gray-100 dark:border-gray-700 pb-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{tt.name}</p>
                        {tt.description && (
                          <p className="text-xs text-gray-500">{tt.description}</p>
                        )}
                        {remaining != null && (
                          <p className="text-xs text-gray-400">{remaining} left</p>
                        )}
                      </div>
                      <p className="font-semibold">E{price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() =>
                          setQuantities((q) => ({
                            ...q,
                            [tt.id]: Math.max(0, (q[tt.id] || 0) - 1),
                          }))
                        }
                        disabled={(quantities[tt.id] || 0) <= 0}
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium">
                        {quantities[tt.id] || 0}
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() =>
                          setQuantities((q) => ({
                            ...q,
                            [tt.id]: Math.min(max, (q[tt.id] || 0) + 1),
                          }))
                        }
                        disabled={(quantities[tt.id] || 0) >= max || max <= 0}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalQty > 0 && (
              <>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Payment method
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                  >
                    {PAYMENT_METHODS.filter((m) =>
                      ['MOMO', 'VISA', 'MASTERCARD', 'CASH'].includes(m.value)
                    ).map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center mt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>E{total.toFixed(2)}</span>
                </div>
              </>
            )}

            {purchaseError && (
              <p className="text-red-600 text-sm mt-3">{purchaseError}</p>
            )}

            <button
              onClick={handlePurchase}
              disabled={purchasing || totalQty === 0}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {purchasing
                ? 'Processing…'
                : !isAuthenticated
                  ? 'Sign in to purchase'
                  : totalQty === 0
                    ? 'Select tickets'
                    : `Pay E${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
