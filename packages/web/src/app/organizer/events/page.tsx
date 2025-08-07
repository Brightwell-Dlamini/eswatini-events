'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { EventCard } from '@/components/organizer/EventCard';
import { Event } from '@/types/schema'; // Import Event type

const EventListPage: React.FC = () => {
  // Add proper type for filter state
  const [filter, setFilter] = useState<{
    status: string;
    type: string;
    date: string;
  }>({ status: '', type: '', date: '' });

  // Properly type the useQuery hook
  const { data: events } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  // Type the event parameter in filter callback
  const filteredEvents = events?.filter(
    (event: Event) =>
      (!filter.status || event.status === filter.status) &&
      (!filter.type || event.type === filter.type) &&
      (!filter.date || event.startTime.includes(filter.date))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Your Events</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="p-2 rounded bg-white bg-opacity-10 text-white"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="p-2 rounded bg-white bg-opacity-10 text-white"
        >
          <option value="">All Types</option>
          <option value="MUSIC">Music</option>
          <option value="FESTIVAL">Festival</option>
          <option value="CONFERENCE">Conference</option>
        </select>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="p-2 rounded bg-white bg-opacity-10 text-white"
        />
        <Link
          href="/organizer/events/create"
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full"
        >
          Create Event
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents?.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </motion.div>
  );
};

export default EventListPage;
