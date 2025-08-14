'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import { IoMdCash } from 'react-icons/io';
import OrganizerCTA from '@/components/organizer/OrginizerCTA';

const OrganizerLanding: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const paymentMethods = [
    { name: 'MTN MoMo', icon: <IoMdCash className="w-6 h-6 text-green-600" /> },
    { name: 'M-Pesa', icon: <GiCash className="w-6 h-6 text-green-700" /> },
    {
      name: 'Visa/Mastercard',
      icon: <FaMoneyBillWave className="w-6 h-6 text-blue-600" />,
    },
    { name: 'Cash', icon: <GiCash className="w-6 h-6 text-yellow-600" /> },
  ];

  return (
    <div className="bg-gradient-to-b from-[#274562] to-white" ref={ref}>
      {/* Hero Section with Parallax */}
      <div className="relative h-[55vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/eswatini-bg.jpg')] bg-cover bg-center"
          style={{
            y: yBg,
            opacity: opacityBg,
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center justify-center mb-4">
              {/* <SiSwati className="text-4xl text-[#3a5ba0]" /> */}
              <span className="ml-2 text-lg font-semibold text-[#3a5ba0]">
                ESWATINI&apos;S EVENT REVOLUTION
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#3a5ba0] to-[#f8c537]">
              Reclaim Your Event Industry
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              World-class ticketing with{' '}
              <span className="font-semibold">3-5% fees</span> - half the cost
              of foreign platforms
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/organizer/register"
                className="inline-block bg-gradient-to-r from-[#3a5ba0] to-[#f8c537] hover:from-[#2d4a8a] hover:to-[#e0b030] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Start Your Free Trial
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-gradient-to-br from-[#3a5ba0]/10 to-[#f8c537]/10 rounded-xl"
            >
              <div className="text-4xl font-bold text-[#3a5ba0]">3-5%</div>
              <div className="text-gray-600">Ticketing Fees</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-gradient-to-br from-[#3a5ba0]/10 to-[#f8c537]/10 rounded-xl"
            >
              <div className="text-4xl font-bold text-[#3a5ba0]">20%</div>
              <div className="text-gray-600">Less Fraud</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-gradient-to-br from-[#3a5ba0]/10 to-[#f8c537]/10 rounded-xl"
            >
              <div className="text-4xl font-bold text-[#3a5ba0]">100%</div>
              <div className="text-gray-600">Local Pride</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-gradient-to-br from-[#3a5ba0]/10 to-[#f8c537]/10 rounded-xl"
            >
              <div className="text-4xl font-bold text-[#3a5ba0]">70%</div>
              <div className="text-gray-600">Cash Support</div>
            </motion.div>
          </div>
        </div>
      </div>

      <OrganizerCTA />
      {/* Payment Methods */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3a5ba0]">
              Payments Everyone Can Use
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From mobile money to cash - we support all payment methods used in
              Eswatini
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center bg-gray-50 px-6 py-3 rounded-full"
              >
                {method.icon}
                <span className="ml-2 font-medium">{method.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#3a5ba0] to-[#f8c537]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Take Control of Your Events?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join MTN Bushfire, Standard Bank Luju Festival and other top
              organizers using Eswa Tickets
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/organizer/register"
                className="inline-block bg-white text-[#3a5ba0] hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Get Started Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLanding;
