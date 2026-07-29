import Link from 'next/link';
import Shell from '@/components/site/Shell';
import HomeFeatured from '@/components/site/HomeFeatured';

export default function HomePage() {
  return (
    <Shell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600" />
        <div className="absolute inset-0 bg-[url('/images/pattern.jpg')] opacity-10 mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-indigo-100 text-sm font-semibold tracking-wide uppercase mb-4">
              Kingdom of Eswatini
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Find your next unforgettable event
            </h1>
            <p className="mt-5 text-lg text-indigo-100 leading-relaxed max-w-xl">
              Concerts, festivals, sports and culture — book tickets in seconds and walk in with a
              QR code.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/events"
                className="inline-flex justify-center items-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 transition"
              >
                Browse events
              </Link>
              <Link
                href="/organizer/events/new"
                className="inline-flex justify-center items-center rounded-xl border border-white/40 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Host an event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Three steps to the gate
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Simple for attendees. Powerful for organizers.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              step: '01',
              title: 'Discover',
              body: 'Browse live events across Eswatini — filter by type, city or date.',
            },
            {
              step: '02',
              title: 'Book',
              body: 'Pick your tickets, pay with MoMo or card, and get QR codes instantly.',
            },
            {
              step: '03',
              title: 'Enter',
              body: 'Show your QR at the gate. Scanned once. You’re in.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8"
            >
              <span className="text-3xl font-bold text-indigo-600/20 dark:text-indigo-400/30">
                {item.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured from API */}
      <HomeFeatured />

      {/* Organizer CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-3xl bg-zinc-900 dark:bg-indigo-950 px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-fuchsia-600/30" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Sell out your next event</h2>
            <p className="mt-3 text-indigo-100 max-w-lg mx-auto">
              Create events, set ticket types, track sales and scan at the door — all in one place.
            </p>
            <Link
              href="/auth/register"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition"
            >
              Start as organizer
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
