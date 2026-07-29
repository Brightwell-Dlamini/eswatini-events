'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/auth-context';
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  TicketIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const nav = [
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href || pathname?.startsWith(href + '/')
        ? 'text-indigo-600 dark:text-indigo-400'
        : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold">
            EE
          </span>
          <span className="font-semibold text-zinc-900 dark:text-white hidden xs:inline sm:inline">
            Eswatini Events
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
          {isAuthenticated && user?.role === 'ORGANIZER' && (
            <Link href="/organizer/dashboard" className={linkClass('/organizer')}>
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'GATE_OPERATOR' && (
            <Link href="/scanner" className={linkClass('/scanner')}>
              Scanner
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {mounted && (
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          )}

          {!loading && isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/tickets"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <TicketIcon className="h-4 w-4" />
                Tickets
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <UserCircleIcon className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-2"
              >
                Log out
              </button>
            </div>
          ) : (
            !loading && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 transition shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )
          )}

          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                href="/tickets"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                My Tickets
              </Link>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Profile
              </Link>
              {user?.role === 'ORGANIZER' && (
                <Link
                  href="/organizer/dashboard"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Organizer Dashboard
                </Link>
              )}
              {user?.role === 'GATE_OPERATOR' && (
                <Link
                  href="/scanner"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Scanner
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Log out
              </button>
            </>
          )}
          {!isAuthenticated && !loading && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="block text-center rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="block text-center rounded-lg bg-indigo-600 text-white px-3 py-2.5 text-sm font-semibold"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
