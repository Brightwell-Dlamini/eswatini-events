import { backgroundImages } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export const BackgroundCarousel = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 20000);

    return () => clearInterval(bgInterval);
  }, []);

  return (
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
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  priority={index === 0} // Only prioritize first image
                  quality={80}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-bg.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
};
