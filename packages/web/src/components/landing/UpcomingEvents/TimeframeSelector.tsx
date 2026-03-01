// components/TimeframeSelector.tsx
'use client';

interface TimeframeSelectorProps {
  timeframe: 'all' | 'week' | 'month';
  setTimeframe: (timeframe: 'all' | 'week' | 'month') => void;
  setCurrentPage: (page: number) => void;
}

export const TimeframeSelector = ({
  timeframe,
  setTimeframe,
  setCurrentPage,
}: TimeframeSelectorProps) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        <button
          onClick={() => {
            setTimeframe('all');
            setCurrentPage(0);
          }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            timeframe === 'all'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => {
            setTimeframe('week');
            setCurrentPage(0);
          }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            timeframe === 'week'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => {
            setTimeframe('month');
            setCurrentPage(0);
          }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            timeframe === 'month'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          This Month
        </button>
      </div>
    </div>
  );
};
