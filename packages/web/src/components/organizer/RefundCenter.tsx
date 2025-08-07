import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dummyRefunds } from '@/lib/dummyData';
import { api } from '@/lib/api';

interface Refund {
  id: string;
  ticketId: string;
  amount: number;
  reason: string;
  status: string;
}

interface RefundCenterProps {
  eventId?: string;
}

export const RefundCenter: React.FC<RefundCenterProps> = ({ eventId }) => {
  const [filter, setFilter] = useState('');
  const [refunds, setRefunds] = useState<Refund[]>([]);

  useEffect(() => {
    const fetchRefunds = async () => {
      const data = await api.getRefundRequests(eventId);
      setRefunds(data);
    };
    fetchRefunds();
  }, [eventId]);

  const filteredRefunds = refunds.filter(
    (refund) =>
      refund.ticketId.includes(filter) ||
      refund.reason.toLowerCase().includes(filter.toLowerCase())
  );

  const handleRefundAction = async (
    id: string,
    action: 'APPROVE' | 'DENY',
    customAmount?: number
  ) => {
    try {
      await api.processRefund(id, action, customAmount);
      setRefunds(
        refunds.map((refund) =>
          refund.id === id ? { ...refund, status: action } : refund
        )
      );
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Refund Requests</h2>
      <input
        type="text"
        placeholder="Filter by ticket ID or reason"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 rounded bg-white bg-opacity-10 text-white mb-4 w-full"
      />
      <ul className="space-y-2">
        {filteredRefunds.map((refund) => (
          <li
            key={refund.id}
            className="flex flex-col sm:flex-row justify-between items-center"
          >
            <div>
              <p>
                Ticket #{refund.ticketId} - SZL {refund.amount}
              </p>
              <p>Reason: {refund.reason}</p>
            </div>
            {refund.status === 'PENDING' && (
              <div className="flex gap-4 mt-2 sm:mt-0">
                <button
                  onClick={() => handleRefundAction(refund.id, 'APPROVE')}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRefundAction(refund.id, 'DENY')}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full"
                >
                  Deny
                </button>
                <input
                  type="number"
                  placeholder="Custom amount"
                  onChange={(e) =>
                    handleRefundAction(
                      refund.id,
                      'APPROVE',
                      Number(e.target.value)
                    )
                  }
                  className="p-2 rounded bg-white bg-opacity-10 text-white w-32"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
