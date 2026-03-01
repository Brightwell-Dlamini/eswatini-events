// components/UpcomingHighlights.tsx
'use client';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import FloatingParticles from '../ui/confetti';
import { UpcomingEvents } from '@/lib/mockData';
import { groupEventsByTimeframe } from '@/lib/utils';
import { SectionHeader } from './UpcomingEvents/SectionHeader';
import { TimeframeSelector } from './UpcomingEvents/TimeframeSelector';
import { PaginationControls } from './UpcomingEvents/PaginationControls';
import { CalendarIcon } from 'lucide-react';
import { EventCard } from './UpcomingEvents/EventCard';

const UpcomingHighlights = () => {
  const [isClient, setIsClient] = useState(false);
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setVisibleCount(
        window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3
      );
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredEvents = useMemo(
    () => groupEventsByTimeframe(UpcomingEvents, timeframe),
    [timeframe]
  );
  const totalPages = Math.ceil(filteredEvents.length / visibleCount);
  const canScrollPrev = currentPage > 0;
  const canScrollNext = currentPage < totalPages - 1;
  const visibleEvents = filteredEvents.slice(
    currentPage * visibleCount,
    (currentPage + 1) * visibleCount
  );

  return (
    <section
      id="upcoming-events"
      className="relative py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden"
      aria-labelledby="upcoming-events-heading"
    >
      {isClient && <FloatingParticles />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader />

        <TimeframeSelector
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          setCurrentPage={setCurrentPage}
        />

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              canScrollPrev={canScrollPrev}
              canScrollNext={canScrollNext}
            />
          )}

          {filteredEvents.length === 0 && (
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
        </div>
      </div>
    </section>
  );
};

export default UpcomingHighlights;
