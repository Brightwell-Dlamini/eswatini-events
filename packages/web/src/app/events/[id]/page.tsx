'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Shell from '@/components/site/Shell';
import { api } from '@/lib/api';
import { ApiEvent, TicketTypeConfig, PaymentMethod } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { getAuthToken } from '@/lib/auth-token';
import { PAYMENT_METHODS } from '@/lib/constants';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<PaymentMethod>('MOMO');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api
      .getEvent(id)
      .then((data) => {
        setEvent(data);
        const init: Record<string, number> = {};
        data.ticketTypes?.forEach((t) => {
          init[t.id] = 0;
        });
        setQuantities(init);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const totalQty = Object.values(quantities).reduce((s, n) => s + n, 0);
  const total = (event?.ticketTypes ?? []).reduce((sum, tt) => {
    const qty = quantities[tt.id] || 0;
    return sum + (tt.currentPrice ?? tt.price) * qty;
  }, 0);

  const purchase = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/events/${id}`);
      return;
    }
    if (user?.role !== 'ATTENDEE') {
      setPurchaseError('Sign in as an attendee to buy tickets.');
      return;
    }
    if (!totalQty) {
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
        idempotencyKey: `p-${event!.id}-${Date.now()}`,
      });
      setSuccess(true);
    } catch (e) {
      setPurchaseError(e instanceof Error ? e.message : 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="flex justify-center py-32">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </Shell>
    );
  }

  if (error || !event) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <p className="mt-2 text-zinc-500">{error}</p>
          <Link href="/events" className="mt-6 inline-block text-indigo-600 font-semibold">
            ← Back to events
          </Link>
        </div>
      </Shell>
    );
  }

  if (success) {
    return (
      <Shell>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">You’re booked</h1>
          <p className="mt-2 text-zinc-500">
            Tickets for <strong>{event.name}</strong> are in your account.
          </p>
          <Link
            href="/tickets"
            className="mt-8 inline-flex w-full justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            View my tickets
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="relative h-56 sm:h-72 lg:h-80 w-full">
        <Image src={event.imageUrl} alt={event.name} fill className="object-cover" unoptimized priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wide bg-indigo-600 text-white px-2 py-0.5 rounded">
            {event.type}
          </span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-white">{event.name}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/90">
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {new Date(event.startTime).toLocaleString('en-SZ', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </span>
            {(event.city || event.address) && (
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {[event.address, event.city].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h2 className="font-semibold text-lg mb-3">About this event</h2>
            <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Tickets</h2>
            {(event.ticketTypes ?? []).length === 0 && (
              <p className="text-sm text-zinc-500">No tickets on sale yet.</p>
            )}
            <div className="space-y-4">
              {(event.ticketTypes ?? []).map((tt: TicketTypeConfig) => {
                const remaining = tt.quantity != null ? tt.quantity - tt.sold : null;
                const price = tt.currentPrice ?? tt.price;
                const max = Math.min(tt.maxPerOrder ?? 10, remaining ?? 10);
                return (
                  <div key={tt.id} className="pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{tt.name}</p>
                        {remaining != null && (
                          <p className="text-xs text-zinc-400">{remaining} left</p>
                        )}
                      </div>
                      <p className="font-semibold text-sm shrink-0">E{price.toFixed(2)}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-lg leading-none disabled:opacity-40"
                        disabled={(quantities[tt.id] || 0) <= 0}
                        onClick={() =>
                          setQuantities((q) => ({ ...q, [tt.id]: Math.max(0, (q[tt.id] || 0) - 1) }))
                        }
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{quantities[tt.id] || 0}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-lg leading-none disabled:opacity-40"
                        disabled={(quantities[tt.id] || 0) >= max || max <= 0}
                        onClick={() =>
                          setQuantities((q) => ({
                            ...q,
                            [tt.id]: Math.min(max, (q[tt.id] || 0) + 1),
                          }))
                        }
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
                <label className="block mt-4 text-xs font-medium text-zinc-500">Payment</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
                >
                  {PAYMENT_METHODS.filter((m) =>
                    ['MOMO', 'VISA', 'MASTERCARD', 'CASH'].includes(m.value)
                  ).map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <div className="mt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>E{total.toFixed(2)}</span>
                </div>
              </>
            )}

            {purchaseError && <p className="mt-3 text-sm text-red-600">{purchaseError}</p>}

            <button
              type="button"
              onClick={purchase}
              disabled={purchasing || totalQty === 0}
              className="mt-4 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 transition"
            >
              {purchasing
                ? 'Processing…'
                : !isAuthenticated
                  ? 'Sign in to buy'
                  : totalQty === 0
                    ? 'Select tickets'
                    : `Pay E${total.toFixed(2)}`}
            </button>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
