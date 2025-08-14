'use client';

import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
} from 'framer-motion';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ClockIcon } from 'lucide-react';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [mounted, setMounted] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Background images for the hero section
  const backgroundImages = [
    '/images/hero-bg-1.jpg',
    '/images/hero-bg-2.jpg',
    '/images/hero-bg-3.jpg',
  ];

  // Text variations
  const textVariations = [
    {
      title: 'Eswatini Comes Alive!',
      description:
        'Experience the heartbeat of Africas hidden gem with seamless ticketing for traditional dances, music festivals, and local sports events.',
    },
    {
      title: 'Made for EmaSwati, by EmaSwati',
      description:
        "We're built for Eswatini, not adapted from foreign systems. Our platform understands local needs, from payment preferences to event cultures.",
    },
    {
      title: 'Where Africa Celebrates',
      description:
        "Discover, book, and experience the best events in Eswatini. From cultural festivals to sports matches, we've got your ticket to unforgettable moments.",
    },

    {
      title: 'Innovative Event Solutions',
      description:
        'Cutting-edge technology meets local needs with NFC wristbands, USSD ticketing, and AI-powered recommendations tailored for Eswatini.',
    },
  ];
  type Event = {
    id: number;
    name: string;
    date: string;
    location: string;
    image: string;
    ticketsLeft: number | null;
    imagePriority: boolean;
    category: string;
    price?: string;
  };
  // Featured events data
  const events: Event[] = [
    {
      id: 1,
      name: 'MTN Bushfire Festival',
      date: '2025-07-30',
      location: 'Malkerns Valley',
      image:
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsLeft: 12,
      imagePriority: true,
      category: 'Music Festival',
      price: 'From E500',
    },
    {
      id: 2,
      name: 'Eswatini vs Nigeria',
      date: '2025-07-19',
      location: 'Somhlolo Stadium',
      image:
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1605&q=80',
      ticketsLeft: 43,
      imagePriority: false,
      category: 'Sports',
      price: 'From E250',
    },
    {
      id: 3,
      name: 'Art Exhibition Opening',
      date: '2025-07-20',
      location: 'Mbabane Art Gallery',
      image:
        'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1804&q=80',
      ticketsLeft: null,
      imagePriority: false,
      category: 'Art',
      price: 'Free',
    },
    {
      id: 4,
      name: 'Tech Conference',
      date: '2025-03-22',
      location: 'Royal Swazi Convention Center',
      image:
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsLeft: 8,
      imagePriority: false,
      category: 'Conference',
      price: 'E1,200',
    },
    {
      id: 5,
      name: 'Jazz Night',
      date: '2025-03-25',
      location: 'House on Fire',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsLeft: 15,
      imagePriority: false,
      category: 'Music',
      price: 'E300',
    },
    {
      id: 6,
      name: 'Food Festival',
      date: '2025-04-05',
      location: 'Mantenga Cultural Village',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsLeft: null,
      imagePriority: false,
      category: 'Food',
      price: 'Free',
    },
    {
      id: 7,
      name: 'Community Yoga',
      date: '2025-03-20',
      location: 'Botanical Gardens',
      image:
        'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
      ticketsLeft: null,
      imagePriority: false,
      category: 'Wellness',
      price: 'Free',
    },
    {
      id: 8,
      name: 'Film Premiere',
      date: '2025-04-10',
      location: 'Swazi Cineplex',
      image:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      ticketsLeft: 56,
      imagePriority: false,
      category: 'Cinema',
      price: 'E150',
    },
  ];

  // Get visible events for carousel (4 at a time)
  const visibleEvents = events.slice(carouselIndex, carouselIndex + 4);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-SZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const calculateTimeLeft = (eventDate: string) => {
    const difference = new Date(eventDate).getTime() - new Date().getTime();
    if (difference <= 0) return 'Event passed';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

    return `${days}d ${hours}h left`;
  };

  // Set up intervals for text, background and carousel transitions
  useEffect(() => {
    setMounted(true);

    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textVariations.length);
    }, 16000); // Doubled from 8s to 16s for slower transitions

    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 20000); // Increased to match slower transitions

    const carouselInterval = setInterval(() => {
      setCarouselIndex(
        (prev) => (prev >= events.length - 4 ? 0 : prev + 2) // Move by 2 events at a time
      );
    }, 10000); // Carousel changes every 10 seconds

    return () => {
      clearInterval(textInterval);
      clearInterval(bgInterval);
      clearInterval(carouselInterval);
    };
  }, [backgroundImages.length, textVariations.length, events.length]);

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
    [1, scrollDirection === 'down' ? 0.3 : 1]
  );

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden h-[100vh]">
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

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 z-0 bg-black/20" />

      {/* Main content */}
      <motion.div
        className="relative z-10 pt-28 pb-4 px-4 sm:px-6 lg:px-8 h-full flex flex-col"
        style={{ y: yPos, opacity }}
      >
        <div className="max-w-7xl mx-auto flex flex-col">
          {/* TOP SECTION - Hero Text */}
          <div className="w-full text-center my-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="min-h-[100px] sm:min-h-[200px] text-center justify-center items-center"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    scale: 0.9,
                    transition: {
                      duration: 0.8,
                    },
                  }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {textVariations[currentTextIndex].title}
                    </span>
                  </h1>
                  <motion.p
                    className="mt-4 text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                  >
                    {textVariations[currentTextIndex].description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
              {/* SEPARATOR */}
              <div className="relative  z-100">
                <div className="absolute inset-x-0 mt-6 mb-4 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent dark:via-gray-600"></div>
              </div>
            </motion.div>
          </div>

          {/* BOTTOM SECTION - 4 Event Carousel */}
          <div className="relative w-full max-w-7xl mx-auto flex-grow-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4"
            >
              {visibleEvents.map((event, i) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 h-full"
                >
                  <div className="relative h-30">
                    <Image
                      src={event.image}
                      alt={`${event.name} promotional image`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={event.imagePriority}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 shadow-sm">
                      {event.category}
                    </div>

                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                        event.price === 'Free'
                          ? 'bg-green-500/90 text-white'
                          : 'bg-white/90 text-gray-800'
                      }`}
                    >
                      {event.price}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {event.name}
                        </h3>

                        <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1 text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1 text-sm">
                          {' '}
                          <MapPinIcon className="h-4 w-4 mr-1" />{' '}
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {event.ticketsLeft !== null ? (
                        <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                          Only {event.ticketsLeft} left
                        </span>
                      ) : (
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                          Free Entry
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 text-sm">
                      {' '}
                      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <ClockIcon className="h-4 w-4" />
                        <span className="font-medium">
                          {calculateTimeLeft(event.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Carousel Controls - Spaced Out */}
            <div className="flex justify-between items-center mt-12 px-4">
              <button
                onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 2))}
                disabled={carouselIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronLeftIcon className="h-5 w-5 text-white" />
              </button>

              <div className="flex items-center gap-4 mx-4">
                {Array.from({
                  length: Math.ceil(events.length / 4),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i * 4)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      carouselIndex === i * 4 ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCarouselIndex(
                    Math.min(events.length - 4, carouselIndex + 2)
                  )
                }
                disabled={carouselIndex >= events.length - 4}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronRightIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-2 sm:bottom-5 left-1/2 transform -translate-x-1/2 z-30"
        >
          <motion.div
            className="animate-bounce flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            aria-label="Scroll down indicator"
          >
            <div className="flex items-end h-6 sm:h-8 gap-2">
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
                  className={`w-1.5 rounded-full ${
                    i % 3 === 0
                      ? 'bg-blue-500'
                      : i % 3 === 1
                        ? 'bg-yellow-400'
                        : 'bg-red-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm sm:text-md font-bold mt-2 text-white">
              Feel the rhythm!
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
