'use client';

import { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  TicketIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  CalendarIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// import { useSession, signOut } from 'next-auth/react';

import { debounce } from 'lodash';
import { useAuth } from '@/app/contexts/auth-context';
import { ChevronDownIcon } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  const navRef = useRef(null);

  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.98)']
  );
  const darkBackgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(17, 24, 39, 0)', 'rgba(17, 24, 39, 0.98)']
  );

  // Set mounted state and initial scroll position
  useEffect(() => {
    setMounted(true);
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 50);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic theme detection
  const currentTheme = mounted
    ? theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
    : 'light';

  // Don't render until mounted to avoid hydration issues
  if (!mounted || loading) {
    return null;
  }

  const navLinks = [
    {
      name: 'Events',
      href: '/events',
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      name: 'Organizers',
      href: '/organizer',
      icon: <UserGroupIcon className="h-5 w-5" />,
    },
    {
      name: 'About',
      href: '/about',
      icon: <InformationCircleIcon className="h-5 w-5" />,
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: <PhoneIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <motion.nav
        ref={navRef}
        style={{
          backgroundColor:
            currentTheme === 'dark' ? darkBackgroundColor : backgroundColor,
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'border-gray-200/80 dark:border-gray-700/50 shadow-sm'
            : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              onHoverStart={() => setIsHoveringLogo(true)}
              onHoverEnd={() => setIsHoveringLogo(false)}
              className="flex-shrink-0 flex items-center"
            >
              <Link href="/" className="flex items-center group">
                <motion.div
                  animate={{
                    rotateY: isHoveringLogo ? 180 : 0,
                  }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <TicketIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
                </motion.div>
                <motion.h1
                  animate={{
                    backgroundPosition: isHoveringLogo ? '100% 50%' : '0% 50%',
                  }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-yellow-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_100%]"
                >
                  Eswatini Events
                </motion.h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                    pathname === link.href
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  } transition-all duration-200`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setTheme(currentTheme === 'dark' ? 'light' : 'dark')
                }
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                aria-label="Toggle theme"
              >
                {currentTheme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </motion.button>

              {/* User actions */}
              {user ? (
                <div className="hidden lg:flex items-center space-x-2 relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <UserCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 py-1 border border-gray-200 dark:border-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Log In</span>
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/auth/register"
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden fixed inset-0 z-40 pt-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="px-4 py-6">
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium ${
                        pathname === link.href
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      } transition-all duration-200`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <span>Dark Mode</span>
                    {currentTheme === 'dark' ? (
                      <MoonIcon className="h-5 w-5" />
                    ) : (
                      <SunIcon className="h-5 w-5" />
                    )}
                  </span>
                  <button
                    onClick={() =>
                      setTheme(currentTheme === 'dark' ? 'light' : 'dark')
                    }
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                  >
                    <span
                      className={`${
                        currentTheme === 'dark'
                          ? 'translate-x-6 bg-blue-500'
                          : 'translate-x-1 bg-yellow-500'
                      } inline-block h-4 w-4 transform rounded-full transition-all duration-200`}
                    />
                  </button>
                </div>

                {/* Update mobile menu to show user state */}
                {user ? (
                  <div className="space-y-3 mt-4">
                    <Link
                      href="/profile"
                      className="flex items-center justify-center space-x-2 w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-lg shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 mt-4">
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-lg shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center space-x-2 w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Create Account</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
