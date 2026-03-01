import useClickOutside from '@/hooks/useClickOutside';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useRef } from 'react';

const DropdownMenu = ({
  isOpen,
  onClose,
  children,
  className = '',
  position = 'right',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  position?: 'left' | 'right';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ y: 10, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, type: 'spring' }}
          className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} top-full mt-2 z-50 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-gray-800 dark:text-gray-200 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropdownMenu;
