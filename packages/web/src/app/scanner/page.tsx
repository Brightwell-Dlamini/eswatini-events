'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/site/Shell';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-token';

export default function ScannerPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [ticketNumber, setTicketNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; detail?: string } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/scanner');
      return;
    }
    if (user && user.role !== 'GATE_OPERATOR' && user.role !== 'ORGANIZER') {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [result]);

  const validate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const number = ticketNumber.trim();
    if (!number) return;
    setScanning(true);
    setResult(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      const res = await api.validateTicket(token, number);
      setResult({
        ok: true,
        message: res.message,
        detail: [res.ticket.event?.name, res.ticket.ticketType?.name, res.ticket.owner?.name]
          .filter(Boolean)
          .join(' · '),
      });
      setTicketNumber('');
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : 'Validation failed',
      });
    } finally {
      setScanning(false);
    }
  };

  if (authLoading) {
    return (
      <Shell hideFooter>
        <div className="flex justify-center py-32">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell hideFooter>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-zinc-950 text-white">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center">Gate scanner</h1>
          <p className="text-center text-sm text-zinc-400 mt-1">
            {user?.name} · {user?.role}
          </p>

          <form onSubmit={validate} className="mt-8 space-y-4">
            <input
              ref={inputRef}
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
              placeholder="Scan or type ticket number"
              autoComplete="off"
              disabled={scanning}
              className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-4 text-center font-mono text-lg tracking-wider focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={scanning || !ticketNumber.trim()}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 py-4 font-semibold text-lg transition"
            >
              {scanning ? 'Checking…' : 'Validate'}
            </button>
          </form>

          {result && (
            <div
              className={`mt-6 rounded-2xl border p-6 text-center ${
                result.ok
                  ? 'border-green-500/50 bg-green-950/50'
                  : 'border-red-500/50 bg-red-950/50'
              }`}
            >
              <p className="text-4xl">{result.ok ? '✓' : '✗'}</p>
              <p className="mt-2 font-semibold text-lg">{result.message}</p>
              {result.detail && <p className="mt-1 text-sm text-zinc-400">{result.detail}</p>}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-zinc-500">
            Hardware scanners that type like a keyboard work automatically.
          </p>
        </div>
      </div>
    </Shell>
  );
}
