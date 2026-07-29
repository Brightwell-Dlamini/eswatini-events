import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold">
                EE
              </span>
              <span className="font-semibold text-zinc-900 dark:text-white">Eswatini Events</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Discover concerts, festivals, sports and culture across the Kingdom of Eswatini.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/events" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  All events
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Organizers</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link
                  href="/organizer/events/new"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Create an event
                </Link>
              </li>
              <li>
                <Link
                  href="/organizer/dashboard"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Become an organizer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/auth/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  My tickets
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Gate scanner
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Eswatini Events. All rights reserved.</p>
          <p>Made for the Kingdom of Eswatini 🇸🇿</p>
        </div>
      </div>
    </footer>
  );
}
