// components/TopArtistsSection.tsx
'use client';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ArtistCard } from './Artist/ArtistCard';
import { topArtists } from '@/lib/mockData';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useInView } from 'react-intersection-observer';

const CARD_COUNT = {
  base: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
};

const AUTO_PLAY_INTERVAL = 8000;
const TRANSITION_DURATION = 1000;

export const TopArtistsSection = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(CARD_COUNT.lg);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(CARD_COUNT.base);
      } else if (window.innerWidth < 768) {
        setVisibleCards(CARD_COUNT.sm);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(CARD_COUNT.md);
      } else if (window.innerWidth < 1280) {
        setVisibleCards(CARD_COUNT.lg);
      } else {
        setVisibleCards(CARD_COUNT.xl);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Infinite loop carousel with direction tracking
  const nextSlide = useCallback(() => {
    setDirection('right');
    setCarouselIndex((prev) => (prev + 1) % topArtists.length);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isAutoPlaying && !isFocused && !isTouched) {
      timeoutRef.current = setTimeout(nextSlide, AUTO_PLAY_INTERVAL);
    }
  }, [isAutoPlaying, isFocused, isTouched]);

  const prevSlide = useCallback(() => {
    setDirection('left');
    setCarouselIndex(
      (prev) => (prev - 1 + topArtists.length) % topArtists.length
    );
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isAutoPlaying && !isFocused && !isTouched) {
      timeoutRef.current = setTimeout(nextSlide, AUTO_PLAY_INTERVAL);
    }
  }, [isAutoPlaying, isFocused, isTouched, nextSlide]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > carouselIndex ? 'right' : 'left');
      setCarouselIndex(index);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (isAutoPlaying && !isFocused && !isTouched) {
        timeoutRef.current = setTimeout(nextSlide, AUTO_PLAY_INTERVAL);
      }
    },
    [carouselIndex, isAutoPlaying, isFocused, isTouched, nextSlide]
  );

  const resetAutoPlay = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isAutoPlaying && !isFocused && !isTouched) {
      timeoutRef.current = setTimeout(nextSlide, AUTO_PLAY_INTERVAL);
    }
  }, [isAutoPlaying, isFocused, isTouched, nextSlide]);

  // Auto-play carousel with pause on focus/hover/touch
  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetAutoPlay]);

  // Keyboard navigation with focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(topArtists.length - visibleCards);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inView, nextSlide, prevSlide, goToSlide, visibleCards]);

  // Get visible artists with featured artist logic
  const getVisibleArtists = () => {
    const artists = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (carouselIndex + i) % topArtists.length;
      const artist = topArtists[index];
      artists.push({
        ...artist,
        isFeatured: i === Math.floor(visibleCards / 2), // Center card is featured
      });
    }
    return artists;
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isFocused && nextSlide(),
    onSwipedRight: () => !isFocused && prevSlide(),
    onTouchStartOrOnMouseDown: () => setIsTouched(true),
    onTouchEndOrOnMouseUp: () => setIsTouched(false),
    trackMouse: true,
    delta: 30,
  });

  const totalGroups = Math.ceil(topArtists.length / visibleCards);
  const activeGroup = Math.floor(carouselIndex / visibleCards);

  // Animate when in view
  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
      });
    }
  }, [inView, controls]);

  return (
    <section
      ref={ref}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
      aria-label="Top Artists in Eswatini"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Popular Artists{' '}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover the most popular performers lighting up stages across the
            kingdom.
          </p>
        </motion.div>
        <div className="relative">
          <a href="#skip-carousel" className="sr-only focus:not-sr-only">
            Skip carousel navigation
          </a>

          <div
            className="relative"
            {...swipeHandlers}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onTouchStart={() => setIsTouched(true)}
            onTouchEnd={() => setIsTouched(false)}
            aria-live="polite"
            aria-atomic="true"
            aria-relevant="additions removals"
          >
            <div className="flex  items-center mb-8 justify-end gap-5">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
                aria-label="Previous artists"
              >
                <ChevronLeftIcon className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </motion.button>

              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {Array.from({ length: totalGroups }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i * visibleCards)}
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none  ${
                        activeGroup === i
                          ? 'bg-purple-600 w-5'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-3'
                      }`}
                      aria-label={`Go to group ${i + 1} of ${totalGroups}`}
                      aria-current={activeGroup === i}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all"
                aria-label="Next artists"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="relative overflow-hidden" ref={carouselRef}>
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={carouselIndex}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: direction === 'right' ? 100 : -100,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    duration: TRANSITION_DURATION / 1000,
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
                >
                  {getVisibleArtists().map((artist, index) => (
                    <ArtistCard
                      key={`${artist.id}-${carouselIndex}-${index}`}
                      artist={artist}
                      index={index}
                      isFeatured={artist.isFeatured}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div id="skip-carousel" className="sr-only" aria-hidden="true" />
        </div>
        <motion.div
          className="mt-7 sm:mt-10 text-center"
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            transition: { delay: 0.1, duration: 0.8, ease: [0.2, 0.8, 0.4, 1] },
          }}
        >
          <motion.a
            href="/artists"
            whileHover={{
              scale: 1.03,
              backgroundPosition: '100% 50%',
              boxShadow: '0 15px 40px -10px rgba(157, 23, 77, 0.3)',
              transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            whileTap={{
              scale: 0.98,
              boxShadow: '0 8px 25px -6px rgba(107, 33, 168, 0.25)',
            }}
            className="relative inline-flex items-center px-5 py-3 bg-[length:300%_300%] bg-gradient-to-br from-fuchsia-600 via-purple-600 to-blue-500 text-white font-semibold rounded-2xl hover:bg-gradient-to-br hover:from-fuchsia-700 hover:via-purple-700 hover:to-blue-600 transition-all duration-700 shadow-2xl hover:shadow-3xl shadow-fuchsia-500/20 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:ring-offset-2 group overflow-hidden isolate"
            style={{
              backgroundImage:
                'radial-gradient(circle at 75% 25%, rgba(236,72,153,0.8) 0%, rgba(168,85,247,0.9) 40%, rgba(59,130,246,0.95) 100%)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            {/* Dynamic text with depth */}
            <span className="relative z-10 flex items-center gap-3 tracking-wider text:md sm:text-lg">
              <span className="relative inline-block overflow-hidden h-7">
                <motion.span
                  className="block"
                  initial={{ y: 0 }}
                  whileHover={{ y: -28 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.4, 1] }}
                >
                  <span className="block">All Artists</span>
                  <span className="block  ">Explore Now</span>
                </motion.span>
              </span>
              <motion.div
                className="relative"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.4, 1] }}
              >
                <ChevronRightIcon className="h-6 w-6 transition-all duration-500 group-hover:text-blue-200" />
              </motion.div>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
