'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuthLayout from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginIllustration } from '@/components/auth/LoginIllustration';
import { useAuth } from '@/contexts/auth-context';

const SuccessModal = dynamic(
  () =>
    import('@/components/auth/SuccessModal').then((mod) => mod.SuccessModal),
  {
    ssr: false,
  }
);

export default function Login() {
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (formData: {
    email?: string;
    phone?: string;
    password: string;
  }) => {
    setError('');
    try {
      await login(formData);
      setIsSuccess(true);
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <AuthLayout>
          <SuccessModal />
        </AuthLayout>
      </div>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full md:w-1/2">
        <LoginForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          setError={setError}
        />
      </div>
      <LoginIllustration />
    </AuthLayout>
  );
}
