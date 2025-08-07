'use client';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  TicketIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  ArrowRightIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, CalendarIcon, CheckIcon } from 'lucide-react';

const benefits = [
  {
    icon: (
      <CurrencyDollarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Lower Fees',
    description: "Only 5-8% fees vs competitors' 10-15%",
    highlight: 'Save 30-50% on ticketing costs',
  },
  {
    icon: (
      <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Real-time Analytics',
    description: 'Track sales, attendance, and revenue in real-time',
    highlight: 'Make data-driven decisions',
  },

  {
    icon: (
      <ShieldCheckIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Fraud Prevention',
    description: 'QR codes and NFC wristbands to eliminate cash theft',
    highlight: 'Recover 20%+ of lost revenue',
  },
  {
    icon: (
      <QrCodeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Instant Ticketing',
    description: 'Attendees get QR codes via WhatsApp/SMS immediately',
    highlight: 'No more manual ticket distribution',
  },
  {
    icon: (
      <DevicePhoneMobileIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Built for Eswatini  ',
    description: 'Works perfectly on all devices, even with 2G',
    highlight: 'Reach rural attendees effortlessly',
  },
  {
    icon: (
      <UserGroupIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'Complete Ecosystem',
    description: 'From attendees to vendors to sponsors - we connect everyone',
    highlight: '10+ stakeholder roles',
  },
  {
    icon: (
      <SparklesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
    ),
    title: 'AI-Powered Innovation',
    description: 'Auto-generated event recap films for marketing',
    highlight: 'Boost engagement and future sales',
  },
];

const testimonials = [
  {
    quote:
      'Reduced no-shows by 50% with dynamic pricing. Our attendees love the mobile tickets!',
    name: 'Sidvokodvo Riders',
    role: 'Motorsport Event Organizer',
    image: '/images/sidvokodvo.jpg',
  },
  {
    quote:
      'The NFC wristbands revolutionized our vendor payments. No more cash handling!',
    name: 'MTN Bushfire Team',
    role: 'Music Festival',
    image: '/images/bushfire.jpg',
  },
];

const OrganizerCTA = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section
      ref={ref}
      className="relative pb-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden"
      id="for-organizers"
    >
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const baseSize = 100 + i * 30;
          const position = i * 12.5;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls}
              variants={{
                visible: {
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                  x: [0, i % 2 === 0 ? 30 : -30],
                  y: [0, i % 3 === 0 ? 20 : -20],
                  transition: {
                    duration: 15 + i * 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.5,
                  },
                },
              }}
              className={`absolute rounded-full ${
                i % 2 === 0 ? 'bg-purple-500/10' : 'bg-pink-500/10'
              } blur-xl`}
              style={{
                width: `${baseSize}px`,
                height: `${baseSize}px`,
                top: `${position}%`,
                left: `${position}%`,
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
          >
            <TicketIcon className="h-4 w-4 mr-2" />
            FOR ORGANIZERS
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Everything You Need
            </span>{' '}
            to Sell Out Your Events
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From local gatherings to national festivals, we provide the tools to
            maximize attendance, minimize hassle, and grow your revenue.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all"
            >
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-3 py-2 rounded-lg">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {benefit.highlight}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials and CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Testimonials */}
          <div>
            <motion.h3
              className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Trusted by Eswatini&apos;s{' '}
              <span className="text-purple-600 dark:text-purple-400">
                Top Event Creators
              </span>
            </motion.h3>

            <div className="relative">
              {/* Testimonials Carousel */}
              <div className="relative overflow-hidden h-[220px]">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: activeTestimonial === index ? 1 : 0,
                      x: activeTestimonial === index ? 0 : 20,
                      zIndex: activeTestimonial === index ? 1 : 0,
                      pointerEvents:
                        activeTestimonial === index ? 'auto' : 'none',
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700`}
                  >
                    <div className="flex items-start h-full">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-purple-500 dark:border-purple-400">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="italic text-gray-700 dark:text-gray-300 mb-3">
                          &quot;{testimonial.quote}&quot;
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() =>
                    setActiveTestimonial((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>

                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeTestimonial === index
                          ? 'bg-purple-600 w-6'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setActiveTestimonial((prev) =>
                      prev === testimonials.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
            <div className="relative z-10 p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Events?
              </h3>
              <p className="text-purple-100 mb-6">
                Join Eswatini&apos;s premier ticketing platform and start
                selling tickets in minutes.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="bg-white/20 p-1 rounded-full mr-3">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-purple-50">No setup fees</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 p-1 rounded-full mr-3">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-purple-50">
                    Free onboarding support
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 p-1 rounded-full mr-3">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-purple-50">First 10 tickets free</span>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                >
                  Get Started Now
                  <ArrowRightIcon className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                >
                  Book a Demo
                  <CalendarIcon className="h-5 w-5" />
                </motion.button>
              </div>

              <p className="text-xs text-purple-200 mt-4 text-center">
                Try us out. We will not dissapoint. We pinkie promise!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OrganizerCTA;
