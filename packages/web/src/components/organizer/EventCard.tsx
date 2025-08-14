// components/organizer/EventCard.tsx
'use client';
import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiEdit2,
  FiBarChart2,
} from 'react-icons/fi';
import Link from 'next/link';
import { memo } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

type EventStatus = 'draft' | 'published' | 'completed' | 'canceled';

interface Event {
  id: string;
  title: string;
  date: string;
  status: EventStatus;
  attendees: number;
  revenue: number;
  image?: string;
  ticketsSold: number;
  capacity: number;
}

type EventCardVariant = 'compact' | 'detailed';

const statusColors: Record<EventStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  published: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  completed:
    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const EventCard = memo(
  ({
    event,
    variant = 'compact',
  }: {
    event: Event;
    variant?: EventCardVariant;
  }) => {
    const formattedDate =
      new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) || 'Date not specified';

    const progressPercentage = Math.min(
      Math.round((event.ticketsSold / event.capacity) * 100),
      100
    );

    if (variant === 'compact') {
      return (
        <Link
          href={`/organizer/events/${event.id}`}
          className="group block border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-800"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 relative h-16 w-16 rounded-lg overflow-hidden shadow-sm">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {event.title.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {event.title}
                </h3>
                <Badge className={`${statusColors[event.status]} rounded-md`}>
                  {event.status}
                </Badge>
              </div>

              <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiCalendar className="mr-1.5 flex-shrink-0" />
                <span>{formattedDate}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <FiUsers className="mr-1.5 text-gray-400" />
                  <span>{event.attendees.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-end font-medium text-green-600 dark:text-green-400">
                  <FiDollarSign className="mr-1" />
                  <span>${event.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    }

    // Detailed variant
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800">
        <div className="relative h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {event.title.charAt(0)}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {event.title}
            </h3>
            <Badge className={`${statusColors[event.status]} rounded-md`}>
              {event.status}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <FiCalendar className="mr-1.5" />
            <span>{formattedDate}</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">
                  Tickets sold
                </span>
                <span className="font-medium">
                  {event.ticketsSold} / {event.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 mr-3">
                  <FiUsers size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Attendees
                  </p>
                  <p className="font-medium">
                    {event.attendees.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 mr-3">
                  <FiDollarSign size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    ${event.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/organizer/events/${event.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiEdit2 size={16} />
              Manage
            </Link>
            <Link
              href={`/organizer/events/${event.id}/analytics`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiBarChart2 size={16} />
              Analytics
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

EventCard.displayName = 'EventCard';
export default EventCard;
