'use client';

import { useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';

const ROLES = [
  { value: 'ATTENDEE', label: 'Attendee — buy tickets' },
  { value: 'ORGANIZER', label: 'Organizer — host events' },
  { value: 'GATE_OPERATOR', label: 'Gate operator — scan tickets' },
] as const;

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'ATTENDEE' as 'ATTENDEE' | 'ORGANIZER' | 'GATE_OPERATOR',
    termsAccepted: false,
    company: '',
  });
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.termsAccepted) {
      setError('Please accept the terms');
      return;
    }
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        role: form.role,
        termsAccepted: true,
        company: form.company || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <Shell hideFooter>
      <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Create account
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Join Eswatini Events in under a minute</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-4"
        >
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <Field label="Full name">
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input"
              autoComplete="name"
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="input"
              autoComplete="email"
            />
          </Field>
          <Field label="Phone (optional)">
            <input
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="input"
              placeholder="+268…"
            />
          </Field>
          <Field label="I want to…">
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              className="input"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          {form.role === 'ORGANIZER' && (
            <Field label="Company (optional)">
              <input
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                className="input"
              />
            </Field>
          )}
          <Field label="Password">
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              className="input"
              autoComplete="new-password"
              minLength={8}
            />
          </Field>
          <Field label="Confirm password">
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set('confirmPassword', e.target.value)}
              className="input"
              autoComplete="new-password"
            />
          </Field>

          <label className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => set('termsAccepted', e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            I agree to the terms of use and privacy policy.
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 transition"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          margin-top: 0.375rem;
          border-radius: 0.75rem;
          border: 1px solid rgb(228 228 231);
          background: transparent;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
        }
        :global(.dark) .input {
          border-color: rgb(63 63 70);
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgb(99 102 241 / 0.45);
        }
      `}</style>
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      {children}
    </label>
  );
}
