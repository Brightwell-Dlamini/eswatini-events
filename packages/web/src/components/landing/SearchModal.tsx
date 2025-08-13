import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon as SparklesSolid,
  TicketIcon as TicketOutline,
  MusicalNoteIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const eventTypes = [
  { id: 'all', name: 'All Events' },
  { id: 'festival', name: 'Festivals' },
  { id: 'sports', name: 'Sports' },
  { id: 'concert', name: 'Concerts' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'corporate', name: 'Corporate' },
];

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Find Your Perfect Event
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {/* Search input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search events..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>Any Date</option>
                    <option>This Weekend</option>
                    <option>Next Week</option>
                    <option>Next Month</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                {/* Location filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>Any Location</option>
                    <option>Mbabane</option>
                    <option>Manzini</option>
                    <option>Lobamba</option>
                    <option>Malkerns</option>
                    <option>Sidvokodvo</option>
                  </select>
                </div>
              </div>

              {/* Event type filters */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                        type.id === 'all'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.id === 'festival' && (
                        <SparklesSolid className="h-4 w-4" />
                      )}
                      {type.id === 'sports' && (
                        <TicketOutline className="h-4 w-4" />
                      )}
                      {type.id === 'concert' && (
                        <MusicalNoteIcon className="h-4 w-4" />
                      )}
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center justify-center gap-2">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>Search Events</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
