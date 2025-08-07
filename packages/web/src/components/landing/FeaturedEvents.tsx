'use client';

import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';

import { useRef, useState } from 'react';

import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  BoltIcon as LightningBoltIcon,
} from '@heroicons/react/24/outline';

import {
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import Image from 'next/image';

const events = [
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
    id: 7,

    title: 'Marula Festival',

    description:
      'Celebration of the marula fruit harvest with traditional music and dance',

    date: 'February 2025',

    location: 'Hlane Royal National Park',

    image: '/images/bushfire.jpg',

    price: 0,

    category: 'Cultural',

    isFree: true,

    isPopular: true,

    rating: 4.7,

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

  {
    id: 6,

    title: 'Eswatini International Trade Fair',

    description:
      'Largest trade exhibition showcasing local and international businesses',

    date: 'August 30 - September 9, 2025',

    location: 'Mavuso Trade Centre',

    image: '/images/bushfire.jpg',

    price: 10,

    category: 'Business',

    isPopular: true,

    rating: 4.3,

    ticketsLeft: 145,

    totalTickets: 5000,

    ticketsSold: 4855,
  },

  {
    id: 3,

    title: 'Swazi Rally',

    description:
      "Annual motorsport event featuring rally racing through Eswatini's landscapes",

    date: 'July 12-13, 2025',

    location: 'Various Locations',

    image: '/images/bushfire.jpg',

    price: 15,

    earlyBirdPrice: 10,

    earlyBirdCutoff: '2025-05-01',

    category: 'Sports',

    isTrending: false,

    rating: 4.6,

    ticketsLeft: 87,

    totalTickets: 1000,

    ticketsSold: 913,
  },

  {
    id: 1,

    title: 'Mbabane Jazz Festival',

    description:
      'Celebration of jazz music featuring local and international artists',

    date: 'October 18-20, 2025',

    location: 'Mbabane Theatre Club',

    image: '/images/bushfire.jpg',

    price: 30,

    earlyBirdPrice: 20,

    earlyBirdCutoff: '2025-08-01',

    category: 'Music',

    isPopular: true,

    rating: 4.5,

    ticketsLeft: 42,

    totalTickets: 500,

    ticketsSold: 458,
  },

  {
    id: 9,

    title: 'Hlane Moonlight Festival',

    description:
      'Nighttime wildlife viewing and cultural performances in Hlane National Park',

    date: 'June 14, 2025',

    location: 'Hlane Royal National Park',

    image: '/images/bushfire.jpg',

    price: 35,

    earlyBirdPrice: 25,

    earlyBirdCutoff: '2025-04-15',

    category: 'Nature',

    isTrending: true,

    rating: 4.7,

    ticketsLeft: 23,

    totalTickets: 200,

    ticketsSold: 177,
  },

  {
    id: 10,

    title: 'Mantenga Cultural Village Experience',

    description:
      'Daily showcase of Swazi culture, dance, and traditional lifestyle',

    date: 'Daily',

    location: 'Mantenga Falls',

    image: '/images/bushfire.jpg',

    price: 15,

    category: 'Cultural',

    isPopular: true,

    rating: 4.8,

    ticketsLeft: 0,

    totalTickets: 0,

    ticketsSold: 0,
  },

  {
    id: 11,

    title: 'Swazi Fashion Week',

    description:
      "Showcasing the best of Eswatini's fashion designers and models",

    date: 'November 7-9, 2025',

    location: 'Ezulwini Valley',

    image: '/images/bushfire.jpg',

    price: 40,

    earlyBirdPrice: 30,

    earlyBirdCutoff: '2025-09-01',

    category: 'Fashion',

    isTrending: false,

    rating: 4.4,

    ticketsLeft: 56,

    totalTickets: 300,

    ticketsSold: 244,
  },

  {
    id: 12,

    title: 'Ngwane Film Festival',

    description: 'Annual celebration of African cinema and storytelling',

    date: 'September 25-29, 2025',

    location: 'Manzini',

    image: '/images/bushfire.jpg',

    price: 20,

    earlyBirdPrice: 15,

    earlyBirdCutoff: '2025-07-01',

    category: 'Film',

    isTrending: true,

    rating: 4.6,

    ticketsLeft: 34,

    totalTickets: 500,

    ticketsSold: 466,
  },
];

const bubbles = [
  { id: 1, size: 120, left: '10%', top: '20%', delay: 0.5 },

  { id: 2, size: 80, left: '30%', top: '40%', delay: 1 },

  { id: 3, size: 150, left: '70%', top: '30%', delay: 1.5 },

  { id: 4, size: 100, left: '85%', top: '60%', delay: 2 },
];

const FeaturedEvents = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [likedEvents, setLikedEvents] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const eventsPerPage = 4;

  const controls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: ref,

    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  const indexOfLastEvent = currentPage * eventsPerPage;

  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  const isEarlyBirdAvailable = (event: (typeof events)[0]) => {
    return (
      event.earlyBirdCutoff && new Date() < new Date(event.earlyBirdCutoff)
    );
  };

  const getTicketPercentage = (event: (typeof events)[0]) => {
    return event.totalTickets > 0
      ? (event.ticketsSold / event.totalTickets) * 100
      : 0;
  };

  const toggleLike = (id: number) => {
    setLikedEvents((prev) =>
      prev.includes(id)
        ? prev.filter((eventId) => eventId !== id)
        : [...prev, id]
    );

    controls.start({
      scale: [1, 1.2, 1],

      transition: { duration: 0.3 },
    });
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,

        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={ref}
      className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[url('/images/background-pattern.png')] opacity-5 dark:opacity-10" />

        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            animate={{
              y: [0, -100],

              opacity: [0.5, 0],

              transition: {
                duration: 15,

                repeat: Infinity,

                repeatType: 'reverse',

                delay: bubble.delay,
              },
            }}
            className="absolute rounded-full bg-purple-500/10 dark:bg-pink-500/10"
            style={{
              width: `${bubble.size}px`,

              height: `${bubble.size}px`,

              left: bubble.left,

              top: bubble.top,
            }}
          />
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-sm font-medium">
              <FireIcon className="h-4 w-4 mr-2 text-purple-500" />
              TRENDING EVENTS
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Cultural
            </span>{' '}
            Experiences & Entertainment
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover the vibrant heartbeat of Eswatini through these
            unforgettable events
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentEvents.map((event, index) => {
            const earlyBirdAvailable = isEarlyBirdAvailable(event);

            const ticketPercentage = getTicketPercentage(event);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,

                  delay: index * 0.1,

                  type: 'spring',

                  damping: 10,
                }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{
                  y: -5,

                  boxShadow:
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 4}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-3 right-3 flex flex-col space-y-1">
                    {event.isTrending && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold">
                        <FireIcon className="h-3 w-3 mr-1" />
                        TRENDING
                      </span>
                    )}

                    {event.isPopular && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold">
                        <StarIcon className="h-3 w-3 mr-1" />
                        POPULAR
                      </span>
                    )}

                    {earlyBirdAvailable && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">
                        <LightningBoltIcon className="h-3 w-3 mr-1" />
                        EARLY BIRD
                      </span>
                    )}

                    {event.isFree && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold">
                        FREE ENTRY
                      </span>
                    )}
                  </div>

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    {event.category}
                  </span>

                  <motion.button
                    onClick={() => toggleLike(event.id)}
                    className="absolute bottom-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    aria-label="Save event"
                    animate={controls}
                  >
                    {likedEvents.includes(event.id) ? (
                      <FaHeart className="h-4 w-4 text-pink-500" />
                    ) : (
                      <FaRegHeart className="h-4 w-4 text-white" />
                    )}
                  </motion.button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                      {event.title}
                    </h3>

                    <button className="p-1 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                      <FaShareAlt className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />

                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />

                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className="flex items-center text-amber-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(event.rating) ? 'fill-current' : ''
                            }`}
                          />
                        ))}
                      </div>

                      <span className="text-gray-500 dark:text-gray-400">
                        {event.rating}
                      </span>
                    </div>
                  </div>

                  {!event.isFree && event.totalTickets > 0 && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                          style={{ width: `${ticketPercentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{event.ticketsSold} sold</span>

                        {event.ticketsLeft > 0 && (
                          <span>{event.ticketsLeft} left</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      {event.isFree ? (
                        <span className="text-lg font-bold text-green-500">
                          FREE ENTRY
                        </span>
                      ) : earlyBirdAvailable ? (
                        <>
                          <span className="text-sm font-bold text-green-500 line-through mr-1">
                            ${event.price}
                          </span>

                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            ${event.earlyBirdPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          ${event.price}
                        </span>
                      )}

                      {!event.isFree &&
                        event.ticketsLeft < 20 &&
                        event.ticketsLeft > 0 && (
                          <span className="block text-xs text-red-500 dark:text-red-400">
                            Only {event.ticketsLeft} left!
                          </span>
                        )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center text-sm px-3 py-1.5 rounded-lg transition-all duration-200 ${
                        event.isFree
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                      }`}
                    >
                      <span>{event.isFree ? 'Attend' : 'Get Tickets'}</span>

                      <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentPage === number
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
