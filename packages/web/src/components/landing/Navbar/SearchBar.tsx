import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon as SparklesSolid,
  TicketIcon as TicketOutline,
  MusicalNoteIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  Squares2X2Icon as AllEventsIcon, // For "All Events"
  GlobeAltIcon as CulturalIcon, // For "Cultural"
  BuildingOfficeIcon as CorporateIcon, // For "Corporate"
} from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl border border-gray-200 dark:border-gray-700 my-8"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed', // Ensure fixed positioning
              transform: 'translate(-50%, -50%)', // Proper centering
              maxHeight: '80vh', // Limit height
              overflowY: 'auto', // Enable scrolling inside modal
            }}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close search modal"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </motion.button>

            <motion.h2
              className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Find Your Perfect Event
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 gap-4">
              {/* Rest of your modal content remains the same */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                  placeholder="Find events..."
                />
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Date filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200">
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
                  <select className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200">
                    <option>Any Location</option>
                    <option>Mbabane</option>
                    <option>Manzini</option>
                    <option>Lobamba</option>
                    <option>Malkerns</option>
                    <option>Sidvokodvo</option>
                  </select>
                </div>
              </motion.div>

              {/* Event type filters */}
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {eventTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{
                        scale: selectedCategory !== type.id ? 1.05 : 1,
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(type.id)}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                        selectedCategory === type.id
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.id === 'all' && (
                        <AllEventsIcon className="h-4 w-4" />
                      )}
                      {type.id === 'festival' && (
                        <SparklesSolid className="h-4 w-4" />
                      )}
                      {type.id === 'sports' && (
                        <TicketOutline className="h-4 w-4" />
                      )}
                      {type.id === 'concert' && (
                        <MusicalNoteIcon className="h-4 w-4" />
                      )}
                      {type.id === 'cultural' && (
                        <CulturalIcon className="h-4 w-4" />
                      )}
                      {type.id === 'corporate' && (
                        <CorporateIcon className="h-4 w-4" />
                      )}
                      {type.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-500 to-yellow-500 text-white font-medium rounded-lg hover:from-blue-700 hover:via-purple-600 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>Search Events</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
