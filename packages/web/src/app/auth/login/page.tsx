'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import AuthHeader from '@/components/landing/AuthHeader';
import Footer from '@/components/landing/Footer';
import { useAuth } from '@/app/contexts/auth-context';
import { CheckIcon } from 'lucide-react';
import { GoogleButton } from '@/components/auth/GoogleButton';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      // Redirect is handled in the auth context after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Sign in to access your tickets and event history.
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
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

                {/* Password Input */}
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="/reset-password"
                      className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
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
                      Sign In
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
                {/* Social Login Options */}
                <div className="mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 ">
                    <GoogleButton />
                  </div>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center ">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <a
                    href="/auth/register"
                    className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Sign up
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
                  Your Events, One Place
                </h3>
                <ul className="space-y-4 text-left">
                  {[
                    'View all your upcoming events',
                    'Access tickets anytime, anywhere',
                    'Get event reminders and updates',
                    'Quick re-entry with saved QR codes',
                    'Exclusive offers for members',
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
