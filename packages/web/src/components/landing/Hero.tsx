// components/Hero.tsx
'use client';

import { motion, useTransform, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BackgroundCarousel } from './Hero/BackgroundCarousel';
import { HeroTextSection } from './Hero/HeroTextSection';
import { ScrollIndicator } from './Hero/ScrollIndicator';
import { EventsCarousel } from './Hero/EventCarousel';

export const Hero = () => {
  const { scrollY } = useScroll();
  const [, setScrollDirection] = useState<'up' | 'down'>('down');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

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

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden h-[100vh]">
      <BackgroundCarousel />
      <div className="absolute inset-0 z-0 bg-black/20" />

      <motion.div className="relative z-10 h-full" style={{ y: yPos }}>
        {/* Hero text section with max height and optional overflow */}
        <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-[90vw] mx-auto h-[calc(100%-200px)]">
          <HeroTextSection />
        </div>

        {/* Bottom section fixed to bottom */}
        <div className="absolute bottom-10 sm:bottom-2 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-[90vw] mx-auto">
          <EventsCarousel />
          <ScrollIndicator />
        </div>
      </motion.div>
    </section>
  );
};
