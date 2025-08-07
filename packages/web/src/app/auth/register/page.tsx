'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import AuthHeader from '@/components/landing/AuthHeader';
import Footer from '@/components/landing/Footer';
import { useAuth } from '@/app/contexts/auth-context';
import { GoogleButton } from '@/components/auth/GoogleButton';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      // The auth context will handle the redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-12"
        >
          {/* Left side - Form */}
          <div className="w-full md:w-1/2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Join Eswatini Events to book tickets faster and manage all your
                events in one place.
              </p>
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
                >
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700 dark:text-red-300">
                      {error}
                    </span>
                  </div>
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+268 1234 5678"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{' '}
                    <a
                      href="/terms"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Terms
                    </a>{' '}
                    and{' '}
                    <a
                      href="/privacy"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <GoogleButton />
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <a
                    href="/auth/login"
                    className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="w-full md:w-1/2 flex items-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl p-8 h-full flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Join Eswatini Events?
                </h3>
                <ul className="space-y-4 text-left">
                  {[
                    'Instant ticket delivery via WhatsApp/SMS',
                    'Manage all your tickets in one place',
                    'Exclusive early access to popular events',
                    'Secure payments with MTN MoMo',
                    'Get event recommendations just for you',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full mr-3 mt-0.5">
                        <CheckIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
        clipRule="evenodd"
      />
    </svg>
  );
}
