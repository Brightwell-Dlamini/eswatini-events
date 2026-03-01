import Image from 'next/image';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ClockIcon, Share2Icon } from 'lucide-react';
import { Event } from '@/lib/types';
import { calculateTimeLeft, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface EventCardProps {
  event: Event;
}

const getCategoryImage = (category: string) => {
  const categoryImages: Record<string, string> = {
    music: '/music-placeholder.jpg',
    sports: '/sports-placeholder.jpg',
    art: '/art-placeholder.jpg',
    food: '/food-placeholder.jpg',
    default: '/placeholder-event.jpg',
  };
  return categoryImages[category.toLowerCase()] || categoryImages.default;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    music: 'from-purple-600 to-blue-500',
    sports: 'from-red-600 to-orange-500',
    art: 'from-green-600 to-teal-400',
    food: 'from-yellow-600 to-amber-500',
    default: 'from-gray-600 to-gray-400',
  };
  return colors[category.toLowerCase()] || colors.default;
};

export const EventCard = ({ event }: EventCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await navigator.share({
        title: event.name,
        text: `Check out this event: ${event.name}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      {/* Mobile Layout  */}
      <motion.article
        className="group md:hidden flex items-center gap-3 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.02 }}
        aria-labelledby={`event-${event.id}-title-mobile`}
      >
        <div className="w-20 h-20 flex-shrink-0 relative rounded-md overflow-hidden">
          <Image
            src={imageError ? getCategoryImage(event.category) : event.image}
            alt={`${event.name} promotional image`}
            fill
            className="object-cover"
            sizes="80px"
            onError={() => setImageError(true)}
          />
          {event.price > 0 ? (
            <div
              className="absolute bottom-1 left-1 bg-black/70 px-2 py-0.5 rounded-full text-xs font-bold text-amber-400"
              aria-label={`Ticket price: From E${event.price}`}
            >
              E{event.price}
            </div>
          ) : (
            <div
              className="absolute bottom-1 left-1 bg-black/70 px-2 py-0.5 rounded-full text-xs font-bold text-green-400"
              aria-label="Free event"
            >
              FREE
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3
              id={`event-${event.id}-title-mobile`}
              className="text-xs font-bold text-white line-clamp-2"
            >
              {event.name}
            </h3>
          </div>

          <div className="flex items-center text-xs text-gray-300 mt-1">
            <CalendarIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center text-xs text-gray-300 mt-1">
            <MapPinIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </motion.article>

      {/* Desktop Layout (original card design) */}
      <motion.article
        className="hidden md:block relative overflow-hidden rounded-lg shadow-xl bg-white dark:bg-gray-800 h-full  flex-col"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        aria-labelledby={`event-${event.id}-title-desktop`}
      >
        <motion.div
          className="relative h-28 flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageError ? getCategoryImage(event.category) : event.image}
            alt={`${event.name} promotional image`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={event.imagePriority || false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div
            className={`absolute top-3 right-3 bg-gradient-to-r ${getCategoryColor(event.category)} px-3 py-1 rounded-full text-xs font-bold text-white shadow-md`}
            aria-label={`Event category: ${event.category}`}
          >
            {event.category}
          </div>

          {event.price > 0 ? (
            <div
              className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-600 shadow-sm"
              aria-label={`Ticket price: From E${event.price}`}
            >
              From E{event.price}
            </div>
          ) : (
            <div
              className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm"
              aria-label="Free event"
            >
              FREE
            </div>
          )}
        </motion.div>

        <div className="p-2 flex flex-col flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3
                id={`event-${event.id}-title-desktop`}
                className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2"
              >
                {event.name}
              </h3>

              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1 text-xs">
                <CalendarIcon
                  className="h-4 w-4 mr-1.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1.5 text-xs">
                <MapPinIcon
                  className="h-4 w-4 mr-1.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>

            {event.ticketsLeft !== null && event.ticketsLeft < 20 && (
              <motion.span
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 1.5,
                }}
                aria-label={`Only ${event.ticketsLeft} tickets left`}
              >
                Only {event.ticketsLeft} left!
              </motion.span>
            )}
          </div>

          <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                <ClockIcon
                  className="h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-medium">
                  {calculateTimeLeft(event.date)}
                </span>
              </div>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Share event"
                disabled={isSharing}
              >
                <Share2Icon className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* 3D tilt effect layer */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>
      </motion.article>
    </>
  );
};
