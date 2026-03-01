'use client';
import { loginText } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { CheckIcon, TicketIcon } from 'lucide-react';

export function LoginIllustration() {
  return (
    <div className="w-full md:w-1/2 flex items-center">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl p-8 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="mx-auto w-64 h-64 mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <TicketIcon className="h-32 w-32 text-purple-600 dark:text-purple-400" />
            </div>
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <path
                fill="#8B5CF6"
                d="M45.1,-65.3C58.1,-56.8,68.3,-43.8,73.2,-28.6C78.1,-13.4,77.7,4,71.2,18.3C64.7,32.6,52.1,43.8,38.1,54.6C24.1,65.4,8.7,75.8,-7.5,80.3C-23.7,84.8,-47.4,83.4,-62.5,72.1C-77.5,60.8,-83.9,39.6,-82.1,20.7C-80.3,1.8,-70.3,-14.8,-58.6,-28.6C-46.9,-42.4,-33.5,-53.4,-19.3,-61.4C-5.1,-69.5,9.9,-74.6,25.1,-71.4C40.3,-68.2,55.7,-56.8,45.1,-65.3Z"
                transform="translate(100 100)"
                opacity="0.3"
              />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {loginText.title}
          </h3>
          <ul className="space-y-4 text-left">
            {loginText.benefits.map((item, index) => (
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
