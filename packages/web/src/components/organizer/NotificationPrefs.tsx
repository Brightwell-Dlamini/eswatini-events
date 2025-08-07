import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

const schema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export const NotificationPrefs: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Updating notification preferences:', data);
    // Simulate API call
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('emailNotifications')}
              className="mr-2"
            />
            Email Notifications
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('smsNotifications')}
              className="mr-2"
            />
            SMS Notifications
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('pushNotifications')}
              className="mr-2"
            />
            Push Notifications
          </label>
        </div>
        <button type="submit" className="btn-primary">
          Save Preferences
        </button>
      </form>
    </motion.div>
  );
};
