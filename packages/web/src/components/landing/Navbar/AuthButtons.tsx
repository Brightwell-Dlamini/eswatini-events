import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';

const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-3">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/auth/login"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-blue-600/30 dark:border-blue-400/30"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Log In</span>
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          href="/auth/register"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Sign Up</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default AuthButtons;
