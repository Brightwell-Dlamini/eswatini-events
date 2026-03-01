import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ChevronDownIcon,
  UserCircleIcon,
  TicketIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import DropdownMenu from './DropdownMenu';
import { User } from '@/lib/types';

const UserMenu = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2 relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <motion.div
          whileHover={{ rotate: 5 }}
          className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-md"
        >
          <UserCircleIcon className="h-5 w-5 text-white" />
        </motion.div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <DropdownMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name || user.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        <Link
          href="/profile"
          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <UserCircleIcon className="h-5 w-5 mr-2" />
          My Profile
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <TicketIcon className="h-5 w-5 mr-2" />
          My Events
        </Link>
        <button
          onClick={onLogout}
          className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          <span>Sign Out</span>
        </button>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
