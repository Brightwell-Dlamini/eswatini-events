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
  biometric: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Logging in:', data);
    // Simulate API call
    router.push('/organizer/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Simulate social login
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
        <h1 className="text-3xl font-bold mb-8">Organizer Login</h1>
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
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('biometric')}
              className="mr-2"
            />
            Enable Biometric Login
          </label>
        </div>
        <button
          type="submit"
          className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-6 py-3 rounded-full w-full"
        >
          Login
        </button>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
          >
            Facebook
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="bg-black hover:bg-gray-800 px-4 py-2 rounded-full"
          >
            Apple
          </button>
        </div>
        <p className="text-center">
          Need an account?{' '}
          <Link href="/organizer/register" className="text-[rgb(255,109,0)]">
            Register
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

export default LoginPage;
