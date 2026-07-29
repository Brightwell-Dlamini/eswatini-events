'use client';

import { useState } from 'react';
import Shell from '@/components/site/Shell';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // MVP: client-side acknowledgement — wire to backend/email later
    setSent(true);
  };

  return (
    <Shell>
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Contact</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Questions about tickets, partnerships or organizing? Send a message.
        </p>

        {sent ? (
          <div className="mt-10 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40 p-6 text-center">
            <p className="font-semibold text-green-800 dark:text-green-300">Message noted</p>
            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
              Thanks {name || 'there'}. We’ll get back to you at {email || 'your email'}.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <Field label="Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
                placeholder="Your name"
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Message">
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="field-input resize-y"
                placeholder="How can we help?"
              />
            </Field>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 transition"
            >
              Send message
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .field-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(228 228 231);
          background: transparent;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
        }
        :global(.dark) .field-input {
          border-color: rgb(63 63 70);
        }
        .field-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgb(99 102 241 / 0.4);
          border-color: rgb(99 102 241);
        }
      `}</style>
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
