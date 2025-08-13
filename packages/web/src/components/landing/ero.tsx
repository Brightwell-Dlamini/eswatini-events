'use client';

import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
} from 'framer-motion';
import { TicketIcon } from '@heroicons/react/24/solid';
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [likedEvents, setLikedEvents] = useState<number[]>([]);

  // Background images for the hero section
  const backgroundImages = [
    '/images/hero-bg-1.jpg', // Cultural event image
    '/images/hero-bg-2.jpg', // Music festival image
    '/images/hero-bg-3.jpg', // Sports event image
  ];

  // Text variations
  const textVariations = [
    {
      title: 'Where Africa Celebrates',
      description:
        "Discover, book, and experience the best events in Eswatini. From cultural festivals to sports matches, we've got your ticket to unforgettable moments.",
    },
    {
      title: "Your Gateway to Eswatini's Culture",
      description:
        'Experience the heartbeat of the nation with seamless ticketing for traditional dances, music festivals, and local sports events.',
    },
    {
      title: 'Innovative Event Solutions',
      description:
        'Cutting-edge technology meets local needs with NFC wristbands, USSD ticketing, and AI-powered recommendations tailored for Eswatini.',
    },
  ];

  // Featured events data from FeaturedEvents.tsx (2 free and 2 ticketed)
  const featuredEvents = [
    {
      id: 8,
      title: 'Incwala Ceremony',
      description:
        'The most sacred national ritual, a kingship ceremony dating back centuries',
      date: 'December 2024',
      location: 'Lobamba',
      image: '/images/bushfire.jpg',
      price: 0,
      category: 'Cultural',
      isFree: true,
      isTrending: true,
      rating: 4.9,
      ticketsLeft: 0,
      totalTickets: 0,
      ticketsSold: 0,
    },
    {
      id: 2,
      title: 'Umhlanga Reed Dance',
      description:
        'Annual ceremony where young women cut reeds and present them to the Queen Mother',
      date: 'August 2024',
      location: 'Ludzidzini Royal Village',
      image: '/images/bushfire.jpg',
      price: 0,
      category: 'Cultural',
      isFree: true,
      isTrending: true,
      rating: 4.8,
      ticketsLeft: 0,
      totalTickets: 0,
      ticketsSold: 0,
    },
    {
      id: 4,
      title: 'MTN Bushfire Festival',
      description:
        "Africa's most internationally celebrated festival of music and arts",
      date: 'May 24-26, 2025',
      location: 'Malkerns Valley',
      image: '/images/bushfire.jpg',
      price: 50,
      earlyBirdPrice: 35,
      earlyBirdCutoff: '2025-03-01',
      category: 'Music Festival',
      isTrending: true,
      rating: 4.8,
      ticketsLeft: 12,
      totalTickets: 5000,
      ticketsSold: 4870,
    },
    {
      id: 5,
      title: 'Sibebe Survivor Challenge',
      description:
        "Hike up Africa's largest granite dome with live music at the summit",
      date: 'September 7, 2025',
      location: 'Sibebe Rock',
      image: '/images/bushfire.jpg',
      price: 25,
      earlyBirdPrice: 15,
      earlyBirdCutoff: '2025-06-01',
      category: 'Adventure',
      isTrending: true,
      rating: 4.9,
      ticketsLeft: 8,
      totalTickets: 300,
      ticketsSold: 292,
    },
  ];

  const toggleLike = (id: number) => {
    setLikedEvents((prev) =>
      prev.includes(id)
        ? prev.filter((eventId) => eventId !== id)
        : [...prev, id]
    );
  };

  const getTicketPercentage = (event: (typeof featuredEvents)[0]) => {
    return event.totalTickets > 0
      ? (event.ticketsSold / event.totalTickets) * 100
      : 0;
  };

  const isEarlyBirdAvailable = (event: (typeof featuredEvents)[0]) => {
    return (
      event.earlyBirdCutoff && new Date() < new Date(event.earlyBirdCutoff)
    );
  };

  // Set up intervals for text, event and background transitions
  useEffect(() => {
    setMounted(true);

    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textVariations.length);
    }, 5000);

    const eventInterval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 7000);

    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);

    return () => {
      clearInterval(textInterval);
      clearInterval(eventInterval);
      clearInterval(bgInterval);
    };
  }, [featuredEvents.length, textVariations.length, backgroundImages.length]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  const yPos = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(
    scrollY,
    [0, 200],
    [1, scrollDirection === 'down' ? 0.3 : 1] // Only fade when scrolling down
  );
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  if (!mounted) return null;

  const currentEvent = featuredEvents[currentEventIndex];
  const ticketPercentage = getTicketPercentage(currentEvent);
  const earlyBirdAvailable = isEarlyBirdAvailable(currentEvent);

  return (
    <section className="relative overflow-hidden h-screen min-h-[97vh]">
      {/* Background images carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {backgroundImages.map(
            (image, index) =>
              currentBgIndex === index && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-black/20" />

      {/* Floating particles - reduced count on mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(window.innerWidth < 640 ? 10 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background:
                theme === 'dark'
                  ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(168, 85, 247, 0.4))'
                  : 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))',
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 pt-24 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 h-full"
        style={{ y: yPos, opacity, scale }}
      >
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 flex-1">
            {/* Left side - Text content */}

            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {textVariations[currentTextIndex].title}
                      </span>
                    </h1>
                    <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-gray-100 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                      {textVariations[currentTextIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/events"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                  aria-label="Browse events"
                >
                  <TicketIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Browse Events</span>
                </Link>
                <Link
                  href="/about"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border-2 border-white text-white dark:text-white dark:border-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
                  aria-label="Learn how it works"
                >
                  <span className="text-sm sm:text-base">How It Works</span>
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </motion.div>

              {/* Stats - hidden on smallest screens */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 max-w-md mx-auto lg:mx-0"
              >
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    50+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200 dark:text-gray-400">
                    Events Monthly
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                    5%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200 dark:text-gray-400">
                    Lowest Fees
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200 dark:text-gray-400">
                    Fraud-Free
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side - Featured event card */}

            <div className="hidden lg:block w-full lg:w-1/2 mt-6 md:mt-10 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-auto min-h-[350px] sm:h-[400px] md:h-[450px]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentEventIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {/* Responsive event card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 group h-full flex flex-col">
                      {/* Image section */}
                      <div className="relative h-60 sm:h-56 overflow-hidden">
                        <Image
                          src={currentEvent.image}
                          alt={currentEvent.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Category badge */}
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-purple-600 dark:text-purple-400 text-xs font-bold">
                          {currentEvent.category}
                        </span>

                        {/* Event badges */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {currentEvent.isTrending && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold">
                              <FireIcon className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">TRENDING</span>
                              <span className="sm:hidden">HOT</span>
                            </span>
                          )}
                          {earlyBirdAvailable && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">
                              <span className="hidden sm:inline">
                                EARLY BIRD
                              </span>
                              <span className="sm:hidden">SALE</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content section */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                            {currentEvent.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {currentEvent.description}
                          </p>
                        </div>

                        {/* Event details grid - responsive columns */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="flex items-center">
                            <div className="p-1 sm:p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 mr-2">
                              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Date
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                                {currentEvent.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="p-1 sm:p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 mr-2">
                              <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Location
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-1">
                                {currentEvent.location}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="p-1 sm:p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 mr-2">
                              <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Rating
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mr-1">
                                  {currentEvent.rating}
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < Math.floor(currentEvent.rating) ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="p-1 sm:p-1.5 rounded-lg bg-green-100 dark:bg-green-900/50 mr-2">
                              <TicketIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Availability
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                                {currentEvent.isFree
                                  ? 'Open'
                                  : `${currentEvent.ticketsLeft} left`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ticket progress bar */}
                        {!currentEvent.isFree &&
                          currentEvent.totalTickets > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                <span>
                                  Tickets sold: {currentEvent.ticketsSold}
                                </span>
                                {currentEvent.ticketsLeft > 0 && (
                                  <span>
                                    {currentEvent.ticketsLeft} remaining
                                  </span>
                                )}
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 sm:h-2 rounded-full"
                                  style={{ width: `${ticketPercentage}%` }}
                                />
                              </div>
                            </div>
                          )}

                        {/* Price and CTA section */}
                        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <div>
                              {currentEvent.isFree ? (
                                <div className="text-base sm:text-lg font-bold text-green-500">
                                  FREE ENTRY
                                </div>
                              ) : earlyBirdAvailable ? (
                                <div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Early Bird
                                  </div>
                                  <div className="flex items-baseline">
                                    <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 line-through mr-1">
                                      ${currentEvent.price}
                                    </span>
                                    <span className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                                      ${currentEvent.earlyBirdPrice}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Price
                                  </div>
                                  <span className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                                    ${currentEvent.price}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => toggleLike(currentEvent.id)}
                                className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                aria-label="Save event"
                              >
                                {likedEvents.includes(currentEvent.id) ? (
                                  <FaHeart className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                                ) : (
                                  <FaRegHeart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400" />
                                )}
                              </button>
                              <button className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <FaShareAlt className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400" />
                              </button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-200 ${
                                  currentEvent.isFree
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white'
                                }`}
                              >
                                <span className="text-xs sm:text-sm font-medium">
                                  {currentEvent.isFree
                                    ? 'Attend Event'
                                    : 'Get Tickets'}
                                </span>
                                <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Larger carousel controls for mobile */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {featuredEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentEventIndex(index)}
                      className={`w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                        currentEventIndex === index
                          ? 'bg-purple-600 scale-125'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to event ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-30"
        >
          <motion.div
            className="animate-bounce flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            aria-label="Scroll down indicator"
          >
            <div className="flex items-end h-6 sm:h-8 gap-1">
              {[2, 4, 6, 8, 6, 4, 2].map((height, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [`${height}px`, `${height + 4}px`, `${height}px`],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className={`w-1 rounded-full ${
                    i % 3 === 0
                      ? 'bg-blue-500'
                      : i % 3 === 1
                        ? 'bg-yellow-400'
                        : 'bg-red-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm sm:text-md font-bold mt-1 text-white">
              Feel the rhythm!
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
