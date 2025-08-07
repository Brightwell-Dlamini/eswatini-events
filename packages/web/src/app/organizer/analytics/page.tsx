'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { api } from '@/lib/api';
import { AnalyticsData } from '@/types/schema'; // Adjust import based on your schema

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="text-center text-xl" role="status" aria-live="polite">
        {'loading'}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-red-400" role="alert">
        {'analyticsError'}
      </div>
    );
  }

  // Sales over time (Line Chart)
  const salesData = {
    labels: analytics.salesOverTime.map(
      (point: { date: string }) => point.date
    ),
    datasets: [
      {
        label: 'revenue',
        data: analytics.salesOverTime.map(
          (point: { revenue: number }) => point.revenue
        ),
        borderColor: '#ff6d00',
        backgroundColor: 'rgba(255, 109, 0, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Ticket type distribution (Pie Chart)
  const ticketTypeData = {
    labels: analytics.ticketTypes.map((type: { name: string }) => type.name),
    datasets: [
      {
        data: analytics.ticketTypes.map((type: { sold: number }) => type.sold),
        backgroundColor: ['#ff6d00', '#4a148c', '#2ecc71', '#f1c40f'],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Check-in rate (Bar Chart)
  const checkInData = {
    labels: ['checkedIn', 'notCheckedIn'],
    datasets: [
      {
        label: 'attendees',
        data: [
          analytics.checkInRate.checkedIn,
          analytics.checkInRate.total - analytics.checkInRate.checkedIn,
        ],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Demographic breakdown (Bar Chart)
  const demographicData = {
    labels: analytics.demographics.age.map(
      (demo: { range: string }) => demo.range
    ),
    datasets: [
      {
        label: 'attendeesByAge',
        data: analytics.demographics.age.map(
          (demo: { count: number }) => demo.count
        ),
        backgroundColor: '#4a148c',
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto p-4"
      role="main"
      aria-label={'analyticsDashboard'}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-white">
        {'analyticsDashboard'}
      </h1>

      {/* Sales Over Time */}
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {'salesOverTime'}
        </h2>
        <div className="h-64">
          <Line
            data={salesData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'SZL', color: '#ffffff' },
                },
                x: {
                  title: { display: true, text: 'date', color: '#ffffff' },
                },
              },
              plugins: {
                legend: { labels: { color: '#ffffff' } },
                tooltip: { enabled: true },
              },
            }}
            aria-label={'salesChart'}
          />
        </div>
      </div>

      {/* Ticket Type Distribution */}
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {'ticketTypeDistribution'}
        </h2>
        <div className="h-64">
          <Pie
            data={ticketTypeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right', labels: { color: '#ffffff' } },
                tooltip: { enabled: true },
              },
            }}
            aria-label={'ticketTypeChart'}
          />
        </div>
      </div>

      {/* Check-in Rate */}
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {'checkInRate'}
        </h2>
        <div className="h-64">
          <Bar
            data={checkInData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'count', color: '#ffffff' },
                },
              },
              plugins: {
                legend: { labels: { color: '#ffffff' } },
                tooltip: { enabled: true },
              },
            }}
            aria-label={'checkInChart'}
          />
        </div>
        <p className="text-2xl text-white mt-4">
          {'checkInRate'}:{' '}
          {(
            (analytics.checkInRate.checkedIn / analytics.checkInRate.total) *
            100
          ).toFixed(1)}
          % ({analytics.checkInRate.checkedIn}/{analytics.checkInRate.total}{' '}
          {'attendees'})
        </p>
      </div>

      {/* Demographic Breakdown */}
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {'demographicBreakdown'}
        </h2>
        <div className="h-64">
          <Bar
            data={demographicData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'count', color: '#ffffff' },
                },
                x: {
                  title: {
                    display: true,
                    text: 'ageRange',
                    color: '#ffffff',
                  },
                },
              },
              plugins: {
                legend: { labels: { color: '#ffffff' } },
                tooltip: { enabled: true },
              },
            }}
            aria-label={'demographicChart'}
          />
        </div>
        <div className="mt-4 text-white">
          <p>{'location'}: </p>
          <ul className="list-disc pl-5">
            {analytics.demographics.location.map(
              (loc: { name: string; percentage: number }) => (
                <li key={loc.name}>
                  {loc.name}: {loc.percentage.toFixed(1)}%
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
