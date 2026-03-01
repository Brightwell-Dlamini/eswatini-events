'use client';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
// You'll need to create this

const ContactPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: (
        <MapPinIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      ),
      title: 'Our Office',
      description: 'Mbabane Office Park, 3rd Floor, Mbabane, Eswatini',
      link: 'https://maps.google.com',
      linkText: 'View on map',
    },
    {
      icon: (
        <PhoneIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      ),
      title: 'Phone',
      description: '+268 2404 0000 (Office)\n+268 7600 0000 (Support)',
      link: 'tel:+26824040000',
      linkText: 'Call us',
    },
    {
      icon: (
        <EnvelopeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      ),
      title: 'Email',
      description: 'info@eswatini-events.com\nsupport@eswatini-events.com',
      link: 'mailto:info@eswatini-events.com',
      linkText: 'Send email',
    },
    {
      icon: (
        <ClockIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      ),
      title: 'Hours',
      description: 'Mon-Fri: 8AM - 5PM\nSat: 9AM - 1PM\nSun: Closed',
      link: '',
      linkText: '',
    },
    {
      icon: (
        <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      ),
      title: 'WhatsApp',
      description: 'Chat with our support team',
      link: 'https://wa.me/26876000000',
      linkText: 'Start chat',
    },
    {
      icon: (
        <UserGroupIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      ),
      title: 'Social Media',
      description: '@EswatiniEvents on all platforms',
      link: 'https://facebook.com/EswatiniEvents',
      linkText: 'Follow us',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-900 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
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
                  width: `${100 + i * 30}px`,
                  height: `${100 + i * 30}px`,
                  top: `${i * 15}%`,
                  left: `${i * 15}%`,
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
            <div className="text-center">
              <motion.h1
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              >
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  We&apos;d Love
                </span>{' '}
                to Hear From You
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
              >
                Whether you have questions about ticketing, need support for an
                event, or want to partner with us, our team is ready to help.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact-form"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Send us a message
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:+26824040000"
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-medium rounded-lg border border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  Call now
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all h-full"
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {method.description}
                      </p>
                      {method.link && (
                        <a
                          href={method.link}
                          className="inline-flex items-center mt-2 text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          {method.linkText}
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section
          id="contact-form"
          className="py-16 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Image and text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/contact-team.jpg"
                    alt="Eswatini Events team"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      Our Team is Ready to Help
                    </h3>
                    <p className="text-purple-100">
                      Average response time:{' '}
                      <span className="font-bold">under 2 hours</span>
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {[
                      'How do I create an event?',
                      'What payment methods do you support?',
                      'Can I sell tickets offline?',
                      'How do NFC wristbands work?',
                    ].map((question, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4"
                      >
                        <button className="flex items-center justify-between w-full text-left text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          <span>{question}</span>
                          <ArrowRightIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <a
                      href="/faq"
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline mt-2"
                    >
                      View all FAQs
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Right side - Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg"
                  >
                    Thank you! Your message has been sent successfully.
                    We&apos;ll contact you soon.
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Find Us in Mbabane
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Visit our office to discuss your event needs in person
              </p>
            </motion.div>

            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.988715304362!2d31.13672031502972!3d-26.19835598344085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee5b0f5f0a1a5a1%3A0x1a3b3b3b3b3b3b3b!2sMbabane%20Office%20Park!5e0!3m2!1sen!2ssz!4v1620000000000!5m2!1sen!2ssz"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="dark:grayscale dark:opacity-90"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
