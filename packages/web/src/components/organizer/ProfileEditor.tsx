import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .regex(/^\+268\d{7}$/, 'Invalid Eswatini phone number (+268)'),
});

type FormData = z.infer<typeof schema>;

export const ProfileEditor: React.FC = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });
  const onSubmit = (data: FormData) => {
    console.log('Updating profile:', data);
    // Simulate API call
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-lg">Name</label>
          <input
            {...register('name')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        </div>
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
          <label className="block text-lg">Phone (+268)</label>
          <input
            {...register('phone')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.phone && (
            <p className="text-red-400">{errors.phone.message}</p>
          )}
        </div>
        <button type="submit" className="btn-primary">
          Save Profile
        </button>
      </form>
    </motion.div>
  );
};
