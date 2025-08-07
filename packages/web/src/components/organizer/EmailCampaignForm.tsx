import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

const schema = z.object({
  template: z.enum(['WELCOME', 'PROMO', 'REMINDER']),
  audience: z.enum(['ALL', 'PURCHASERS', 'CHECKED_IN']),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
});

type FormData = z.infer<typeof schema>;

export const EmailCampaignForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Sending email campaign:', data);
    // Simulate API call
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Email Campaign</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-lg">Template</label>
          <select
            {...register('template')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          >
            <option value="WELCOME">Welcome</option>
            <option value="PROMO">Promotion</option>
            <option value="REMINDER">Reminder</option>
          </select>
        </div>
        <div>
          <label className="block text-lg">Audience</label>
          <select
            {...register('audience')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          >
            <option value="ALL">All Attendees</option>
            <option value="PURCHASERS">Ticket Purchasers</option>
            <option value="CHECKED_IN">Checked-in Attendees</option>
          </select>
        </div>
        <div>
          <label className="block text-lg">Subject</label>
          <input
            {...register('subject')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.subject && (
            <p className="text-red-400">{errors.subject.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Content</label>
          <textarea
            {...register('content')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white h-32"
          />
          {errors.content && (
            <p className="text-red-400">{errors.content.message}</p>
          )}
        </div>
        <button type="submit" className="btn-primary">
          Send Campaign
        </button>
      </form>
    </motion.div>
  );
};
