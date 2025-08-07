'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Providers } from '../providers';

const OrganizerLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-[rgb(74,20,140)] bg-opacity-80 p-4 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold mb-2 sm:mb-0"
            aria-label="Eswa Tickets Home"
          >
            Eswatini Events
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/organizer/dashboard"
              className="hover:text-[rgb(255,109,0)] text-lg"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
            <Link
              href="/organizer/events"
              className="hover:text-[rgb(255,109,0)] text-lg"
              aria-label="Events"
            >
              Events
            </Link>
            <Link
              href="/organizer/tickets"
              className="hover:text-[rgb(255,109,0)] text-lg"
              aria-label="Tickets"
            >
              Tickets
            </Link>
            <Link
              href="/organizer/vendors"
              className="hover:text-[rgb(255,109,0)] text-lg"
              aria-label="Vendors"
            >
              Vendors
            </Link>
            <Link
              href="/organizer/analytics"
              className="hover:text-[rgb(255,109,0)] text-lg"
              aria-label="Analytics"
            >
              Analytics
            </Link>
            <Link
              href="/organizer/marketing"
              className="hover:text-[rgb(255,109,0)] text-lg"
              aria-label="Marketing"
            >
              Marketing
            </Link>
            <Link
              href="/organizer/settings"
              className="hover:text-[rgb(255,109,0)] text-lg"
              aria-label="Settings"
            >
              Settings
            </Link>
            <button
              onClick={() => router.push('/organizer/logout')}
              className="bg-red-600 px-4 py-2 rounded-full text-lg"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.nav>

      <Providers>{children}</Providers>
    </div>
  );
};

export default OrganizerLayout;
