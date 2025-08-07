'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organizationName: z.string().min(1, 'Organization name is required'),
  phone: z.string(),
  // .regex(/^\+268\d{7}$/, 'Invalid Eswatini phone number (+268)'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Registering:', data);
    // Simulate API call
    router.push('/organizer/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg w-full"
      >
        <h1 className="text-3xl font-bold mb-8">Register as Organizer</h1>
        <div>
          <label className="block text-lg">Email</label>
          <input
            {...register('email')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Organization Name</label>
          <input
            {...register('organizationName')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.organizationName && (
            <p className="text-red-400">{errors.organizationName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Phone (+268)</label>
          <input
            {...register('phone')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.phone && (
            <p className="text-red-400">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" {...register('terms')} className="mr-2" />
            Accept Terms
          </label>
          {errors.terms && (
            <p className="text-red-400">{errors.terms.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-6 py-3 rounded-full w-full"
        >
          Register
        </button>
        <p className="text-center">
          Already have an account?{' '}
          <Link href="/organizer/login" className="text-[rgb(255,109,0)]">
            Login
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

export default RegisterPage;
