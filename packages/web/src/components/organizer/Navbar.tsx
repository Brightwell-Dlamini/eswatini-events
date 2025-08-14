'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import {
  FaTicketAlt,
  FaChartLine,
  FaBullhorn,
  FaCog,
  FaStore,
} from 'react-icons/fa';
import { MdDashboard, MdEvent } from 'react-icons/md';

const OrganizerNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Nav items data
  const navItems = [
    { name: 'Dashboard', href: '/organizer/dashboard', icon: <MdDashboard /> },
    { name: 'Events', href: '/organizer/events', icon: <MdEvent /> },
    { name: 'Tickets', href: '/organizer/tickets', icon: <FaTicketAlt /> },
    { name: 'Vendors', href: '/organizer/vendors', icon: <FaStore /> },
    { name: 'Analytics', href: '/organizer/analytics', icon: <FaChartLine /> },
    { name: 'Marketing', href: '/organizer/marketing', icon: <FaBullhorn /> },
    { name: 'Settings', href: '/organizer/settings', icon: <FaCog /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-sm backdrop-blur-sm bg-opacity-90 border-b border-gray-100'
            : 'bg-white bg-opacity-90'
        }`}
        aria-label="Organizer navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link
                href="/organizer/dashboard"
                className="flex items-center"
                aria-label="Eswa Tickets Home"
              >
                <span className="text-2xl font-semibold text-gray-900 font-serif tracking-tight">
                  Eswatini Events
                </span>
                <span className="ml-2 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-1 rounded-full font-medium">
                  ORGANIZER
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === item.href
                        ? 'text-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {pathname === item.href && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-indigo-50 rounded-lg"
                        transition={{
                          type: 'spring',
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center">
                      <span className="mr-2 text-base">{item.icon}</span>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="hidden md:flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                    <FiUser className="text-lg" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Organizer
                  </span>
                </motion.div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/organizer/logout')}
                  className="ml-4 flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                  aria-label="Logout"
                >
                  <FiLogOut className="mr-1.5" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
                  aria-expanded={isMobileMenuOpen}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? (
                    <FiX className="h-6 w-6" />
                  ) : (
                    <FiMenu className="h-6 w-6" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 inset-x-0 z-40 bg-white shadow-lg border-b border-gray-100"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.name}`}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium ${
                    pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/organizer/logout');
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiLogOut className="mr-3 text-lg" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default OrganizerNavbar;
