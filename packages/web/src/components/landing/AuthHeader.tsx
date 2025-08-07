'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TicketIcon } from '@heroicons/react/24/outline';

export default function AuthHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link href="/" className="flex items-center group">
              <motion.div
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.5 }}
              >
                <TicketIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-2" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent group-hover:bg-gradient-to-l transition-all duration-500">
                Eswatini Events
              </h1>
            </Link>
          </motion.div>

          {/* Back to home link */}
          <Link
            href="/"
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
