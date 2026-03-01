// app/organizer/dashboard/page.tsx
'use client';
import { useState } from 'react';
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiPlus,
  FiArrowUpRight,
  FiPlusCircle,
  FiBarChart2,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PiMegaphoneLight } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/organizer/EventCard';
import { Event } from '@/types/event';

// Types
type TimeRange = '7d' | '30d' | '90d' | '12m';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

interface ActivityItemProps {
  type: 'ticket' | 'refund' | 'event';
  message: string;
  time: string;
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
}

// Sample data
const salesData = [
  { name: 'Jan', sales: 4000, tickets: 120 },
  { name: 'Feb', sales: 3000, tickets: 90 },
  { name: 'Mar', sales: 5000, tickets: 150 },
  { name: 'Apr', sales: 2780, tickets: 85 },
  { name: 'May', sales: 1890, tickets: 60 },
  { name: 'Jun', sales: 2390, tickets: 75 },
];

const upcomingEvents = [
  {
    id: 1, // Must match interface type (string)
    title: 'Tech Conference 2023',
    date: '2023-11-15',
    status: 'published' as const, // Ensures type is EventStatus
    attendees: 324,
    revenue: 12500,
    ticketsSold: 150,
    capacity: 500,
    image: '/event-tech.jpg',
  },
  {
    id: 2,
    title: 'Music Festival: Summer Edition with International Artists',
    date: '2023-12-05',
    status: 'published' as const,
    attendees: 850,
    revenue: 42000,
    ticketsSold: 400,
    capacity: 1000,
    image: '/event-music.jpg',
  },
] satisfies Event[]; // Ensures type safety

export default function OrganizerDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<'sales' | 'tickets'>('sales');
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [, setShowPromotionModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your events.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Events"
          value="12"
          change="+2"
          icon={
            <FiCalendar
              className="text-indigo-500 dark:text-indigo-400"
              size={20}
            />
          }
        />
        <StatCard
          title="Revenue"
          value="$24,500"
          change="+12%"
          icon={
            <FiDollarSign
              className="text-green-500 dark:text-green-400"
              size={20}
            />
          }
        />
        <StatCard
          title="Attendees"
          value="1,842"
          change="+8%"
          icon={
            <FiUsers className="text-blue-500 dark:text-blue-400" size={20} />
          }
        />
        <StatCard
          title="Conversion"
          value="3.2%"
          change="-0.4%"
          icon={
            <FiTrendingUp
              className="text-purple-500 dark:text-purple-400"
              size={20}
            />
          }
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Sales Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ticket Sales
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('tickets')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    chartType === 'tickets'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Tickets
                </button>
                <button
                  onClick={() => setChartType('sales')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    chartType === 'sales'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Revenue
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'sales' ? (
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366F1"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366F1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                      strokeOpacity={theme === 'dark' ? 0.3 : 1}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                        color: theme === 'dark' ? 'white' : 'inherit',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#6366F1"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={salesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                      strokeOpacity={theme === 'dark' ? 0.3 : 1}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                        color: theme === 'dark' ? 'white' : 'inherit',
                      }}
                    />
                    <Bar
                      dataKey="tickets"
                      fill="#6366F1"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500">
                View All
              </button>
            </div>
            <div className="space-y-4">
              <ActivityItem
                type="ticket"
                message="5 new tickets sold for Tech Conference"
                time="2 hours ago"
              />
              <ActivityItem
                type="refund"
                message="1 refund processed for Music Festival"
                time="5 hours ago"
              />
              <ActivityItem
                type="event"
                message="New event 'Art Exhibition' created"
                time="1 day ago"
              />
              <ActivityItem
                type="ticket"
                message="Early bird tickets almost sold out for Workshop"
                time="2 days ago"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
              <Link
                href="/organizer/events/new"
                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500"
              >
                <FiPlus className="mr-1" size={14} />
                New
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              <Link
                href="/organizer/events"
                className="flex items-center justify-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 p-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
              >
                View all events
                <FiArrowUpRight className="ml-1" size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={<FiPlusCircle size={20} />}
                label="Create Ticket"
                color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                onClick={() => router.push('/organizer/tickets/new')}
              />
              <QuickAction
                icon={<FiCalendar size={20} />}
                label="New Event"
                color="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
                onClick={() => router.push('/organizer/events/new')}
              />
              <QuickAction
                icon={<PiMegaphoneLight size={20} />}
                label="Promote"
                color="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                onClick={() => setShowPromotionModal(true)}
              />
              <QuickAction
                icon={<FiBarChart2 size={20} />}
                label="View Reports"
                color="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                onClick={() => router.push('/organizer/analytics')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Stat Card
function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div
        className={`mt-3 text-xs sm:text-sm ${
          isPositive
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}
      >
        {change} {isPositive ? '↑' : '↓'} vs last period
      </div>
    </div>
  );
}

// Component: Activity Item
function ActivityItem({ type, message, time }: ActivityItemProps) {
  const icons: Record<string, string> = {
    ticket: '🎟️',
    refund: '↩️',
    event: '📅',
  };

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-3 mt-0.5 text-lg">{icons[type]}</div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

// Component: Quick Action
function QuickAction({ icon, label, color, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} hover:opacity-90 transition-all duration-200 transform hover:scale-[1.03]`}
    >
      <span className="text-xl mb-1.5">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
