import Shell from '@/components/site/Shell';
import Link from 'next/link';

export const metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          About
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Events for everyone in Eswatini
        </h1>
        <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none space-y-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Eswatini Events is a local ticketing platform built for the Kingdom — from stadium
            shows and festivals to community gatherings and cultural ceremonies.
          </p>
          <p>
            We help organizers sell tickets online, issue secure QR codes, and validate entry at the
            gate. Attendees discover what’s on, pay with methods that work here (including MoMo),
            and walk in without paper chaos.
          </p>
          <p>
            Whether you’re hosting at House on Fire, Somhlolo, or a venue in your hometown, the goal
            is simple: fewer queues, clearer sales, and better nights out.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/events"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Browse events
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold"
          >
            Contact us
          </Link>
        </div>
      </div>
    </Shell>
  );
}
