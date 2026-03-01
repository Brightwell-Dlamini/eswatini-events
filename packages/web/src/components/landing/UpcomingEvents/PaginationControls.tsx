// components/PaginationControls.tsx
'use client';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  setCurrentPage,
  canScrollPrev,
  canScrollNext,
}: PaginationControlsProps) => {
  const handlePrev = () => setCurrentPage(Math.max(0, currentPage - 1));
  const handleNext = () =>
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));

  return (
    <div className="flex items-center justify-center mt-12 space-x-6">
      <button
        onClick={handlePrev}
        disabled={!canScrollPrev}
        className="p-2 rounded-full disabled:opacity-30 transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
        aria-label="Previous events"
      >
        <FiChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      <div className="flex space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentPage(index)}
            whileHover={{ scale: 1.2 }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentPage
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 w-5'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!canScrollNext}
        className="p-2 rounded-full disabled:opacity-30 transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
        aria-label="Next events"
      >
        <FiChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
};
