'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { Loader2 } from 'lucide-react';
import { loginText } from '@/lib/mockData';
import { AuthError } from './AuthError';
import { LoginFormData, loginSchema } from '@/lib/validation';
import { useLoading } from '@/hooks/useLoading';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  error: string;
  setError: (error: string) => void;
}

export function LoginForm({
  onSubmit,

  error,
  setError,
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    rememberMe: false,
  });
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>(
    'email'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const identifierRef = useRef<HTMLInputElement>(null);
  const { isLoading: isFormLoading } = useLoading();

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      setFormData((prev) => ({ ...prev, rememberMe }));
    }
  }, []);

  useEffect(() => {
    if (formData.rememberMe !== undefined) {
      localStorage.setItem('rememberMe', formData.rememberMe.toString());
    }
  }, [formData.rememberMe]);

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      const errors: Record<string, string> = {};
      if (error && typeof error === 'object' && 'errors' in error) {
        const validationError = error as {
          errors: Array<{ path: string[]; message: string }>;
        };
        validationError.errors.forEach((err) => {
          if (err.path && err.path[0]) {
            errors[err.path[0]] = err.message;
          }
        });
      }
      setFormErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    }
  };

  const handleIdentifierChange = (value: string) => {
    if (identifierType === 'email') {
      setFormData({ ...formData, email: value, phone: '' });
    } else {
      setFormData({ ...formData, phone: value, email: '' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {loginText.welcomeBack}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        {loginText.signInDescription}
      </p>

      {error && <AuthError error={error} onDismiss={() => setError('')} />}

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {/* Identifier Type Toggle */}
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setIdentifierType('email')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              identifierType === 'email'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setIdentifierType('phone')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              identifierType === 'phone'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Phone
          </button>
        </div>

        {/* Email or Phone Input */}
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {identifierType === 'email' ? 'Email Address' : 'Phone Number'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {identifierType === 'email' ? (
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              id="identifier"
              name="identifier"
              type={identifierType === 'email' ? 'email' : 'tel'}
              required
              ref={identifierRef}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder={
                identifierType === 'email' ? 'your@email.com' : '+268 7612 3456'
              }
              value={
                identifierType === 'email' ? formData.email : formData.phone
              }
              onChange={(e) => handleIdentifierChange(e.target.value)}
              aria-describedby={
                formErrors.email || formErrors.phone
                  ? 'identifier-error'
                  : undefined
              }
              disabled={isFormLoading('login')}
            />
          </div>
          {(formErrors.email || formErrors.phone) && (
            <p
              id="identifier-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {formErrors.email || formErrors.phone}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {loginText.passwordLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder={loginText.passwordPlaceholder}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              aria-describedby={
                formErrors.password ? 'password-error' : undefined
              }
              disabled={isFormLoading('login')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isFormLoading('login')}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p
              id="password-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {formErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors"
              disabled={isFormLoading('login')}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              {loginText.rememberMe}
            </label>
          </div>
          <a
            href="/auth/forgot-password"
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline transition-colors"
          >
            {loginText.forgotPassword}
          </a>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: isFormLoading('login') ? 1 : 1.03 }}
          whileTap={{ scale: isFormLoading('login') ? 1 : 0.98 }}
          type="submit"
          disabled={isFormLoading('login')}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in to your account"
        >
          {isFormLoading('login') ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {loginText.signIn}
              <ArrowRightIcon className="h-5 w-5" />
            </>
          )}
        </motion.button>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {loginText.orContinue}
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <GoogleButton loading={isFormLoading('google')} />
          </div>
        </div>
      </motion.form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loginText.noAccount}{' '}
          <a
            href="/auth/register"
            className="font-medium text-purple-600 dark:text-purple-400 hover:underline transition-colors"
          >
            {loginText.signUp}
          </a>
        </p>
      </div>
    </div>
  );
}
