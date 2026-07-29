'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-token';
import { EVENT_TYPES, TICKET_TYPES } from '@/lib/constants';

export default function CreateEventPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    address: '',
    city: '',
    type: 'MUSIC',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-047417675d1b?w=800',
    capacity: '',
  });
  const [ticketTypes, setTicketTypes] = useState([
    { name: 'General Admission', type: 'GENERAL_ADMISSION', price: '150', quantity: '500' },
  ]);

  if (!authLoading && (!isAuthenticated || user?.role !== 'ORGANIZER')) {
    router.push('/auth/login?redirect=/organizer/events/new');
  }

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (publish: boolean) => {
    setSubmitting(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      if (!form.name || !form.description || !form.startTime || !form.address || !form.city) {
        throw new Error('Fill in all required fields');
      }
      const event = await api.createEvent(token, {
        name: form.name,
        description: form.description,
        startTime: new Date(form.startTime).toISOString(),
        endTime: form.endTime ? new Date(form.endTime).toISOString() : undefined,
        address: form.address,
        city: form.city,
        country: 'Eswatini',
        type: form.type,
        imageUrl: form.imageUrl,
        capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
        status: 'DRAFT',
      });
      for (const tt of ticketTypes) {
        if (!tt.name || !tt.price) continue;
        await api.createTicketType(token, {
          eventId: event.id,
          name: tt.name,
          type: tt.type,
          price: parseFloat(tt.price),
          quantity: tt.quantity ? parseInt(tt.quantity, 10) : undefined,
        });
      }
      if (publish) await api.publishEvent(token, event.id);
      router.push('/organizer/events');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
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
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Create event</h1>
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
          <Input label="Name *" value={form.name} onChange={(v) => update('name', v)} />
          <label className="block text-sm">
            <span className="font-medium">Description *</span>
            <textarea
              className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm min-h-[100px]"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Start *"
              type="datetime-local"
              value={form.startTime}
              onChange={(v) => update('startTime', v)}
            />
            <Input
              label="End"
              type="datetime-local"
              value={form.endTime}
              onChange={(v) => update('endTime', v)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Address *" value={form.address} onChange={(v) => update('address', v)} />
            <Input label="City *" value={form.city} onChange={(v) => update('city', v)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="font-medium">Type</span>
              <select
                className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Capacity"
              type="number"
              value={form.capacity}
              onChange={(v) => update('capacity', v)}
            />
          </div>
          <Input label="Image URL" value={form.imageUrl} onChange={(v) => update('imageUrl', v)} />

          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Ticket types</h2>
              <button
                type="button"
                className="text-sm text-indigo-600"
                onClick={() =>
                  setTicketTypes((t) => [
                    ...t,
                    { name: '', type: 'GENERAL_ADMISSION', price: '', quantity: '' },
                  ])
                }
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {ticketTypes.map((tt, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    className="col-span-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-2 py-1.5 text-sm"
                    placeholder="Name"
                    value={tt.name}
                    onChange={(e) =>
                      setTicketTypes((arr) =>
                        arr.map((x, j) => (j === i ? { ...x, name: e.target.value } : x))
                      )
                    }
                  />
                  <select
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-2 py-1.5 text-sm"
                    value={tt.type}
                    onChange={(e) =>
                      setTicketTypes((arr) =>
                        arr.map((x, j) => (j === i ? { ...x, type: e.target.value } : x))
                      )
                    }
                  >
                    {TICKET_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-2 py-1.5 text-sm"
                    placeholder="Price"
                    value={tt.price}
                    onChange={(e) =>
                      setTicketTypes((arr) =>
                        arr.map((x, j) => (j === i ? { ...x, price: e.target.value } : x))
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => submit(false)}
              className="flex-1 rounded-xl border py-3 font-semibold text-sm disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => submit(true)}
              className="flex-1 rounded-xl bg-indigo-600 text-white py-3 font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
      />
    </label>
  );
}
