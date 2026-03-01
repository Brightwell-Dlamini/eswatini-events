'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import AuthLayout from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { RegisterIllustration } from '@/components/auth/RegisterIllustration';
import { RegisterApiData } from '@/lib/validation';
import { UserRole } from '@/lib/types';

export default function Register() {
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const role: UserRole = 'ATTENDEE';
  const handleSubmit = async (formData: RegisterApiData) => {
    setError('');
    try {
      await register(formData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full md:w-1/2">
        <RegisterForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          role={role}
        />
      </div>
      <RegisterIllustration />
    </AuthLayout>
  );
}
