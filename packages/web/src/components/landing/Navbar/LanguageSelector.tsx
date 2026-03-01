import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import DropdownMenu from './DropdownMenu';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ss', name: 'Siswati', flag: '🇸🇿' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        aria-label="Language selector"
        aria-expanded={isOpen}
      >
        <GlobeAltIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          EN
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <DropdownMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            {lang.name}
          </button>
        ))}
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
