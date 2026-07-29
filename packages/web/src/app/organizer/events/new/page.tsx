'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-token';
import { EVENT_TYPES, TICKET_TYPES } from '@/lib/constants';

export default function CreateEventPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ORGANIZER') {
    router.push('/auth/login?redirect=/organizer/events/new');
    return null;
  }

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updateTicket = (index: number, field: string, value: string) => {
    setTicketTypes((tts) =>
      tts.map((tt, i) => (i === index ? { ...tt, [field]: value } : tt))
    );
  };

  const addTicketType = () => {
    setTicketTypes((tts) => [
      ...tts,
      { name: '', type: 'GENERAL_ADMISSION', price: '', quantity: '' },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes((tts) => tts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (publish: boolean) => {
    setSubmitting(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      if (!form.name || !form.description || !form.startTime || !form.address || !form.city) {
        throw new Error('Please fill in all required fields');
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

      // Create ticket types
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

      if (publish) {
        await api.publishEvent(token, event.id);
      }

      router.push('/organizer/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Create Event</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-5">
          <Field label="Event Name *">
            <input
              className="input"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Bushfire Festival 2026"
            />
          </Field>

          <Field label="Description *">
            <textarea
              className="input min-h-[100px]"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Tell attendees what to expect…"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date & Time *">
              <input
                type="datetime-local"
                className="input"
                value={form.startTime}
                onChange={(e) => update('startTime', e.target.value)}
              />
            </Field>
            <Field label="End Date & Time">
              <input
                type="datetime-local"
                className="input"
                value={form.endTime}
                onChange={(e) => update('endTime', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Address *">
              <input
                className="input"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Venue address"
              />
            </Field>
            <Field label="City *">
              <input
                className="input"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="e.g. Mbabane"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Event Type">
              <select
                className="input"
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Capacity">
              <input
                type="number"
                className="input"
                value={form.capacity}
                onChange={(e) => update('capacity', e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>

          <Field label="Image URL">
            <input
              className="input"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
            />
          </Field>

          {/* Ticket Types */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Ticket Types</h2>
              <button
                type="button"
                onClick={addTicketType}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add type
              </button>
            </div>

            <div className="space-y-3">
              {ticketTypes.map((tt, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  <input
                    className="input col-span-2"
                    placeholder="Name"
                    value={tt.name}
                    onChange={(e) => updateTicket(i, 'name', e.target.value)}
                  />
                  <select
                    className="input"
                    value={tt.type}
                    onChange={(e) => updateTicket(i, 'type', e.target.value)}
                  >
                    {TICKET_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      className="input"
                      type="number"
                      placeholder="Price (E)"
                      value={tt.price}
                      onChange={(e) => updateTicket(i, 'price', e.target.value)}
                    />
                    <input
                      className="input"
                      type="number"
                      placeholder="Qty"
                      value={tt.quantity}
                      onChange={(e) => updateTicket(i, 'quantity', e.target.value)}
                    />
                  </div>
                  {ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(i)}
                      className="text-red-500 text-xs col-span-full text-right"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(false)}
              className="flex-1 py-3 rounded-lg border font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(true)}
              className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Publish Event'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: transparent;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          ring: 2px;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
