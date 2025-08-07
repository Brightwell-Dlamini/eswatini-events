'use client';
import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTwitter,
} from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // const regions = [
  //   'Mbabane',
  //   'Manzini',
  //   'Big Bend',
  //   'Siteki',
  //   'Nhlangano',
  //   'Piggs Peak',
  //   'Lobamba',
  // ];

  const eventCategories = [
    'Music Festivals',
    'Sports Events',
    'Cultural Shows',
    'Business Conferences',
    'Community Gatherings',
    'Exhibitions',
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center">
              {/* <Image
                src="/images/logo.png"
                alt="Eswatini Events Logo"
                width={40}
                height={40}
                className="mr-3"
              /> */}
              <h3 className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  Eswatini Events
                </span>
              </h3>
            </div>
            <p className="text-sm">
              The premier ticketing platform for events across the Kingdom of
              Eswatini.
            </p>

            {/* Payment methods */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">
                PAYMENT METHODS
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white/10 p-2 rounded">
                  <Image
                    src="/images/momo.png"
                    alt="MTN Mobile Money"
                    width={40}
                    height={25}
                  />
                </div>
                <div className="bg-white/10 p-2 rounded">
                  <Image
                    src="/images/visa.png"
                    alt="Visa"
                    width={40}
                    height={25}
                  />
                </div>
                <div className="bg-white/10 p-2 rounded">
                  <Image
                    src="/images/mastercard.png"
                    alt="Mastercard"
                    width={40}
                    height={25}
                  />
                </div>
                <div className="bg-white/10 p-2 rounded flex items-center justify-center px-3">
                  <Image
                    src="/images/cash.png"
                    alt="Cash"
                    width={40}
                    height={25}
                  />
                </div>
              </div>
            </div>

            {/* Social media */}
            <div className="flex space-x-4 pt-4">
              <motion.a
                whileHover={{ y: -3 }}
                href="https://facebook.com/eswatinievents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                <FaFacebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://wa.me/26812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors duration-200"
              >
                <FaWhatsapp className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://instagram.com/eswatinievents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <FaInstagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://x.com/eswatinievents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <FaTwitter className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/events"
                  className="flex items-center hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  All Events
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/organizers"
                  className="flex items-center hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  For Organizers
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/vendors"
                  className="flex items-center hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  For Vendors
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/about"
                  className="flex items-center hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  About Us
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/blog"
                  className="flex items-center hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Blog & News
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Event categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Event Types
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {eventCategories.map((category, index) => (
                <motion.a
                  key={index}
                  whileHover={{ x: 5 }}
                  href={`/events?category=${category
                    .toLowerCase()
                    .replace(' ', '-')}`}
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  {category}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="h-4 w-4 mt-1 mr-3 flex-shrink-0 text-yellow-400" />
                <div>
                  <p className="text-sm">123 Somhlolo Road</p>
                  <p className="text-sm">Mbabane, Eswatini</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="h-4 w-4 mr-3 flex-shrink-0 text-yellow-400" />
                <a
                  href="tel:+26812345678"
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  +268 1234 5678
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="h-4 w-4 mr-3 flex-shrink-0 text-yellow-400" />
                <a
                  href="mailto:info@eswatinievents.com"
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  info@eswatinievents.com
                </a>
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white mb-2">
                Get Event Updates
              </h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white text-sm px-3 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-yellow-400 w-full"
                />
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium text-sm px-4 py-2 rounded-r transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                We&apos;ll never share your email
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 w-full my-6"
        />

        {/* Bottom footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center text-sm"
        >
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <p>© {currentYear} Eswatini Events. All rights reserved.</p>
            <div className="flex space-x-4">
              <a
                href="/privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="/refunds"
                className="hover:text-white transition-colors duration-200"
              >
                Refund Policy
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Proudly made in</span>
            <Image
              src="/images/flag.png"
              alt="Eswatini Flag"
              width={24}
              height={16}
              className="rounded-sm"
            />
            <span className="text-white">Eswatini</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
