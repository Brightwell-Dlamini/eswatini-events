// HeroText.tsx
'use client';

import { textVariations } from '@/lib/mockData';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const HeroText = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textVariations.length);
    }, 16000);

    return () => clearInterval(textInterval);
  }, []);

  return (
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
            <h1 className="text-xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {textVariations[currentTextIndex].title}
              </span>
            </h1>
            <motion.p
              className="mt-4 text-sm sm:text-xl text-gray-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              {textVariations[currentTextIndex].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
        <div className="relative z-100">
          <div className="absolute inset-x-0 mt-6 mb-4 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent dark:via-gray-600"></div>
        </div>
      </motion.div>
    </div>
  );
};
