'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  LightBulbIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

const AboutUs = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const stats = [
    { id: 1, name: 'Events powered', value: '50+', trend: '↑ 12%' },
    { id: 2, name: 'Ticket transactions', value: '55k+', trend: '↑ 23%' },
    { id: 3, name: 'Local vendors', value: '200+', trend: '↑ 8%' },
    { id: 4, name: 'Platform savings', value: '40%', trend: '↑ 5%' },
  ];

  const values = [
    {
      name: 'Eswatini Pride',
      description:
        'Prioritizing local payments, promotions, and artist partnerships to celebrate our national identity.',
      icon: MapPinIcon,
      color: 'bg-red-600',
    },
    {
      name: 'Inclusivity',
      description:
        'From rural locals to international tourists, we design for all demographics and connectivity levels.',
      icon: UserGroupIcon,
      color: 'bg-blue-600',
    },
    {
      name: 'Innovation',
      description:
        'Blending global technology with local solutions like USSD ticketing and NFC wristbands.',
      icon: LightBulbIcon,
      color: 'bg-purple-600',
    },
    {
      name: 'Transparency',
      description:
        'Comprehensive audit logs and secure transactions build trust in every ticket purchased.',
      icon: ShieldCheckIcon,
      color: 'bg-emerald-600',
    },
    {
      name: 'Affordability',
      description:
        '5-8% ticketing fees compared to foreign platforms charging 10-15%.',
      icon: CurrencyDollarIcon,
      color: 'bg-amber-500',
    },
    {
      name: 'Community',
      description:
        'Free listings for cultural events and support for local community initiatives.',
      icon: HeartIcon,
      color: 'bg-pink-500',
    },
  ];

  const team = [
    {
      name: 'Mr. Siyabonga Dlamini',
      role: 'Founder & CEO',
      bio: "Visionary leader with a passion for technology and Eswatini's cultural heritage. Founded Eswa Tickets to create a platform that serves local needs first.",
      image: '/team-ceo.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Tech & Product Team',
      role: 'Innovation Experts',
      bio: 'Building cutting-edge solutions like USSD ticketing, NFC wristbands, and AI-powered features while ensuring the platform works flawlessly on 2G networks.',
      image: '/team-tech.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Community Team',
      role: 'Local Champions',
      bio: "Working directly with event organizers, vendors, and local communities to ensure the platform meets real needs and supports Eswatini's cultural events.",
      image: '/team-community.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
  ];

  const testimonials = [
    {
      quote:
        'Eswa Tickets transformed our festival operations. The USSD ticketing reached rural attendees we never could before.',
      name: 'MTN Bushfire Team',
      role: 'Major Festival Organizers',
    },
    {
      quote:
        'Finally a platform that understands our local needs. The cash payment option was a game-changer for our community events.',
      name: 'Sidvokodvo Riders',
      role: 'Local Event Organizers',
    },
    {
      quote:
        'As an international visitor, I was impressed by how seamless the ticket purchasing and entry process was.',
      name: 'Sarah Johnson',
      role: 'Tourist from UK',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900" ref={containerRef}>
      {' '}
      <Navbar />
      {/* Hero Section with Parallax */}
      <div className="relative h-[80vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900"
          style={{ y: yBg }}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
                <span className="block">Where Africa</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                  Celebrates
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0"
              >
                Eswa Tickets is revolutionizing event management in Eswatini
                with world-class technology tailored for local needs.
              </motion.p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="/events"
                    className="px-8 py-3 bg-white text-blue-900 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all"
                  >
                    Browse Events
                  </a>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="/contact"
                    className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all"
                  >
                    Contact Us
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </div>
      {/* Our Story */}
      <div className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Our Journey
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Reclaiming Eswatini&apos;s{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Event Industry
              </span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300"
            >
              <p className="mb-6">
                Founded in 2025, Eswa Tickets was born from a vision to create a
                ticketing platform that truly understands and serves the unique
                needs of Eswatini&apos;s event ecosystem.
              </p>
              <p className="mb-6">
                While foreign platforms dominated the market with high fees and
                poor localization, we saw an opportunity to build something
                better - a platform that empowers all stakeholders with
                inclusive, secure, and innovative tools.
              </p>
              <p>
                From our first pilot with Sidvokodvo Riders to powering major
                events like MTN Bushfire, we&apos;ve remained committed to our
                mission of making event access seamless for everyone.
              </p>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="mt-16">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8"
            >
              Our Milestones
            </motion.h3>
            <div className="relative">
              {/* Line */}
              <div className="absolute left-1/2 h-full w-0.5 bg-blue-200 dark:bg-blue-900 transform -translate-x-1/2"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {[
                  {
                    year: '2025',
                    title: 'Platform Launch',
                    description: 'Launched with USSD and mobile money support',
                    icon: GlobeAltIcon,
                  },
                  {
                    year: '2026',
                    title: 'MTN Bushfire Partnership',
                    description:
                      "Powered ticketing for Africa's premier music festival",
                    icon: CalendarIcon,
                  },
                  {
                    year: '2027',
                    title: 'Regional Expansion',
                    description: 'Expanded services to Lesotho and Mozambique',
                    icon: MapPinIcon,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                  >
                    <div
                      className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}
                    >
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${index % 2 === 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'}`}
                      >
                        {item.year}
                      </div>
                      <h4 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 dark:border-blue-400 flex items-center justify-center z-10">
                      <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Trusted by Eswatini&apos;s Event Community
            </h2>
            <p className="mt-3 text-xl text-blue-100">
              Our numbers tell the story of a platform built for and by
              Eswatini.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: stat.id * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mt-2 text-blue-100">{stat.name}</div>
                <div className="mt-1 text-sm text-green-300 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {stat.trend}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Values */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6"
            >
              <HeartIcon className="h-4 w-4 mr-2" />
              Our Philosophy
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              What Makes Us{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Different
              </span>
            </motion.h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-md ${value.color} text-white mb-4`}
                  >
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {value.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6"
            >
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Community Voices
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              What Our{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Community
              </span>{' '}
              Says
            </motion.h2>
          </div>

          <div className="mt-16">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000 }}
              pagination={{ clickable: true }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pb-12"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 h-full flex flex-col">
                      <div className="flex-1">
                        <svg
                          className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                        >
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      {/* Team */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6"
            >
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Meet The Team
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              The People Behind the{' '}
              <span className="text-blue-600 dark:text-blue-400">Platform</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto"
            >
              A passionate team dedicated to transforming Eswatini&apos;s event
              industry.
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="aspect-w-3 aspect-h-2 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full w-full flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400">
                    {member.role}
                  </p>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {member.bio}
                  </p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <a
                    href={member.social.twitter}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-blue-700"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="relative bg-gradient-to-r from-blue-700 to-purple-800 dark:from-blue-900 dark:to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px] opacity-10"></div>
        <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to experience</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                Eswatini&apos;s events?
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl text-xl text-blue-100 mx-auto"
            >
              Join thousands of attendees and organizers who trust Eswa Tickets
              for seamless event experiences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/events"
                  className="px-8 py-3 bg-white text-blue-900 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all"
                >
                  Browse Events
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/contact"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all"
                >
                  Contact Us
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
