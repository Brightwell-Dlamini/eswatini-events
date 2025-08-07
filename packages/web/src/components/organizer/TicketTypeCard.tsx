import Link from 'next/link';
import { motion } from 'framer-motion';
import { TicketTypeConfig } from '@/types/schema';
import { useDynamicPricing } from '@/hooks/useDynamicPricing';

interface TicketTypeCardProps {
  ticket: TicketTypeConfig;
}

export const TicketTypeCard: React.FC<TicketTypeCardProps> = ({ ticket }) => {
  const currentPrice = useDynamicPricing(ticket.id, ticket.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center"
    >
      <div>
        <h3 className="text-xl font-semibold">{ticket.name}</h3>
        <p>Price: SZL {currentPrice.toFixed(2)}</p>
        <p>
          Sold: {ticket.sold}/{ticket.quantity}
        </p>
        <p>Transferable: {ticket.isTransferable ? 'Yes' : 'No'}</p>
        <p>Refundable: {ticket.isRefundable ? 'Yes' : 'No'}</p>
      </div>
      <Link
        href={`/organizer/tickets/${ticket.id}`}
        className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-4 py-2 rounded-full mt-4 sm:mt-0"
      >
        Configure
      </Link>
    </motion.div>
  );
};
