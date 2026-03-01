'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  TicketIcon,
  SparklesIcon as SparklesSolid,
} from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { debounce } from 'lodash';
import { BellIcon } from 'lucide-react';
import NavLinks from './Navbar/NavLinks';
import LanguageSelector from './Navbar/LanguageSelector';
import NotificationMenu from './Navbar/NotificationMenu';
import ThemeToggle from './Navbar/ThemeToggle';
import UserMenu from './Navbar/UserMenu';
import AuthButtons from './Navbar/AuthButtons';
import MobileMenu from './Navbar/MobileMenu';
import { useAuth } from '@/contexts/auth-context';

const Navbar = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(3);

  const navRef = useRef(null);

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

  const notifications = [
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
  ];

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
    ? theme === 'dark'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
    : 'light';

  const markAsRead = () => {
    setUnreadNotifs((prev) => Math.max(0, prev - 1));
  };

  const handleLogout = () => {
    logout();
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
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-white"
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

            <NavLinks />

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-4">
                <LanguageSelector />
                {user && (
                  <div className="relative">
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
                <ThemeToggle />
                {user ? (
                  <UserMenu user={user} onLogout={handleLogout} />
                ) : (
                  <AuthButtons />
                )}
              </div>

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

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        unreadNotifs={unreadNotifs}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
