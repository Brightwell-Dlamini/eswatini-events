// app/organizer/events/page.tsx
'use client';
import {
  FiCalendar,
  FiPlus,
  FiSearch,
  FiDownload,
  FiGrid,
  FiList,
  FiFilter,
  FiX,
} from 'react-icons/fi';
import { useState, useDeferredValue, useTransition } from 'react';
import Link from 'next/link';
import EventCard from '@/components/organizer/EventCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { EventStatus, mockEvents } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type FilterStatus = 'all' | EventStatus;
type SortOption = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredEvents = mockEvents
    .filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(deferredQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const handleExport = () => {
    // Mock export functionality
    const blob = new Blob([JSON.stringify(filteredEvents, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    startTransition(() => {
      setSearchQuery('');
      setStatusFilter('all');
      setSortOption('date-desc');
    });
  };

  const hasFilters =
    searchQuery || statusFilter !== 'all' || sortOption !== 'date-desc';

  return (
    <div className="container py-8 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative mb-10"
      >
        {/* Background accent */}
        <div className="absolute inset-x-0 -top-6 -bottom-6 -z-10 rounded-2xl bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10" />

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          {/* Title section with animated underline */}
          <div className="group relative max-w-2xl">
            <div className="flex flex-wrap items-end gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Event Dashboard
              </h1>
              <span className="mb-1.5 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                {filteredEvents.length}{' '}
                {filteredEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>
            <div className="absolute -bottom-2 h-0.5 w-0 bg-indigo-500 transition-all duration-500 group-hover:w-full" />
          </div>

          {/* Action buttons with floating effect */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="relative overflow-hidden gap-2 px-5 py-3 text-white shadow-2xl hover:shadow-indigo-500/30"
              >
                <Link href="/organizer/events/new">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-100 hover:from-indigo-700 hover:to-purple-700" />
                  <FiPlus className="relative z-10 h-5 w-5" />
                  <span className="relative z-10 font-semibold">New Event</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 transition-opacity hover:opacity-100" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={filteredEvents.length === 0}
                className="gap-2 px-5 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <FiDownload className="h-5 w-5" />
                <span className="font-semibold">Export</span>
                {filteredEvents.length === 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    !
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Filter status bar */}
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3"
          >
            <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
              <FiFilter className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium">Active Filters</span>
            </div>
            <Badge
              variant="outline"
              onClick={clearFilters}
              className="group cursor-pointer border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
            >
              <div className="flex items-center gap-1.5">
                <FiX className="h-3.5 w-3.5 text-indigo-600 transition-transform group-hover:rotate-90 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Clear All
                </span>
              </div>
            </Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input remains the same */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-10 py-2 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                startTransition(() => {
                  setSearchQuery(e.target.value);
                });
              }}
              aria-label="Search events"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 md:hidden"
            >
              <FiFilter size={16} />
              <span>Filters</span>
            </Button>

            <div className="hidden md:flex gap-3">
              {/* Status Filter Select */}
              <Select
                value={statusFilter}
                onValueChange={(value: FilterStatus) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Option Select */}
              <Select
                value={sortOption}
                onValueChange={(value: SortOption) => setSortOption(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest first</SelectItem>
                  <SelectItem value="date-asc">Oldest first</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 flex items-center gap-1 transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label="Grid view"
              >
                <FiGrid size={16} />
                <span className="sr-only md:not-sr-only">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center gap-1 transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label="List view"
              >
                <FiList size={16} />
                <span className="sr-only md:not-sr-only">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-3 pt-3">
                <Select
                  value={statusFilter}
                  onValueChange={(value: FilterStatus) =>
                    setStatusFilter(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortOption}
                  onValueChange={(value: SortOption) => setSortOption(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Events Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard event={event} variant="detailed" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard event={event} variant="compact" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )
      ) : (
        <EmptyEventsState
          searchQuery={deferredQuery}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
}

function EmptyEventsState({
  searchQuery,
  statusFilter,
}: {
  searchQuery: string;
  statusFilter: FilterStatus;
}) {
  const hasFilters = searchQuery || statusFilter !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50"
    >
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
        <FiCalendar className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
        {hasFilters ? 'No matching events found' : 'No events created yet'}
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        {hasFilters
          ? 'Try adjusting your search or filter criteria'
          : 'Get started by creating your first event'}
      </p>
      <motion.div
        className="mt-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          asChild
          className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          <Link href="/organizer/events/new">
            <FiPlus size={18} />
            Create New Event
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
