'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate, TargetAndTransition } from 'framer-motion';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  image: string;
  ticketsLeft: number | null;
  category: string;
  price?: string;
}

interface PremiumEventCardProps {
  event: Event;
}

const PremiumEventCard = ({ event }: PremiumEventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // For parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  
  // For ticket counter animation
  const [ticketsLeft, setTicketsLeft] = useState(event.ticketsLeft);
  const ticketCount = useMotionValue(event.ticketsLeft || 0);
  const roundedCount = useTransform(ticketCount, (latest) => Math.round(latest));

  // Multiple images for gallery effect
  const eventImages = [
    event.image,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'
  ];

  // Animate ticket counter
  useEffect(() => {
    if (event.ticketsLeft !== null) {
      const controls = animate(ticketCount, ticketsLeft || 0, {
        duration: 0.8,
        onUpdate: (latest) => {
          if (latest <= 5) {
            ticketCount.set(latest); // More dramatic animation when few tickets left
          }
        }
      });
      return () => controls.stop();
    }
  }, [ticketsLeft, event.ticketsLeft, ticketCount]);

  const handleBuyTicket = () => {
    if (event.ticketsLeft !== null && event.ticketsLeft > 0) {
      setTicketsLeft((prev: number | null) => (prev !== null ? prev - 1 : null));
      // Simulate API call
      setTimeout(() => {
        // Add to cart logic here
      }, 300);
    }
  };

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
    <motion.div
      ref={cardRef}
      className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
      onMouseMove={handle3DHover}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        reset3DEffect();
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating action buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full"
        >
          {isLiked ? (
            <HeartSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-white" />
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full"
        >
          <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
        </motion.button>

        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full"
          >
            <ShareIcon className="h-5 w-5 text-white" />
          </motion.button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-30"
              >
                {['Twitter', 'WhatsApp', 'Email', 'Link'].map((platform) => (
                  <button
                    key={platform}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <span>Share via {platform}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              <span className="text-xs font-bold text-white">SELLING FAST</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        {/* Category chip with floating particles */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block mb-3 relative"
        >
          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {event.category.toUpperCase()}
            </span>
          </div>
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: Math.random() * 40 - 20,
                      y: Math.random() * -30 - 10,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="absolute top-0 left-0 h-1 w-1 rounded-full bg-pink-400"
                  />
                ))}
              </>
            )}
          </AnimatePresence>
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
              whileHover={{
                scale: 1.1,
                backgroundImage: 'linear-gradient(45deg, #f43f5e, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              } as TargetAndTransition}
            >
              {word}{' '}
            </motion.span>
          ))}
        </motion.h3>

        {/* Date and location with animated underline */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-white/90 mb-2">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <motion.span 
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
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
            <motion.span
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              {event.location}
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-px bg-white"
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
          </div>
        </div>

        {/* Dynamic ticket counter */}
        {event.ticketsLeft !== null && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-white/80">
                <TicketIcon className="h-3 w-3 mr-1" />
                <span>Tickets remaining:</span>
              </div>
              <motion.span 
                className="text-sm font-bold text-white"
                style={{ 
                  color: ticketsLeft && ticketsLeft <= 5 ? '#ef4444' : '#ffffff'
                }}
              >
                {roundedCount}
              </motion.span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((ticketsLeft || 0) / (event.ticketsLeft || 100)) * 100}%`,
                }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <motion.div
            className="text-xl font-bold text-white"
            whileHover={{ 
              scale: 1.05,
              textShadow: '0 0 10px rgba(255,255,255,0.5)'
            }}
          >
            {event.price === 'Free' ? (
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
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyTicket}
            disabled={event.ticketsLeft !== null && event.ticketsLeft <= 0}
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
  );
};

export default PremiumEventCard;