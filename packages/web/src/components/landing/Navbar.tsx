'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
  ChevronDownIcon,
  BellIcon,
  GlobeAltIcon,
  SparklesIcon as SparklesSolid,
} from '@heroicons/react/24/solid';

import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/auth-context';
import { debounce } from 'lodash';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

// Constants
const NAV_LINKS = [
  {
    name: 'Events',
    href: '/events',
    icon: <CalendarIcon className="h-6 w-6" />,
  },
  {
    name: 'Organizers',
    href: '/organizer',
    icon: <UserGroupIcon className="h-6 w-6" />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <InformationCircleIcon className="h-6 w-6" />,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: <PhoneIcon className="h-6 w-6" />,
  },
];

// Update LANGUAGES constant
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ss', name: 'Siswati', flag: '🇸🇿' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

// Custom Hook for Click Outside
// This hook detects clicks outside a specified element and triggers a handler
const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const DropdownMenu = ({
  isOpen,
  onClose,
  children,
  className = '',
  position = 'right',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'right';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ y: 10, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, type: 'spring' }}
          className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} top-full mt-2 z-50 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-gray-800 dark:text-gray-200 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// NotificationMenu component
// This component displays notifications grouped by event

const NotificationMenu = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onClose,
}: {
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    read: boolean;
    time: string;
    eventId?: string; // Add eventId for grouping
    type?: 'system' | 'event' | 'promo'; // Add notification type
  }>;
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onClose: () => void;
}) => {
  // Group notifications by event
  const groupedNotifications = useMemo(() => {
    return notifications.reduce(
      (acc, notif) => {
        const key = notif.eventId || 'general';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(notif);
        return acc;
      },
      {} as Record<string, typeof notifications>
    );
  }, [notifications]);

  return (
    <DropdownMenu isOpen={true} onClose={onClose} className="w-80">
      <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Notifications
          </p>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {unreadCount} unread
              </p>
            )}
            <button
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => {
                // Mark all as read logic
                notifications.forEach(
                  (notif) => !notif.read && onMarkAsRead(notif.id)
                );
              }}
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedNotifications).map(([eventId, eventNotifs]) => (
          <div key={eventId}>
            {eventId !== 'general' && (
              <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30">
                {eventNotifs[0].title.includes('MTN Bushfire')
                  ? 'MTN Bushfire'
                  : 'Event Updates'}
              </div>
            )}
            {eventNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-3 text-sm ${
                  !notif.read
                    ? 'bg-blue-50/50 dark:bg-blue-900/10'
                    : 'bg-white dark:bg-gray-800'
                } hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer`}
                onClick={() => onMarkAsRead(notif.id)}
              >
                <div className="flex items-start">
                  {notif.type === 'event' && (
                    <CalendarIcon className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notif.title}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notif.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-200/50 dark:border-gray-700/50">
        <Link
          href="/notifications/settings"
          className="flex-1 text-center px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/20 transition-colors"
          onClick={onClose}
        >
          <Cog6ToothIcon className="h-4 w-4 inline mr-1" />
          Settings
        </Link>
        <Link
          href="/notifications"
          className="flex-1 text-center px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors border-l border-gray-200/50 dark:border-gray-700/50"
          onClick={onClose}
        >
          View all
        </Link>
      </div>
    </DropdownMenu>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = mounted
    ? theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : (theme as 'dark' | 'light') // Add type assertion
    : 'light';
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        key={currentTheme}
        initial={{
          y: currentTheme === 'dark' ? -30 : 30,
        }}
        animate={{ y: 0 }}
        exit={{ y: currentTheme === 'dark' ? 30 : -30 }}
        transition={{ duration: 0.2 }}
      >
        {currentTheme === 'dark' ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </motion.div>
    </motion.button>
  );
};

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [unreadNotifs, setUnreadNotifs] = useState(3);

  const navRef = useRef(null);
  const hoverRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.98)']
  );
  const darkBackgroundColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(10, 10, 15, 0)', 'rgba(10, 10, 15, 0.98)']
  );
  const navHeight = useTransform(scrollY, [0, 80], ['5rem', '4.5rem']);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  // Memoized notifications data
  const notifications = useMemo(
    () => [
      {
        id: 1,
        title: 'Your ticket is confirmed!',
        message: 'MTN Bushfire Festival - May 25-27',
        read: false,
        time: '2 mins ago',
      },
      {
        id: 2,
        title: 'New events near you',
        message: '3 cultural events in Manzini',
        read: false,
        time: '1 hour ago',
      },
      {
        id: 3,
        title: 'Special offer',
        message: '20% off Standard Bank Luju Festival',
        read: true,
        time: '5 hours ago',
      },
    ],
    []
  );

  // Simplified scroll handler
  const handleScroll = debounce(() => {
    setIsScrolled(window.scrollY > 50);
  }, 100);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const currentTheme = mounted
    ? theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
    : 'light';

  const handleHoverStart = (name: string) => setActiveHover(name);
  const handleHoverEnd = () => setActiveHover(null);

  const markAsRead = () => {
    setUnreadNotifs((prev) => Math.max(0, prev - 1));
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  if (!mounted || loading) return null;

  return (
    <>
      <motion.nav
        ref={navRef}
        style={{
          backgroundColor:
            currentTheme === 'dark' ? darkBackgroundColor : backgroundColor,
          height: navHeight,
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        }}
        className={`fixed w-full z-50 transition-all duration-500 py-5 ${isScrolled ? 'shadow-lg shadow-gray-100/20 dark:shadow-gray-900/30' : ''}`}
        aria-label="Main navigation"
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: isScrolled ? 1 : 0.7,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          {/* Add shimmer animation */}
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-white "
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-full items-center">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setIsHoveringLogo(true)}
              onHoverEnd={() => setIsHoveringLogo(false)}
              className="flex-shrink-0 flex items-center"
              style={{ scale: logoScale }}
            >
              <Link
                href="/"
                className="flex items-center group relative"
                aria-label="Home"
              >
                <motion.div
                  animate={{
                    rotateY: isHoveringLogo ? 360 : 0,
                    scale: isHoveringLogo ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="relative"
                >
                  <TicketIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
                  {isHoveringLogo && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <SparklesSolid className="h-4 w-4 text-yellow-500 animate-pulse" />
                    </motion.div>
                  )}
                </motion.div>
                <motion.h1
                  animate={{
                    backgroundPosition: isHoveringLogo ? '100% 50%' : '0% 50%',
                  }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_100%]"
                >
                  Eswatini Events
                </motion.h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 relative">
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.name}
                  ref={(el) => {
                    hoverRefs.current[link.name] = el;
                  }}
                  onHoverStart={() => handleHoverStart(link.name)}
                  onHoverEnd={handleHoverEnd}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 relative z-10 ${
                      pathname === link.href
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    } transition-all duration-200`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>

                  {activeHover === link.name && (
                    <motion.div
                      layoutId="navHoverBg"
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                      className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg -z-1"
                    />
                  )}

                  {pathname === link.href && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute bottom-0 left-1/2 h-1 w-1/2 bg-blue-600 dark:bg-blue-400 rounded-t-full -translate-x-1/2"
                      transition={{ type: 'spring', bounce: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Language selector */}
              <div className="hidden lg:block relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  aria-label="Language selector"
                  aria-expanded={isLangMenuOpen}
                >
                  <GlobeAltIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    EN
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform ${
                      isLangMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>

                <DropdownMenu
                  isOpen={isLangMenuOpen}
                  onClose={() => setIsLangMenuOpen(false)}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => {
                        // Here you would typically set the language preference
                        setIsLangMenuOpen(false);
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </DropdownMenu>
              </div>

              {/* Notifications */}
              {user && (
                <div className="hidden lg:block relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                    className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors relative"
                    aria-label="Notifications"
                    aria-expanded={isNotifMenuOpen}
                  >
                    <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    {unreadNotifs > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {unreadNotifs}
                      </motion.span>
                    )}
                  </motion.button>

                  {isNotifMenuOpen && (
                    <NotificationMenu
                      notifications={notifications}
                      unreadCount={unreadNotifs}
                      onMarkAsRead={markAsRead}
                      onClose={() => setIsNotifMenuOpen(false)}
                    />
                  )}
                </div>
              )}

              {/* Theme toggle */}
              <ThemeToggle />

              {/* User actions */}
              {user ? (
                <div className="hidden lg:flex items-center space-x-2 relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                    aria-label="User menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-md"
                    >
                      <UserCircleIcon className="h-5 w-5 text-white" />
                    </motion.div>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>

                  <DropdownMenu
                    isOpen={isUserMenuOpen}
                    onClose={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <TicketIcon className="h-5 w-5 mr-2" />
                      My Events
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      <span>Sign Out</span>
                    </button>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/auth/login"
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-blue-600/30 dark:border-blue-400/30"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Log In</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/auth/register"
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
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
                className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
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
          <>
            <motion.div
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
              role="dialog"
              aria-modal="true"
            >
              <div className="px-6 py-8">
                <nav className="space-y-1">
                  {NAV_LINKS.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ x: 50 }}
                      animate={{ x: 0 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium ${
                          pathname === link.href
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                        } transition-all duration-200`}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={
                          pathname === link.href ? 'page' : undefined
                        }
                      >
                        <div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                          {link.icon}
                        </div>
                        <span>{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-12 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between px-4 py-3 mb-6">
                    <span className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-3">
                      {currentTheme === 'dark' ? (
                        <MoonIcon className="h-5 w-5" />
                      ) : (
                        <SunIcon className="h-5 w-5" />
                      )}
                      <span>Dark Mode</span>
                    </span>
                    <button
                      onClick={() =>
                        setTheme(currentTheme === 'dark' ? 'light' : 'dark')
                      }
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                      aria-label="Toggle dark mode"
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

                  <div className="mb-6">
                    <div className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select
                        className="block w-full bg-transparent text-gray-900 dark:text-white"
                        aria-label="Select language"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {user ? (
                    <div className="space-y-3">
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          href="/notifications"
                          className="flex items-center justify-between px-4 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium rounded-xl hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <BellIcon className="h-5 w-5" />
                            <span>Notifications</span>
                          </div>
                          {unreadNotifs > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {unreadNotifs}
                            </span>
                          )}
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <Link
                          href="/profile"
                          className="flex items-center justify-center space-x-3 w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          href="/auth/login"
                          className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>Sign In</span>
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <Link
                          href="/auth/register"
                          className="flex items-center justify-center space-x-3 w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <UserPlusIcon className="h-5 w-5" />
                          <span>Create Account</span>
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
