'use client';

import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
  Variants,
  Transition,
} from 'framer-motion';
import {
  MagnifyingGlassIcon,
  TicketIcon,
  QrCodeIcon,
  BoltIcon as LightningBoltIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

// Type definitions for the component
interface Step {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  ariaLabel: string;
  gradient: string;
  particles: string[];
  order: number;
}

interface HowItWorksProps {
  initialSteps?: Step[]; // For server-side data
  loading?: boolean; // For loading state
  error?: string | null; // For error state
}

const defaultSteps: Step[] = [
  {
    id: 'discover',
    icon: (
      <MagnifyingGlassIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Discover Events',
    description:
      'Browse 100+ concerts, sports, and cultural events across Eswatini',
    ariaLabel: 'Step 1: Discover Events',
    gradient: 'from-indigo-500 to-purple-500',
    particles: ['🎵', '🎤', '⚽'],
    order: 1,
  },
  {
    id: 'payment',
    icon: (
      <TicketIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Secure Payment',
    description: 'Pay via MTN Mobile Money, Visa, or cash at local booths',
    ariaLabel: 'Step 2: Secure Payment',
    gradient: 'from-purple-500 to-pink-500',
    particles: ['💵', '📱', '💳'],
    order: 2,
  },
  {
    id: 'access',
    icon: (
      <QrCodeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Instant Access',
    description: 'Receive QR codes via WhatsApp/SMS/e-mail or NFC wristbands',
    ariaLabel: 'Step 3: Instant Access',
    gradient: 'from-pink-500 to-rose-500',
    particles: ['📲', '✉️', '🔑'],
    order: 3,
  },
];

const HowItWorks = ({
  initialSteps = defaultSteps,
  loading = false,
  error = null,
}: HowItWorksProps) => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  // Fetch steps if not provided (client-side fallback)
  useEffect(() => {
    if (initialSteps.length === 0 && !loading && !error) {
      const fetchSteps = async () => {
        try {
          const response = await fetch('/api/how-it-works');
          const data = await response.json();
          setSteps(data);
        } catch (err) {
          console.error('Failed to fetch steps:', err);
          setSteps(defaultSteps);
        }
      };
      fetchSteps();
    }
  }, [initialSteps, loading, error]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: 'beforeChildren',
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 80, opacity: 0, rotateY: 15 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      rotateY: 0,
      transition: {
        delay: i * 0.15,
        type: 'spring',
        damping: 12,
        stiffness: 150,
      } as Transition,
    }),
    hover: {
      y: -15,
      scale: 1.03,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
      } as Transition,
    },
    tap: {
      scale: 0.97,
    },
  };

  const particleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      x: Math.random() * 40 - 20,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        type: 'spring',
        stiffness: 100,
      } as Transition,
    }),
    exit: { opacity: 0, y: -20 },
  };

  if (loading) {
    return (
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Loading how it works...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 rounded-full bg-pink-400/10 blur-3xl" />
        <motion.div
          className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-indigo-400/10 blur-2xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-24"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-sm font-medium">
              <LightningBoltIcon className="h-4 w-4 mr-2 text-purple-500" />
              LIGHTNING FAST
            </span>
          </motion.div>

          <motion.h2
            id="how-it-works-heading"
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Get Tickets
            </span>{' '}
            in {steps.length} Simple Steps
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            From discovery to entry - faster than ever before with our
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {' '}
              Eswatini-first
            </span>{' '}
            approach
          </motion.p>
        </motion.div>

        {/* Steps Cards */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {steps
            .sort((a, b) => a.order - b.order)
            .map((step, i) => (
              <motion.div
                key={step.id}
                custom={i}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none group overflow-hidden isolate"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                tabIndex={0}
                aria-label={step.ariaLabel}
              >
                {/* 3D depth effect */}
                <div
                  className="absolute inset-0 rounded-3xl bg-white dark:bg-gray-800 shadow-lg -z-10"
                  style={{
                    transform: 'translateZ(-10px)',
                    filter: 'blur(10px)',
                    opacity: 0.5,
                  }}
                />

                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl p-[2px] pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredIndex === i ? 1 : 0.3,
                    background: `linear-gradient(to right, ${
                      theme === 'dark' ? '#7c3aed' : '#8b5cf6'
                    }, ${theme === 'dark' ? '#ec4899' : '#f472b6'})`,
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Floating particles */}
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                      {step.particles.map((emoji, idx) => (
                        <motion.span
                          key={`${step.id}-particle-${idx}`}
                          className="absolute text-2xl opacity-70"
                          custom={idx}
                          variants={particleVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                          }}
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                <div className="relative h-full">
                  <div className="relative z-10">
                    <motion.div
                      className={`bg-gradient-to-br ${step.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                      whileHover={{ rotate: 10 }}
                    >
                      {step.icon}
                    </motion.div>

                    <div className="absolute top-0 right-0 text-8xl font-bold text-gray-100 dark:text-gray-700/30 -z-10">
                      0{step.order}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {step.description}
                    </p>

                    <motion.div
                      className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 group/button"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-1">Learn more</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover/button:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
