// components/EventCard.tsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { Event } from '@/lib/types';
import { calculateTimeLeft, formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  index: number;
}

export const EventCard = ({ event, index }: EventCardProps) => {
  return (
    <motion.article
      key={event.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800"
    >
      <div className="relative h-64">
        <Image
          src={event.image}
          alt={`${event.name} promotional image`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={event.imagePriority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 shadow-sm">
          {event.category}
        </div>

        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            event.price === 0
              ? 'bg-green-500/90 text-white'
              : 'bg-white/90 text-gray-800'
          }`}
        >
          {event.price}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {event.name}
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>

          {event.ticketsLeft !== null ? (
            <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
              Only {event.ticketsLeft} left
            </span>
          ) : (
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
              Free Entry
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ClockIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {calculateTimeLeft(event.date)}
            </span>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md hover:shadow-lg transition-all">
            {event.ticketsLeft !== null ? (
              <>
                <TicketIcon className="h-4 w-4" />
                Get Tickets
              </>
            ) : (
              'More Info'
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};
