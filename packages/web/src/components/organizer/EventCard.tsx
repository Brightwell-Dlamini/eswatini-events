import Link from 'next/link';
import { motion } from 'framer-motion';
import { Event } from '@/types/schema';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h3 className="text-xl font-semibold">{event.name}</h3>
      <p>
        {event.city} - {new Date(event.startTime).toLocaleDateString()}
      </p>
      <p>Status: {event.status}</p>
      <p>
        Tickets Sold: {event.ticketsSold}/{event.capacity}
      </p>
      <p>Revenue: SZL {event.revenue.toLocaleString()}</p>
      <Link
        href={`/organizer/events/${event.id}`}
        className="btn-primary mt-4 inline-block"
      >
        Manage Event
      </Link>
    </motion.div>
  );
};
