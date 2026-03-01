// components/events/FeaturedEvents.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { EventCard } from './EventCard';
import { EventsPagination } from './EventsPagination';
import { FeaturedEventsHeader } from './FeaturedEventsHeader';
import { MainEvents } from '@/lib/types';

const bubbles = [
  { id: 1, size: 120, left: '10%', top: '20%', delay: 0.5 },
  { id: 2, size: 80, left: '30%', top: '40%', delay: 1 },
  { id: 3, size: 150, left: '70%', top: '30%', delay: 1.5 },
  { id: 4, size: 100, left: '85%', top: '60%', delay: 2 },
];

type FeaturedEventsProps = {
  events: MainEvents[];
};

export const FeaturedEvents = ({ events }: FeaturedEventsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [likedEvents, setLikedEvents] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const toggleLike = (id: number) => {
    setLikedEvents((prev) =>
      prev.includes(id)
        ? prev.filter((eventId) => eventId !== id)
        : [...prev, id]
    );
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={ref}
      className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            animate={{
              y: [0, -100],
              opacity: [0.5, 0],
              transition: {
                duration: 15,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: bubble.delay,
              },
            }}
            className="absolute rounded-full bg-purple-500/10 dark:bg-pink-500/10"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: bubble.left,
              top: bubble.top,
            }}
          />
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FeaturedEventsHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              liked={likedEvents.includes(event.id)}
              onLike={toggleLike}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <EventsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPaginate={paginate}
          />
        )}
      </div>
    </section>
  );
};
