// components/events/EventsPagination.tsx
'use client';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

type EventsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPaginate: (pageNumber: number) => void;
};

export const EventsPagination = ({
  currentPage,
  totalPages,
  onPaginate,
}: EventsPaginationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      viewport={{ once: true }}
      className="flex justify-center mt-12"
    >
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => onPaginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => onPaginate(number)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentPage === number
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPaginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </motion.div>
  );
};
