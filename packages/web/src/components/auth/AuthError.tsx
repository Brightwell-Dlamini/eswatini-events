import { motion } from 'framer-motion';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AuthErrorProps {
  error: string;
  code?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

const errorCodeMap: Record<string, string> = {
  'auth/invalid-credential': 'Invalid credentials',
  'auth/email-already-in-use': 'Email already registered',
  'auth/user-not-found': 'User not found',
  'auth/invalid-token': 'Session expired',
  'auth/operation-not-allowed': 'This operation is not allowed',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/requires-recent-login': 'Please sign in again to perform this action',
  'auth/invalid-email': 'Invalid email address',
  'auth/weak-password': 'Password is too weak',
  'auth/network-request-failed': 'Network error',
  'network-error': 'Network error',
  timeout: 'Request timeout',
  '429': 'Too many requests',
};

const actionableErrorMap: Record<string, string> = {
  'auth/email-already-in-use':
    'This email is already registered. Try signing in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password':
    'Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.',
  'auth/operation-not-allowed': 'Please contact support for assistance.',
  'auth/too-many-requests':
    'Too many attempts. Please wait a moment and try again.',
  'auth/requires-recent-login':
    'Your session has expired. Please sign in again.',
  'auth/network-request-failed':
    'Network connection failed. Please check your internet connection.',
  'network-error':
    'Network connection failed. Please check your internet connection.',
  timeout:
    'The request took too long. Please check your connection and try again.',
  '429': 'Too many attempts. Please wait 30 seconds before trying again.',
};

const retryableErrors = [
  'network-error',
  'auth/too-many-requests',
  'auth/network-request-failed',
  'timeout',
  '429',
];

export function AuthError({ error, code, onDismiss, onRetry }: AuthErrorProps) {
  const getErrorTitle = (errorCode?: string, originalError?: string) => {
    return (
      errorCodeMap[errorCode || ''] || originalError || 'Authentication error'
    );
  };

  const getActionableMessage = (errorCode?: string, originalError?: string) => {
    const defaultMessage =
      'Please try again or contact support if the problem persists.';
    return (
      actionableErrorMap[errorCode || ''] || originalError || defaultMessage
    );
  };

  const isRetryable = code && retryableErrors.includes(code);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded relative"
      role="alert"
      aria-live="polite"
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          aria-label="Dismiss error"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-start">
        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {getErrorTitle(code, error)}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            {getActionableMessage(code, error)}
          </p>
          {isRetryable && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:text-red-900 dark:hover:text-red-100"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
