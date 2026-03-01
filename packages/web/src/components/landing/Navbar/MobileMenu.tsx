import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  CalendarIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PhoneIcon,
  BookmarkIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';

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

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ss', name: 'Siswati', flag: '🇸🇿' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

const MobileMenu = ({
  isOpen,
  onClose,
  user,
  unreadNotifs,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  unreadNotifs: number;
  onLogout: () => void;
}) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const constraintsRef = useRef(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = mounted
    ? theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
    : 'light';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={constraintsRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.5 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (info.offset.x > 100) {
                onClose();
              }
            }}
            className="lg:hidden fixed inset-0 z-50 w-full max-w-sm ml-auto bg-gradient-to-b from-white/90 to-gray-50/90 dark:from-gray-900/95 dark:to-gray-800/95 shadow-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="min-h-screen flex flex-col">
              {/* Sticky header with close button */}
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                {/* Header with user profile */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="px-6 pt-6 pb-6 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/30"
                      >
                        <UserCircleIcon className="h-8 w-8" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold truncate">
                          {user.name || user.email}
                        </h3>
                        <p className="text-sm opacity-80 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab navigation */}
                <div className="flex border-b border-gray-200/50 dark:border-gray-700/50">
                  {user && (
                    <button
                      onClick={() => setActiveTab('account')}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'account'
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Account
                    </button>
                  )}
                </div>

                <div className="px-6 py-6">
                  {activeTab === 'menu' ? (
                    <>
                      {/* Navigation Links */}
                      <motion.nav className="space-y-3">
                        {NAV_LINKS.map((link, index) => (
                          <motion.div
                            key={link.name}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <Link
                              href={link.href}
                              className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium ${
                                pathname === link.href
                                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                              } transition-all duration-200`}
                              onClick={onClose}
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
                      </motion.nav>

                      {/* Settings Section */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 space-y-6"
                      >
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 pl-2">
                            Preferences
                          </h4>

                          {/* Theme Toggle */}
                          <div className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
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
                                setTheme(
                                  currentTheme === 'dark' ? 'light' : 'dark'
                                )
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

                          {/* Language Selector */}
                          <div className="px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Language
                            </label>
                            <div className="relative">
                              <select
                                className="block w-full bg-transparent text-gray-900 dark:text-white appearance-none py-2 pl-3 pr-8 rounded-lg border border-gray-300/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                aria-label="Select language"
                              >
                                {LANGUAGES.map((lang) => (
                                  <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    /* Account Tab Content */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={onClose}
                      >
                        <UserCircleIcon className="h-5 w-5 text-blue-500" />
                        <span>Profile Settings</span>
                      </Link>

                      <Link
                        href="/notifications"
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={onClose}
                      >
                        <div className="flex items-center space-x-3">
                          <BellIcon className="h-5 w-5 text-blue-500" />
                          <span>Notifications</span>
                        </div>
                        {unreadNotifs > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadNotifs > 9 ? '9+' : unreadNotifs}
                          </span>
                        )}
                      </Link>

                      <Link
                        href="/saved"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={onClose}
                      >
                        <BookmarkIcon className="h-5 w-5 text-blue-500" />
                        <span>Saved Events</span>
                      </Link>

                      <Link
                        href="/security"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={onClose}
                      >
                        <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
                        <span>Security</span>
                      </Link>
                    </motion.div>
                  )}

                  {/* Auth Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
                  >
                    {user ? (
                      <div className="space-y-3">
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 group"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/auth/login"
                          className="flex items-center justify-center space-x-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                          onClick={onClose}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          href="/auth/register"
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300"
                          onClick={onClose}
                        >
                          <UserPlusIcon className="h-5 w-5" />
                          <span>Register</span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
