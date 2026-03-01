'use client';

import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/About/HeroSection';
import { OurStory } from '@/components/landing/About/OurStory';
import { StatsSection } from '@/components/landing/About/StatsSection';
import { ValuesSection } from '@/components/landing/About/ValuesSection';
import { TestimonialsSection } from '@/components/landing/About/TestimonialsSection';
import { TeamSection } from '@/components/landing/About/TeamSection';
import { CtaSection } from '@/components/landing/About/CtaSection';

const AboutUs = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="bg-white dark:bg-gray-900" ref={containerRef}>
      <Navbar />
      <HeroSection yBg={yBg} />
      <OurStory />
      <StatsSection />
      <ValuesSection />
      <TestimonialsSection />
      <TeamSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default AboutUs;
