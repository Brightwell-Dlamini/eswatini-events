// components/events/EventCard.tsx
'use client';

import { motion, useAnimation } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  BoltIcon as LightningBoltIcon,
} from '@heroicons/react/24/outline';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import Image from 'next/image';
import { MainEvents } from '@/lib/types';

type EventCardProps = {
  event: MainEvents;
  liked: boolean;
  onLike: (id: number) => void;
};
const calculateTicketsLeft = (event: MainEvents): number => {
  // For free events or events without ticket limits, return 0 or null as needed
  if (event.isFree || event.totalTickets === 0) return 0;

  // Calculate remaining tickets
  return Math.max(0, event.totalTickets - event.ticketsSold);
};

export const EventCard = ({ event, liked, onLike }: EventCardProps) => {
  const controls = useAnimation();

  const isEarlyBirdAvailable = () => {
    return (
      event.earlyBirdCutoff && new Date() < new Date(event.earlyBirdCutoff)
    );
  };

  const getTicketPercentage = () => {
    return event.totalTickets > 0
      ? (event.ticketsSold / event.totalTickets) * 100
      : 0;
  };

  const handleLike = () => {
    onLike(event.id);
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 },
    });
  };

  const earlyBirdAvailable = isEarlyBirdAvailable();
  const ticketPercentage = getTicketPercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        type: 'spring',
        damping: 10,
      }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{
        y: -5,
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group"
    >
      <div className="relative h-42 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          {event.isTrending && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold">
              <FireIcon className="h-3 w-3 mr-1" />
              TRENDING
            </span>
          )}

          {event.isPopular && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold">
              <StarIcon className="h-3 w-3 mr-1" />
              POPULAR
            </span>
          )}

          {earlyBirdAvailable && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">
              <LightningBoltIcon className="h-3 w-3 mr-1" />
              EARLY BIRD
            </span>
          )}
        </div>

        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-purple-600 dark:text-purple-400 text-xs font-bold">
          {event.category}
        </span>

        <motion.button
          onClick={handleLike}
          className="absolute bottom-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Save event"
          animate={controls}
        >
          {liked ? (
            <FaHeart className="h-4 w-4 text-pink-500" />
          ) : (
            <FaRegHeart className="h-4 w-4 text-white" />
          )}
        </motion.button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h3>
          <button className="p-1 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
            <FaShareAlt className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center text-sm">
            <div className="flex items-center text-amber-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(event.rating) ? 'fill-current' : ''
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {event.rating}
            </span>
          </div>
        </div>

        {!event.isFree && event.totalTickets > 0 && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                style={{ width: `${ticketPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{event.ticketsSold} sold</span>
              {event.ticketsLeft > 0 && <span>{event.ticketsLeft} left</span>}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <div>
            {event.isFree ? (
              <span className="text-lg font-bold text-green-500">
                FREE ENTRY
              </span>
            ) : earlyBirdAvailable ? (
              <>
                <span className="text-sm font-bold text-green-500 line-through mr-1">
                  E{event.price}
                </span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  From E{event.earlyBirdPrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                E {event.price}
              </span>
            )}

            {!event.isFree && calculateTicketsLeft(event) > 0 && (
              <span
                className={`block text-xs font-medium ${
                  calculateTicketsLeft(event) < 100
                    ? 'text-red-600 dark:text-red-400'
                    : calculateTicketsLeft(event) < 500
                      ? 'text-orange-500 dark:text-orange-400'
                      : 'text-green-600 dark:text-green-400'
                }`}
              >
                {calculateTicketsLeft(event) < 100
                  ? `Only ${calculateTicketsLeft(event)} remaining!`
                  : calculateTicketsLeft(event) < 500
                    ? `${calculateTicketsLeft(event)} remaining`
                    : `${calculateTicketsLeft(event)} available`}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center text-sm px-3 py-1.5 rounded-lg transition-all duration-200 ${
              event.isFree
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
            }`}
          >
            <span>{event.isFree ? 'Attend' : 'Get Tickets'}</span>
            <ArrowRightIcon className="h-3 w-3 ml-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
