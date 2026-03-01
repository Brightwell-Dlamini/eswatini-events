'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthError } from './AuthError';
import { registerText } from '@/lib/mockData';
import { registerFormSchema, RegisterApiData } from '@/lib/validation';
import { EyeIcon } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { debounce } from 'lodash-es';
import { ZodError, ZodIssue } from 'zod';

interface RegisterFormProps {
  onSubmit: (data: RegisterApiData) => Promise<void>;
  loading: boolean;
  error: string;
  role: UserRole;
}

function ErrorMessage({ id, message }: { id: string; message: string }) {
  return (
    <motion.p
      id={id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-1 text-sm text-red-600"
      role="alert"
    >
      {message}
    </motion.p>
  );
}

function FieldHelpText({ id, text }: { id: string; text: string }) {
  return (
    <p id={id} className="text-sm text-gray-500 mt-1">
      {text}
    </p>
  );
}

export function RegisterForm({
  onSubmit,
  loading,
  error,
  role,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: role,
    termsAccepted: false,
    company: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [localError, setLocalError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Role display names - simplified without useMemo
  const roleDisplayNames = {
    ATTENDEE: 'Attendee',
    ORGANIZER: 'Event Organizer',
    VENDOR: 'Vendor',
    GATE_OPERATOR: 'Gate Operator',
  };

  // Rate limiting
  useEffect(() => {
    if (submitAttempts > 3) {
      const timer = setTimeout(() => setSubmitAttempts(0), 30000);
      return () => clearTimeout(timer);
    }
  }, [submitAttempts]);

  // Form validation with proper Zod error handling
  const validationErrors = useMemo(() => {
    try {
      registerFormSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err: ZodIssue) => {
          if (err.path && err.path[0] && typeof err.path[0] === 'string') {
            errors[err.path[0]] = err.message;
          }
        });
        return errors;
      }
      return { general: 'Validation failed' };
    }
  }, [formData]);

  const validateForm = useCallback(() => {
    const isValid = Object.keys(validationErrors).length === 0;
    setFormErrors(validationErrors);
    return isValid;
  }, [validationErrors]);

  const debouncedValidate = useMemo(
    () => debounce(() => validateForm(), 300),
    [validateForm]
  );

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      debouncedValidate();
    }
    return () => debouncedValidate.cancel();
  }, [formData, debouncedValidate, formErrors]);

  // Real-time password match validation
  useEffect(() => {
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
    } else if (formErrors.confirmPassword === 'Passwords do not match') {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  }, [formData.password, formData.confirmPassword, formErrors.confirmPassword]);

  const handleInputChange = useCallback(
    (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const isRetryableError = (error: unknown): boolean => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('429') ||
      errorMessage.includes('too many requests')
    );
  };

  const extractErrorCode = (error: unknown): string => {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('network')) return 'network-error';
      if (message.includes('timeout')) return 'timeout';
      if (message.includes('429') || message.includes('too many')) return '429';

      // Check for Firebase/auth error patterns
      const firebaseMatch = message.match(/auth\/([a-z-]+)/);
      if (firebaseMatch) return firebaseMatch[0];
    }
    return 'unknown-error';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSubmitError('');

    if (submitAttempts > 3) {
      setLocalError(
        'Too many attempts. Please wait 30 seconds before trying again.'
      );
      return;
    }

    if (!validateForm()) {
      setSubmitAttempts((prev) => prev + 1);
      return;
    }

    try {
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        termsAccepted: formData.termsAccepted,
        ...(role === 'ORGANIZER' && { company: formData.company }),
      };

      await onSubmit(apiData);
      setSubmitAttempts(0);
      localStorage.removeItem('registerFormData');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Registration failed';

      if (isRetryableError(err) && submitAttempts < 2) {
        // Auto-retry for retryable errors with exponential backoff
        setTimeout(
          () => {
            const syntheticEvent = {
              preventDefault: () => {},
            } as React.FormEvent;
            handleSubmit(syntheticEvent);
          },
          1000 * Math.pow(2, submitAttempts)
        );
      } else {
        setSubmitAttempts((prev) => prev + 1);
        setSubmitError(errorMessage);
      }
    }
  };

  // Form persistence with localStorage
  useEffect(() => {
    const savedFormData = localStorage.getItem('registerFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData({
          ...parsedData,
          role: role, // Always use the prop role
        });
      } catch (e) {
        console.error('Failed to parse saved form data', e);
        localStorage.removeItem('registerFormData');
      }
    }
  }, [role]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('registerFormData', JSON.stringify(formData));
      } catch (e) {
        console.error('Failed to save form data', e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData]);

  // Combine parent error, local error, and submit error
  const displayError = error || localError || submitError;
  const errorCode = displayError
    ? extractErrorCode(new Error(displayError))
    : undefined;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      data-testid="register-form"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {registerText.title} - {roleDisplayNames[role]}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {registerText.description}
      </p>

      <div aria-live="polite" aria-atomic="true">
        {displayError && (
          <AuthError
            error={displayError}
            code={errorCode}
            onDismiss={() => {
              setLocalError('');
              setSubmitError('');
            }}
            onRetry={() => {
              const syntheticEvent = {
                preventDefault: () => {},
              } as React.FormEvent;
              handleSubmit(syntheticEvent);
            }}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {registerText.nameLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCircleIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              aria-invalid={!!formErrors.name}
              aria-errormessage={formErrors.name ? 'name-error' : undefined}
              aria-describedby="name-help"
              data-testid="name-input"
            />
          </div>

          {formErrors.name && (
            <ErrorMessage id="name-error" message={formErrors.name} />
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {registerText.emailLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              aria-invalid={!!formErrors.email}
              aria-errormessage={formErrors.email ? 'email-error' : undefined}
              aria-describedby="email-help"
              data-testid="email-input"
            />
          </div>
          <FieldHelpText
            id="email-help"
            text="We'll never share your email with anyone else"
          />
          {formErrors.email && (
            <ErrorMessage id="email-error" message={formErrors.email} />
          )}
        </div>

        {/* Phone Input */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {registerText.phoneLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              aria-invalid={!!formErrors.phone}
              aria-errormessage={formErrors.phone ? 'phone-error' : undefined}
              aria-describedby="phone-help"
              data-testid="phone-input"
            />
          </div>

          {formErrors.phone && (
            <ErrorMessage id="phone-error" message={formErrors.phone} />
          )}
        </div>

        {/* Company Input for Organizers */}
        {role === 'ORGANIZER' && (
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Company Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="company"
                name="company"
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                aria-describedby="company-help"
                data-testid="company-input"
              />
            </div>
            <FieldHelpText
              id="company-help"
              text="The name of your organization or company"
            />
          </div>
        )}

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {registerText.passwordLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="********"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              aria-invalid={!!formErrors.password}
              aria-errormessage={
                formErrors.password ? 'password-error' : undefined
              }
              data-testid="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              data-testid="toggle-password-visibility"
            >
              {showPassword ? (
                <EyeSlashIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <ErrorMessage id="password-error" message={formErrors.password} />
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              minLength={8}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange('confirmPassword', e.target.value)
              }
              aria-invalid={!!formErrors.confirmPassword}
              aria-errormessage={
                formErrors.confirmPassword ? 'confirmPassword-error' : undefined
              }
              aria-describedby="confirm-password-help"
              data-testid="confirm-password-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
              data-testid="toggle-confirm-password-visibility"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>
          <FieldHelpText
            id="confirm-password-help"
            text="Re-enter your password to confirm"
          />
          {formErrors.confirmPassword && (
            <ErrorMessage
              id="confirmPassword-error"
              message={formErrors.confirmPassword}
            />
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            checked={formData.termsAccepted}
            onChange={(e) =>
              handleInputChange('termsAccepted', e.target.checked)
            }
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
            aria-invalid={!!formErrors.termsAccepted}
            aria-errormessage={
              formErrors.termsAccepted ? 'terms-error' : undefined
            }
            data-testid="terms-checkbox"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            {registerText.termsText}{' '}
            <a
              href="/terms"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              {registerText.termsLink}
            </a>{' '}
            {registerText.andText}{' '}
            <a
              href="/privacy"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              {registerText.privacyLink}
            </a>
          </label>
        </div>
        {formErrors.termsAccepted && (
          <ErrorMessage id="terms-error" message={formErrors.termsAccepted} />
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || !formData.termsAccepted || submitAttempts > 3}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          aria-label={loading ? 'Creating account...' : 'Create your account'}
          aria-busy={loading}
          aria-live="polite"
          data-testid="submit-button"
        >
          {loading ? (
            <span
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            ></span>
          ) : submitAttempts > 3 ? (
            'Please wait...'
          ) : (
            <>
              {registerText.createAccount}
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </>
          )}
        </motion.button>

        {/* Social Login */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          <GoogleButton />
        </div>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {registerText.haveAccount}{' '}
          <a
            href="/auth/login"
            className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            {registerText.signIn}
          </a>
        </p>
      </div>
    </div>
  );
}
