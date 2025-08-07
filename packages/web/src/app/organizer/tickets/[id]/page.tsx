'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { DynamicPricingAdjuster } from '@/components/organizer/DynamicPricingAdjuster';
import { TicketTypeConfig } from '@/types/schema';
import { useParams } from 'next/navigation'; // ← This is what you need!

const TicketTypePage = () => {
  const { id } = useParams(); // Cleanly get the ID

  const { data: ticket } = useQuery<TicketTypeConfig | undefined>({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const tickets = await api.getTicketTypes();
      return tickets.find((t) => t.id === id);
    },
  });

  if (!ticket) {
    return <div className="text-center text-xl">Ticket not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">{ticket.name}</h1>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <p>Type: {ticket.type}</p>
        <p>Price: SZL {ticket.price}</p>
        <p>
          Sold: {ticket.sold}/{ticket.quantity}
        </p>
        <p>Transferable: {ticket.isTransferable ? 'Yes' : 'No'}</p>
        <p>Refundable: {ticket.isRefundable ? 'Yes' : 'No'}</p>
      </div>
      {ticket.isTransferable && <DynamicPricingAdjuster ticket={ticket} />}
    </motion.div>
  );
};

export default TicketTypePage;
