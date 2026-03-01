import {
  InformationCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { CalendarIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

const NAV_LINKS = [
  {
    name: 'Events',
    href: '/events',
    icon: <CalendarIcon className="h-6 w-6" />,
  },
  {
    name: 'Organizers',
    href: '/organizer',
    icon: <UserGroupIcon className="h-6 w-6" />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <InformationCircleIcon className="h-6 w-6" />,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: <PhoneIcon className="h-6 w-6" />,
  },
];

const NavLinks = () => {
  const pathname = usePathname();
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const hoverRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleHoverStart = (name: string) => setActiveHover(name);
  const handleHoverEnd = () => setActiveHover(null);

  return (
    <div className="hidden lg:flex items-center space-x-1 relative">
      {NAV_LINKS.map((link) => (
        <motion.div
          key={link.name}
          ref={(el) => {
            hoverRefs.current[link.name] = el;
          }}
          onHoverStart={() => handleHoverStart(link.name)}
          onHoverEnd={handleHoverEnd}
          className="relative"
        >
          <Link
            href={link.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 relative z-10 ${
              pathname === link.href
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            } transition-all duration-200`}
            aria-current={pathname === link.href ? 'page' : undefined}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>

          {activeHover === link.name && (
            <motion.div
              layoutId="navHoverBg"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.4,
              }}
              className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg -z-1"
            />
          )}

          {pathname === link.href && (
            <motion.div
              layoutId="navActiveIndicator"
              className="absolute bottom-0 left-1/2 h-1 w-1/2 bg-blue-600 dark:bg-blue-400 rounded-t-full -translate-x-1/2"
              transition={{ type: 'spring', bounce: 0.3 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default NavLinks;
