import Link from 'next/link';
import Shell from '@/components/site/Shell';

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">404</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-zinc-500 dark:text-zinc-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Go home
          </Link>
          <Link
            href="/events"
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Browse events
          </Link>
        </div>
      </div>
    </Shell>
  );
}
