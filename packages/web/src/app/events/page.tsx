'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  CalendarIcon,
  MapPinIcon,
  MagnifyingGlassIcon as SearchIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { api } from '@/lib/api';
import { ApiEvent } from '@/lib/types';
import { EVENT_TYPES } from '@/lib/constants';

export default function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = events.filter((event) => {
    const matchesType =
      activeFilter === 'all' || event.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      event.name.toLowerCase().includes(q) ||
      (event.city ?? '').toLowerCase().includes(q) ||
      (event.address ?? '').toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const minPrice = (event: ApiEvent) => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) return null;
    return Math.min(...event.ticketTypes.map((t) => t.currentPrice ?? t.price));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Discover <span className="text-yellow-300">Eswatini&apos;s</span> Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xl text-white/90 max-w-3xl mx-auto mb-10"
          >
            From cultural festivals to concerts — find your next experience
          </motion.p>

          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
            <input
              type="text"
              placeholder="Search events or locations…"
              className="w-full pl-10 pr-4 py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            label="All"
          />
          {EVENT_TYPES.slice(0, 8).map((t) => (
            <FilterChip
              key={t.value}
              active={activeFilter === t.value}
              onClick={() => setActiveFilter(t.value)}
              label={t.label}
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-600">
            {error}
            <p className="text-sm text-gray-500 mt-2">
              Ensure the backend is running at the configured API URL.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((event) => {
            const price = minPrice(event);
            return (
              <motion.div
                key={event.id}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div className="relative h-48">
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute top-3 left-3 bg-white/90 text-xs font-bold px-2 py-1 rounded-full text-purple-700">
                    {event.type}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg truncate">{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                    {new Date(event.startTime).toLocaleDateString('en-SZ', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  {(event.city || event.address) && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1.5" />
                      {event.city || event.address}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-semibold text-blue-600">
                      {price != null ? `From E${price.toFixed(0)}` : 'Free'}
                    </span>
                    <span className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-full">
                      Get Tickets
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );
}
