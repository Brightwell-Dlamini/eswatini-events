import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { debounce } from 'lodash';

import { EventCard } from './EventCard';
import { HeroEvents } from '@/lib/mockData';
import { Event } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const SearchSuggestionItem = ({ event }: { event: Event }) => {
  return (
    <a
      href={`/events/${event.id}`}
      className="block hover:no-underline"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Event: ${event.name}`}
    >
      <div className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
        <div className="w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden">
          <Image
            src={event.image || '/placeholder-event.jpg'}
            alt={event.name}
            fill
            className="object-cover"
            sizes="64px"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate text-white">
            {event.name}
          </h4>
          <div className="flex items-center text-xs text-gray-300 mt-1">
            <CalendarIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-300 mt-1">
            <MapPinIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export const EventsCarousel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Event[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselIntervalRef = useRef<NodeJS.Timeout>();
  const desktopGridRef = useRef<HTMLDivElement>(null);

  const hasMoreResults = suggestions.length > 5;
  const totalSlides = Math.ceil(HeroEvents.length / 4);
  const visibleEvents = useMemo(
    () => HeroEvents.slice(activeIndex * 4, (activeIndex + 1) * 4),
    [activeIndex]
  );

  // Debounced search function
  const handleSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (!query.trim()) {
          setSuggestions([]);
          setIsLoading(false);
          return;
        }

        const filtered = HeroEvents.filter(
          (event) =>
            event.name.toLowerCase().includes(query.toLowerCase()) ||
            event.location.toLowerCase().includes(query.toLowerCase()) ||
            event.category.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
      }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      handleSearch(searchQuery);
    } else {
      setSuggestions([]);
    }

    return () => {
      handleSearch.cancel();
    };
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-rotate carousel for desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 640) {
      // sm breakpoint
      carouselIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
      }, 5000);
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [totalSlides]);

  // Handle keyboard navigation for search suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Pause auto-rotation on hover
  const handleCarouselHover = (pause: boolean) => {
    if (carouselIntervalRef.current) {
      if (pause) {
        clearInterval(carouselIntervalRef.current);
      } else {
        carouselIntervalRef.current = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % totalSlides);
        }, 5000);
      }
    }
  };

  return (
    <div className="relative w-full max-w-[90vw] mx-auto flex-grow-0 z-10">
      {/* Mobile search input - positioned above the title */}
      <div className="sm:hidden mb-4 w-[80vw] mx-auto" ref={searchRef}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Who or what do you wanna see live?"
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-12 pr-6 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              aria-label="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              aria-haspopup="listbox"
              aria-controls="mobile-search-suggestions"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-white/80"
                aria-hidden="true"
              />
            </div>
          </div>

          {showSuggestions && (
            <motion.div
              id="mobile-search-suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-[60] mt-2 w-full bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/10"
            >
              <div className="py-2 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-300">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <span className="ml-2">Searching...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    {suggestions.slice(0, 5).map((event) => (
                      <SearchSuggestionItem key={event.id} event={event} />
                    ))}
                    {hasMoreResults && (
                      <a
                        href={`/events/search?q=${encodeURIComponent(searchQuery)}`}
                        className="block px-4 py-3 text-sm font-medium text-center text-purple-400 hover:text-purple-300 hover:bg-white/5 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="See all results"
                      >
                        See all {suggestions.length} results →
                      </a>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-300">
                    <div className="flex flex-col items-center">
                      <MagnifyingGlassIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p>No events found for &quot;{searchQuery}&quot;</p>
                      <p className="text-xs mt-1">Try different keywords</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="justify-between flex items-center mb-2">
        <h2 className="font-bold justify-start text-amber-100 text-lg sm:text-xl md:text-2xl">
          Trending Events
        </h2>

        {/* Desktop search input - positioned next to the title */}
        <div
          className="hidden sm:flex flex-1 max-w-md mx-4 relative z-50"
          ref={searchRef}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Who or what do you wanna see live?"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-12 pr-6 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                aria-label="Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-controls="desktop-search-suggestions"
              />

              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-white/80"
                  aria-hidden="true"
                />
              </div>
            </div>

            {showSuggestions && (
              <motion.div
                id="desktop-search-suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-[60] mt-2 w-full bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/10"
              >
                <div className="py-2 max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-300">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                      <span className="ml-2">Searching...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.slice(0, 5).map((event) => (
                        <SearchSuggestionItem key={event.id} event={event} />
                      ))}
                      {hasMoreResults && (
                        <a
                          href={`/events/search?q=${encodeURIComponent(searchQuery)}`}
                          className="block px-4 py-3 text-sm font-medium text-center text-purple-400 hover:text-purple-300 hover:bg-white/5 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="See all results"
                        >
                          See all {suggestions.length} results →
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-300">
                      <div className="flex flex-col items-center">
                        <MagnifyingGlassIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <p>No events found for &quot;{searchQuery}&quot;</p>
                        <p className="text-xs mt-1">Try different keywords</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Hide navigation buttons on mobile */}
        <div className="hidden sm:flex justify-end items-center px-4">
          <div className="flex items-center gap-4">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-1 focus:outline-none"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  setActiveIndex(i);
                  if (carouselIntervalRef.current) {
                    clearInterval(carouselIntervalRef.current);
                    carouselIntervalRef.current = setInterval(() => {
                      setActiveIndex((prev) => (prev + 1) % totalSlides);
                    }, 5000);
                  }
                }}
              >
                <motion.span
                  className={`block rounded-full transition-all ${activeIndex === i ? 'bg-white/80' : 'bg-white/30 hover:bg-white/50'}`}
                  initial={false}
                  animate={{
                    width: 12,
                    height: 12,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile layout - horizontal scroll with 3 columns */}
      <div className="sm:hidden">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {HeroEvents.map((event: Event, i) => {
            // Only render a new container every 3 events
            if (i % 3 === 0) {
              return (
                <div
                  key={`group-${i}`}
                  className="flex-none w-72 mr-4"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="space-y-4">
                    <EventCard event={event} />
                    {i + 1 < HeroEvents.length && (
                      <EventCard event={HeroEvents[i + 1]} />
                    )}
                    {i + 2 < HeroEvents.length && (
                      <EventCard event={HeroEvents[i + 2]} />
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Desktop layout - grid carousel with auto-rotation */}
      <div
        className="hidden sm:block"
        onMouseEnter={() => handleCarouselHover(true)}
        onMouseLeave={() => handleCarouselHover(false)}
        ref={desktopGridRef}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 px-4"
          aria-live="polite"
          aria-atomic="true"
          key={`carousel-${activeIndex}`} // Force re-render on index change for animation
        >
          {visibleEvents.map((event: Event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
