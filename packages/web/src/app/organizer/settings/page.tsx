'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ProfileEditor } from '@/components/organizer/ProfileEditor';
import { NotificationPrefs } from '@/components/organizer/NotificationPrefs';
import { BillingInfo } from '@/components/organizer/BillingInfo';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .regex(/^\+268\d{7}$/, 'Invalid Eswatini phone number (+268)'),
  language: z.enum(['ENGLISH', 'SISWATI', 'FRENCH', 'PORTUGUESE']),
});

type FormData = z.infer<typeof schema>;

const SettingsPage: React.FC = () => {
  const {
    formState: {},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'Siyabonga Dlamini',
      email: 'siyabonga@eswatickets.com',
      phone: '+26812345678',
      language: 'ENGLISH',
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Settings</h1>
      <ProfileEditor />
      <NotificationPrefs />
      <BillingInfo />
    </motion.div>
  );
};

export default SettingsPage;
