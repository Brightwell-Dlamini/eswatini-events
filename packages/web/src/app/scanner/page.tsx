'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ScannerPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [ticketNumber, setTicketNumber] = useState('');
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: string;
  } | null>(null);
  const [scanning, setScanning] = useState(false);
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

  const handleValidate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const number = ticketNumber.trim();
    if (!number) return;

    setScanning(true);
    setResult(null);

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const res = await api.validateTicket(token, number);
      setResult({
        type: 'success',
        message: res.message,
        details: `${res.ticket.event?.name ?? ''} · ${res.ticket.ticketType?.name ?? ''} · ${res.ticket.owner?.name ?? ''}`,
      });
      setTicketNumber('');
    } catch (err) {
      setResult({
        type: 'error',
        message: err instanceof Error ? err.message : 'Validation failed',
      });
    } finally {
      setScanning(false);
      inputRef.current?.focus();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Ticket Scanner</h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          Signed in as {user?.name} ({user?.role})
        </p>

        <form onSubmit={handleValidate} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
            placeholder="Scan or enter ticket number"
            className="w-full px-4 py-4 text-lg font-mono rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-wider"
            autoComplete="off"
            autoFocus
            disabled={scanning}
          />
          <button
            type="submit"
            disabled={scanning || !ticketNumber.trim()}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-semibold text-lg transition"
          >
            {scanning ? 'Validating…' : 'Validate Ticket'}
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 p-6 rounded-xl text-center ${
              result.type === 'success'
                ? 'bg-green-900/50 border border-green-500'
                : 'bg-red-900/50 border border-red-500'
            }`}
          >
            <div className="text-4xl mb-2">{result.type === 'success' ? '✓' : '✗'}</div>
            <p className="font-semibold text-lg">{result.message}</p>
            {result.details && (
              <p className="text-sm text-gray-300 mt-2">{result.details}</p>
            )}
          </div>
        )}

        <p className="text-center text-gray-500 text-xs mt-8">
          Hardware scanners that act as keyboards work automatically.
        </p>
      </div>
    </div>
  );
}
