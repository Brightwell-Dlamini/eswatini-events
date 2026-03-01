'use client';
import { registerText } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';

export function RegisterIllustration() {
  return (
    <div className="w-full md:w-1/2 flex items-center">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl p-8 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {registerText.benefitsTitle}
          </h3>
          <ul className="space-y-4 text-left">
            {registerText.benefits.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start"
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full mr-3 mt-0.5">
                  <CheckIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
