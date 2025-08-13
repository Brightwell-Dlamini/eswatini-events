'use client';

import { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  TargetAndTransition,
} from 'framer-motion';
import Image from 'next/image';
import {
  CalendarIcon,
  MapPinIcon,
  FunnelIcon as FilterIcon,
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon as XIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Categories_events from '@/components/landing/Categories_events';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  image: string;
  ticketsLeft: number | null;
  category: string;
  price?: string;
  isFree?: boolean;
}

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const router = useRouter();

  // Sample events data - replace with your actual data source
  const events: Event[] = [
    {
      id: 1,
      name: 'MTN Bushfire Festival',
      date: '2025-05-25',
      location: 'Malkerns Valley',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      ticketsLeft: 12,
      category: 'festivals',
      price: 'SZL 850',
      isFree: false,
    },
    {
      id: 2,
      name: 'Eswatini Arts Fair',
      date: '2025-06-15',
      location: 'Mbabane',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      ticketsLeft: null,
      category: 'arts-theater',
      isFree: true,
    },
    {
      id: 3,
      name: 'Luju Food & Wine Festival',
      date: '2025-07-20',
      location: 'Lobamba',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
      ticketsLeft: 45,
      category: 'food-drink',
      price: 'SZL 350',
      isFree: false,
    },
    {
      id: 4,
      name: 'Sidvokodvo Music Night',
      date: '2025-08-05',
      location: 'Sidvokodvo',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
      ticketsLeft: 3,
      category: 'concerts',
      price: 'SZL 150',
      isFree: false,
    },
    {
      id: 5,
      name: 'Community Cultural Day',
      date: '2025-09-12',
      location: 'Nhlangano',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
      ticketsLeft: null,
      category: 'cultural',
      isFree: true,
    },
    {
      id: 6,
      name: 'Tech Conference Eswatini',
      date: '2025-10-08',
      location: 'Ezulwini',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
      ticketsLeft: 28,
      category: 'business',
      price: 'SZL 1200',
      isFree: false,
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      activeFilter === 'all' || event.category === activeFilter;
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'festival', name: 'Festivals' },
    { id: 'music', name: 'Music' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'food', name: 'Food & Drink' },
    { id: 'business', name: 'Business' },
  ];

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-900 dark:to-blue-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Discover <span className="text-yellow-300">Eswatini&apos;s</span>{' '}
            Vibrant Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10"
          >
            From cultural festivals to tech conferences - find your next
            unforgettable experience
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events or locations..."
              className="block w-full pl-10 pr-12 py-4 border border-transparent rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FilterIcon className="h-5 w-5 text-gray-300 hover:text-yellow-300 transition-colors" />
            </button>
          </motion.div>
        </div>
      </div>
      {/* Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-b-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Filter Events
                </h3>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Event Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveFilter(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          activeFilter === category.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Price Range
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      Free Only
                    </button>
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      Under SZL 200
                    </button>
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      SZL 200 - 500
                    </button>
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      Premium (SZL 500+)
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Date Range
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      This Weekend
                    </button>
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      Next 7 Days
                    </button>
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      This Month
                    </button>
                    <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      Custom Range
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters (Horizontal Scroll) */}
        <Categories_events
          selectedCategoryId={activeFilter}
          onCategoryChange={(categoryId) => setActiveFilter(categoryId)}
        />

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <SearchIcon className="w-full h-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No events found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      <Footer />;
    </div>
  );
};

// Enhanced EventCard component
const EventCard = ({
  event,
  onClick,
}: {
  event: Event;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // For parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  // Multiple images for gallery effect
  const eventImages = [
    event.image,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
  ];

  const handle3DHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const reset3DEffect = () => {
    animate(x, 0, { duration: 0.5 });
    animate(y, 0, { duration: 0.5 });
  };

  // Auto-scroll images if hovered
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && eventImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % eventImages.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, eventImages.length]);

  return (
    <div>
      <motion.div
        ref={cardRef}
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
        onMouseMove={handle3DHover}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          reset3DEffect();
        }}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Dynamic background with multiple images */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={eventImages[currentImageIndex]}
                alt={event.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Enhanced gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Free Event Badge */}
        {event.isFree && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 z-20"
          >
            <div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full shadow-md">
              <span className="text-xs font-bold text-white">FREE ENTRY</span>
            </div>
          </motion.div>
        )}

        {/* Floating action buttons */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full"
          >
            {isLiked ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Event urgency indicator */}
        {event.ticketsLeft !== null && event.ticketsLeft < 20 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 z-20"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-red-500 rounded-full blur-md"
              />
              <div className="relative flex items-center justify-center px-3 py-1 bg-red-600 rounded-full">
                <span className="text-xs font-bold text-white">
                  SELLING FAST
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          {/* Category chip */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-3 relative"
          >
            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
              <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {event.category.toUpperCase()}
              </span>
            </div>
          </motion.div>

          {/* Event title with hover effect */}
          <motion.h3
            className="text-2xl font-bold text-white mb-2"
            initial={{ y: 0 }}
            whileHover={{ y: -5 }}
          >
            {event.name.split(' ').map((word: string, i: number) => (
              <motion.span
                key={i}
                className="inline-block"
                whileHover={
                  {
                    scale: 1.1,
                    backgroundImage: 'linear-gradient(45deg, #f43f5e, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  } as TargetAndTransition
                }
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.h3>

          {/* Date and location */}
          <div className="mb-4">
            <div className="flex items-center text-sm text-white/90 mb-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <motion.span className="relative" whileHover={{ scale: 1.02 }}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-px bg-white"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </div>
            <div className="flex items-center text-sm text-white/90">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <motion.span className="relative" whileHover={{ scale: 1.02 }}>
                {event.location}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-px bg-white"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <motion.div
              className="text-xl font-bold text-white"
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            >
              {event.isFree ? (
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                  FREE ENTRY
                </span>
              ) : (
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  {event.price}
                </span>
              )}
            </motion.div>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium text-sm ${
                event.ticketsLeft !== null && event.ticketsLeft <= 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white`}
            >
              {event.ticketsLeft !== null && event.ticketsLeft <= 0
                ? 'SOLD OUT'
                : 'GET TICKETS'}
            </motion.button>
          </div>
        </div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 0.3 : 0,
            background: `radial-gradient(circle at ${x.get() + 50}% ${y.get() + 50}%, rgba(99, 102, 241, 0.8), transparent 70%)`,
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
};

export default EventsPage;
