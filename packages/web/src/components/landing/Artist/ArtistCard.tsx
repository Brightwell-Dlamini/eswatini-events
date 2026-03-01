// components/Artist/ArtistCard.tsx
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import {
  StarIcon,
  CalendarIcon,
  MusicalNoteIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid';
import { Artist } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ArtistCardProps {
  artist: Artist & {
    location?: string;
    yearsActive?: number;
    isTrending?: boolean;
    bio?: string;
  };
  index: number;
  isFeatured?: boolean;
}

export const ArtistCard = ({
  artist,
  index,
  isFeatured = false,
}: ArtistCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const imageAlt = `${artist.name}, ${artist.genre} artist from Eswatini`;

  // Hover effect for the entire card
  const handleHoverStart = () => {
    controls.start({
      y: -15,
      scale: 1.03,
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { type: 'spring', stiffness: 300 },
    });
  };

  const handleHoverEnd = () => {
    controls.start({
      y: 0,
      scale: 1,
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: { type: 'spring', stiffness: 300 },
    });
  };

  // Animate when in view
  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1, type: 'spring', stiffness: 100 },
      });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className={`group relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isFeatured ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''
      }`}
      tabIndex={0}
      aria-label={`Artist: ${artist.name}, ${artist.genre}`}
      role="article"
      data-testid="artist-card"
    >
      <div className="relative h-60">
        {/* Skeleton loader with shimmer effect */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer rounded-t-2xl" />
        )}

        {/* Fallback for error state */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <MusicalNoteIcon className="h-12 w-12 text-white opacity-80" />
          </div>
        )}

        {/* Main image */}
        <Image
          src={
            imageError ? '/images/artists/default-artist.webp' : artist.image
          }
          alt={imageAlt}
          fill
          className={`object-cover transition-all duration-500 ease-in-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={index > 2 ? 'lazy' : 'eager'}
          priority={index < 2}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          decoding="async"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Quick info overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-white drop-shadow-lg">
              {artist.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {artist.location || 'Eswatini'}
            </p>
          </div>

          <motion.div
            className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
            <span className="text-sm font-bold text-white">
              {artist.rating}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {artist.genre}
            </p>
            {artist.yearsActive && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {artist.yearsActive} years active
              </p>
            )}
          </div>

          {artist.isTrending && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1 animate-pulse"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
              Trending
            </motion.span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
            <span>
              {artist.upcomingEvents > 0
                ? `${artist.upcomingEvents} upcoming show${artist.upcomingEvents > 1 ? 's' : ''}`
                : 'No upcoming shows'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
