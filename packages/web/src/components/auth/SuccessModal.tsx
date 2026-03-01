'use client';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export function SuccessModal() {
  const { width, height } = useWindowSize();
  return (
    <>
      <Confetti width={width} height={height} recycle={false} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Login Successful!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Redirecting to your dashboard...
        </p>
      </motion.div>
    </>
  );
}
