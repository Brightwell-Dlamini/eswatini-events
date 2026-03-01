'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

import dynamic from 'next/dynamic';
import AuthHeader from '../landing/AuthHeader';

const LazyFooter = dynamic(() => import('@/components/landing/Footer'), {
  ssr: false,
  loading: () => <div className="h-20" />,
});

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-12"
        >
          {children}
        </motion.div>
      </main>
      <LazyFooter />
    </div>
  );
}
