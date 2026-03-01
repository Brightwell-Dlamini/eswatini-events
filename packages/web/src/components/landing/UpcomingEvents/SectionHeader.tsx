// components/SectionHeader.tsx
'use client';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

export const SectionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 10,
        },
      }}
      viewport={{ once: true, margin: '-100px' }}
      className="text-center mb-20"
    >
      <motion.div className="inline-flex items-center gap-2 mb-4">
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </motion.div>
        <span className="text-sm font-semibold tracking-wide uppercase text-purple-600 dark:text-purple-400">
          Hot Tickets
        </span>
      </motion.div>

      <h2
        id="upcoming-events-heading"
        className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
      >
        <span className="relative inline-block">
          <span className="relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Don&apos;t Miss These
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{
              scaleX: 1,
              transition: { delay: 0.6, duration: 0.8 },
            }}
            className="absolute bottom-0 left-0 w-full h-3 bg-purple-100 dark:bg-purple-900/40 -z-0 transform translate-y-1 origin-left"
          />
        </span>
      </h2>

      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Upcoming highlights with limited tickets - secure your spot before
        they&apos;re gone!
      </p>
    </motion.div>
  );
};
