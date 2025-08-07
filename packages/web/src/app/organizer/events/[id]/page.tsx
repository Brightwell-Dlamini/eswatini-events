'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

import { TicketTypeStats } from '@/types/schema';
import { AttendeeList } from '@/components/organizer/AttendeeList';
import { RefundCenter } from '@/components/organizer/RefundCenter';

const EventConsole = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: event } = useQuery({
    queryKey: ['event', id],
    queryFn: () =>
      api.getEvents().then((events) => events.find((e) => e.id === id)),
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => api.getAnalytics(),
  });

  if (!event) return <div className="text-center text-xl">Event not found</div>;

  const handlePublish = () => {
    console.log(`Publishing event ${event.id}`);
  };

  // Prepare pie chart data
  const pieChartData = {
    labels:
      analytics?.[0]?.data.ticketTypes?.map((t: TicketTypeStats) => t.name) ||
      [],
    datasets: [
      {
        label: 'Tickets Sold',
        data:
          analytics?.[0]?.data.ticketTypes?.map(
            (t: TicketTypeStats) => t.sold
          ) || [],
        backgroundColor: [
          'rgba(255, 109, 0, 0.7)',
          'rgba(74, 20, 140, 0.7)',
          'rgba(30, 58, 138, 0.7)',
          'rgba(22, 163, 74, 0.7)',
        ],
        borderColor: [
          'rgba(255, 109, 0, 1)',
          'rgba(74, 20, 140, 1)',
          'rgba(30, 58, 138, 1)',
          'rgba(22, 163, 74, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">{event.name}</h1>
      {/* ... other event details ... */}
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        <div className="h-[300px]">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
      <AttendeeList />
      <RefundCenter />
    </motion.div>
  );
};

export default EventConsole;
