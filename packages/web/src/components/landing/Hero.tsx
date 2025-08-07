'use client';

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  MusicalNoteIcon,
  TicketIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { FaFacebook, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa';
import Image from 'next/image';

// Type for synchronized hero content
type HeroSlide = {
  id: number;
  image: string;
  eventType: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  searchPlaceholder: string;
};

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Enhanced scroll effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Synchronized hero content
  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      image: '/images/hero-1.jpg',
      eventType: 'Music Festivals',
      titleLine1: 'MTN Bushfire',
      titleLine2: 'Festival 2025',
      description:
        "Experience Africa's premier music and arts festival with seamless ticketing",
      searchPlaceholder: 'Search music festivals...',
    },
    {
      id: 2,
      image: '/images/hero-2.jpg',
      eventType: 'Football Matches',
      titleLine1: 'Premier League',
      titleLine2: 'Football Games',
      description: 'Secure your seats for thrilling local football matches',
      searchPlaceholder: 'Find football matches...',
    },
    {
      id: 3,
      image: '/images/hero-3.jpg',
      eventType: 'Cultural Events',
      titleLine1: 'Standard Bank',
      titleLine2: 'Luju Festival',
      description:
        'Celebrate African culture through music, fashion and culinary arts',
      searchPlaceholder: 'Discover cultural events...',
    },
    {
      id: 4,
      image: '/images/hero-4.jpg',
      eventType: 'Motorsport',
      titleLine1: 'Eswatini',
      titleLine2: 'Riders Range',
      description:
        "Feel the adrenaline of Eswatini's premier motorsport events",
      searchPlaceholder: 'Find motorsport events...',
    },
  ];

  // Local payment methods
  const paymentMethods = [
    { icon: <DevicePhoneMobileIcon className="h-5 w-5" />, name: 'MTN MoMo' },
    { icon: <CurrencyDollarIcon className="h-5 w-5" />, name: 'Cash' },
    { icon: null, name: 'Visa/Mastercard' },
  ];

  useEffect(() => {
    setIsMounted(true);

    const slideInterval = setInterval(() => {
      if (!isHovering) {
        setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
      }
    }, 6000);

    return () => clearInterval(slideInterval);
  }, [isHovering, heroSlides.length]);

  if (!isMounted) {
    return (
      <section
        ref={ref}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-gray-900"
      />
    );
  }

  // Animation variants for smooth transitions
  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 1.5 } },
    exit: { opacity: 0, transition: { duration: 1.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic background with synchronized content */}
      <motion.div
        style={{ y: backgroundY, scale }}
        className="absolute inset-0 z-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[currentSlideIndex].id}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
            <Image
              src={heroSlides[currentSlideIndex].image}
              alt={`Eswatini ${heroSlides[currentSlideIndex].eventType}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Eswatini flag color overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-yellow-500/10 to-red-600/10 z-20" />
      </motion.div>

      {/* Content with synchronized text */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-30 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto text-center pt-15"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mb-8"
        >
          {/* Event type badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/20 mb-6"
            variants={textVariants}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-medium text-white flex items-center">
              <MusicalNoteIcon className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                {heroSlides[currentSlideIndex].eventType} in Eswatini
              </span>
            </p>
          </motion.div>

          {/* Main title */}
          <motion.h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-bold mb-6 text-white">
            <motion.span
              className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent"
              variants={textVariants}
              transition={{ delay: 0.4 }}
            >
              {heroSlides[currentSlideIndex].titleLine1}
            </motion.span>{' '}
            <br />
            <motion.span variants={textVariants} transition={{ delay: 0.6 }}>
              {heroSlides[currentSlideIndex].titleLine2}
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={textVariants}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200"
          >
            {heroSlides[currentSlideIndex].description}
          </motion.p>
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1, type: 'spring' }}
          whileHover={{ y: -5 }}
          className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto backdrop-blur-lg border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700/80 dark:text-white transition-all duration-200"
                placeholder={heroSlides[currentSlideIndex].searchPlaceholder}
                type="search"
              />
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700/80 dark:text-white appearance-none bg-transparent">
                <option>All Regions</option>
                <option>Hhohho</option>
                <option>Manzini</option>
                <option>Lubombo</option>
                <option>Shiselweni</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/30 flex items-center gap-2"
            >
              <TicketIcon className="h-5 w-5" />
              Find Events
            </motion.button>
          </div>

          {/* Payment methods */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4 flex justify-center gap-4"
          >
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className="flex items-center bg-black/20 px-3 py-1 rounded-full"
              >
                {method.icon && (
                  <span className="mr-2 text-yellow-400">{method.icon}</span>
                )}
                <span className="text-sm text-white">{method.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Social media links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-5 flex justify-center gap-16"
        >
          <motion.a
            whileHover={{ y: -3 }}
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-blue-600/30 transition-colors"
          >
            <FaTwitter className="text-white text-xl" />
          </motion.a>
          <motion.a
            whileHover={{ y: -3 }}
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-blue-600/30 transition-colors"
          >
            <FaFacebook className="text-white text-xl" />
          </motion.a>
          <motion.a
            whileHover={{ y: -3 }}
            href="https://wa.me/your-number"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-green-500/30 transition-colors"
          >
            <FaWhatsapp className="text-white text-xl" />
          </motion.a>
          <motion.a
            whileHover={{ y: -3 }}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-pink-600/30 transition-colors"
          >
            <FaInstagram className="text-white text-xl" />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          className="animate-bounce flex flex-col items-center"
          whileHover={{ scale: 1.1 }}
        >
          <p className="text-gray-300 text-sm mb-2">Feel the rhythm!</p>
          <div className="flex items-end h-8 gap-1">
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
        </motion.div>
      </motion.div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlideIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlideIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
