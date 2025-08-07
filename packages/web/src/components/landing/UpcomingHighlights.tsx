'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

type Event = {
  id: number;
  name: string;
  date: string;
  location: string;
  image: string;
  ticketsLeft: number | null; // null means free entry
  imagePriority: boolean;
  category: string;
  price?: string;
};

const events: Event[] = [
  {
    id: 1,
    name: 'MTN Bushfire Festival',
    date: '2025-07-30',
    location: 'Malkerns Valley',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    ticketsLeft: 12,
    imagePriority: true,
    category: 'Music Festival',
    price: 'From E500',
  },
  {
    id: 2,
    name: 'Eswatini vs Nigeria',
    date: '2025-07-19',
    location: 'Somhlolo Stadium',
    image:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1605&q=80',
    ticketsLeft: 43,
    imagePriority: false,
    category: 'Sports',
    price: 'From E250',
  },
  {
    id: 3,
    name: 'Art Exhibition Opening',
    date: '2025-07-20',
    location: 'Mbabane Art Gallery',
    image:
      'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1804&q=80',
    ticketsLeft: null, // Free event
    imagePriority: false,
    category: 'Art',
    price: 'Free',
  },
  {
    id: 4,
    name: 'Tech Conference',
    date: '2025-03-22',
    location: 'Royal Swazi Convention Center',
    image:
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    ticketsLeft: 8,
    imagePriority: false,
    category: 'Conference',
    price: 'E1,200',
  },
  {
    id: 5,
    name: 'Jazz Night',
    date: '2025-03-25',
    location: 'House on Fire',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    ticketsLeft: 15,
    imagePriority: false,
    category: 'Music',
    price: 'E300',
  },
  {
    id: 6,
    name: 'Food Festival',
    date: '2025-04-05',
    location: 'Mantenga Cultural Village',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    ticketsLeft: null, // Free event
    imagePriority: false,
    category: 'Food',
    price: 'Free',
  },
  {
    id: 7,
    name: 'Community Yoga',
    date: '2025-03-20',
    location: 'Botanical Gardens',
    image:
      'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
    ticketsLeft: null,
    imagePriority: false,
    category: 'Wellness',
    price: 'Free',
  },
  {
    id: 8,
    name: 'Film Premiere',
    date: '2025-04-10',
    location: 'Swazi Cineplex',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    ticketsLeft: 56,
    imagePriority: false,
    category: 'Cinema',
    price: 'E150',
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-SZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const calculateTimeLeft = (eventDate: string) => {
  const difference = new Date(eventDate).getTime() - new Date().getTime();
  if (difference <= 0) return 'Event passed';

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

  return `${days}d ${hours}h left`;
};

const groupEventsByTimeframe = (
  events: Event[],
  timeframe: 'all' | 'week' | 'month'
) => {
  if (timeframe === 'all') return [...events]; // Return all events

  const now = new Date();
  const currentDate = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventDay = eventDate.getDate();
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();

    if (timeframe === 'week') {
      // Events within the next 7 days
      const daysDifference = Math.floor(
        (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDifference >= 0 && daysDifference <= 7;
    } else {
      // Events within the current month
      return (
        eventMonth === currentMonth &&
        eventYear === currentYear &&
        eventDay >= currentDate
      );
    }
  });
};

const UpcomingHighlights = () => {
  const [isClient, setIsClient] = useState(false);
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all');
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredEvents = groupEventsByTimeframe(events, timeframe);
  const itemsPerPage = 6; // 3 columns x 2 rows
  const pageCount = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setPage((prev) =>
      Math.max(0, Math.min(pageCount - 1, prev + newDirection))
    );
  };

  return (
    <section
      id="upcoming-events"
      className="relative py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden"
      aria-labelledby="upcoming-events-heading"
    >
      {/* Animated floating confetti - client-side only */}
      {isClient &&
        [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: -20,
              x: Math.random() * 100 - 50,
              rotate: Math.random() * 360,
            }}
            animate={{
              opacity: [0, 0.4, 0],
              y: [0, Math.random() * 200 - 100],
              x: [0, Math.random() * 200 - 100],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
              delay: Math.random() * 5,
            }}
            className="absolute w-3 h-3 rounded-sm bg-gradient-to-r from-purple-400 to-pink-400 pointer-events-none"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 100,
              damping: 10,
            },
          }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <motion.div className="inline-flex items-center gap-2 mb-4">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <span className="text-sm font-semibold tracking-wide uppercase text-purple-600 dark:text-purple-400">
              Hot Tickets
            </span>
          </motion.div>

          <h2
            id="upcoming-events-heading"
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Don&apos;t Miss These
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{
                  scaleX: 1,
                  transition: { delay: 0.6, duration: 0.8 },
                }}
                className="absolute bottom-0 left-0 w-full h-3 bg-purple-100 dark:bg-purple-900/40 -z-0 transform translate-y-1 origin-left"
              />
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upcoming highlights with limited tickets - secure your spot before
            they&apos;re gone!
          </p>
        </motion.div>

        {/* Timeframe selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            <button
              onClick={() => {
                setTimeframe('all');
                setPage(0);
              }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === 'all'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => {
                setTimeframe('week');
                setPage(0);
              }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === 'week'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => {
                setTimeframe('month');
                setPage(0);
              }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === 'month'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Events grid with pagination */}
        <div className="relative">
          <AnimatePresence initial={false} custom={direction}>
            {paginatedEvents.length > 0 ? (
              <motion.div
                key={page}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {paginatedEvents.map((event, i) => (
                  <motion.article
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{
                      y: -10,
                      transition: { type: 'spring', bounce: 0.4 },
                    }}
                    className="group relative overflow-hidden rounded-2xl shadow-lg focus:outline-none transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800"
                    tabIndex={0}
                    aria-labelledby={`event-${event.id}-title`}
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

                      {/* Category badge */}
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 shadow-sm">
                        {event.category}
                      </div>

                      {/* Price tag */}
                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          event.price === 'Free'
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
                          <h3
                            id={`event-${event.id}-title`}
                            className="text-xl font-bold text-gray-900 dark:text-white"
                          >
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

                        {/* Tickets left or free badge */}
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
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No events found
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  There are no upcoming events for this {timeframe}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination controls */}
          {paginatedEvents.length > 0 && pageCount > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => paginate(-1)}
                  disabled={page === 0}
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Previous page"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page {page + 1} of {pageCount}
                </span>
                <button
                  onClick={() => paginate(1)}
                  disabled={page === pageCount - 1}
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Next page"
                >
                  <ArrowRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingHighlights;
