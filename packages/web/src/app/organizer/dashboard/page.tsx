'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Line } from 'react-chartjs-2';
import { Event, AnalyticsItem } from '@/types/schema';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AICopilotPanel } from '@/components/organizer/AICopilotPanel';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrganizerDashboard: React.FC = () => {
  const { data: events } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const { data: analytics } = useQuery<AnalyticsItem[]>({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
  });

  const recentActivity = [
    {
      id: '1',
      message: '500 tickets sold for MTN Bushfire 2025',
      time: '2h ago',
    },
    { id: '2', message: 'Mbabane Music Fest draft created', time: '5h ago' },
  ];

  // Prepare chart data
  const chartData = {
    labels: analytics?.[0]?.data.salesOverTime.map((point) => point.date) || [],
    datasets: [
      {
        label: 'Revenue',
        data:
          analytics?.[0]?.data.salesOverTime.map((point) => point.revenue) ||
          [],
        borderColor: '#ff6d00',
        backgroundColor: 'rgba(255, 109, 0, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Organizer Dashboard</h1>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg space-y-4">
        <p className="text-lg">
          Welcome back! Here&apos;s a quick overview of your events and
          analytics.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white bg-opacity-10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Total Events</h2>
          <p className="text-3xl">{events?.length || 0}</p>
        </div>
        <div className="bg-white bg-opacity-10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Total Tickets Sold</h2>
          <p className="text-3xl">
            {events?.reduce(
              (sum: number, event: Event) => sum + event.ticketsSold,
              0
            ) || 0}
          </p>
        </div>
        <div className="bg-white bg-opacity-10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-3xl">
            SZL{' '}
            {(
              events?.reduce(
                (sum: number, event: Event) => sum + event.revenue,
                0
              ) || 0
            ).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sales Trends</h2>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          {recentActivity.map((activity) => (
            <li key={activity.id} className="flex justify-between">
              <span>{activity.message}</span>
              <span className="text-gray-400">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <AICopilotPanel />
      </div>
    </motion.div>
  );
};

export default OrganizerDashboard;
