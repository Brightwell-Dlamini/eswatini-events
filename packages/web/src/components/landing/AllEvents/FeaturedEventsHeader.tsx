// components/events/FeaturedEventsHeader.tsx
'use client';

import { motion } from 'framer-motion';
import { FireIcon } from '@heroicons/react/24/outline';

export const FeaturedEventsHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="text-center mb-16"
    >
      <motion.div whileHover={{ scale: 1.02 }} className="inline-block mb-6">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-sm font-medium">
          <FireIcon className="h-4 w-4 mr-2 text-purple-500" />
          TRENDING EVENTS
        </span>
      </motion.div>

      <motion.h2
        className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          Cultural
        </span>{' '}
        Experiences & Entertainment
      </motion.h2>

      <motion.p
        className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Discover the vibrant heartbeat of Eswatini through these unforgettable
        events
      </motion.p>
    </motion.div>
  );
};
