'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TicketTypeCard } from '@/components/organizer/TicketTypeCard';
import { api } from '@/lib/api';
import { TicketTypeConfig } from '@/types/schema';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const TicketsPage: React.FC = () => {
  const [eventId, setEventId] = useState('');
  const {
    data: tickets,
    isLoading,
    error,
  } = useQuery<TicketTypeConfig[]>({
    queryKey: ['tickets', eventId],
    queryFn: () => api.getTicketTypes(eventId),
    initialData: [],
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading tickets</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Ticket Management</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Filter by Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="p-2 rounded bg-white bg-opacity-10 text-white flex-grow"
        />
        <Link
          href="/organizer/tickets/create"
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full"
        >
          Create Ticket Type
        </Link>
      </div>
      <div className="space-y-4">
        {tickets?.length > 0 ? (
          tickets.map((ticket) => (
            <TicketTypeCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <div className="text-center py-8">No tickets found</div>
        )}
      </div>
    </motion.div>
  );
};

export default TicketsPage;
