import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
// import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  billingName: z.string().min(1, 'Billing name is required'),
  billingAddress: z.string().min(1, 'Billing address is required'),
  paymentMethod: z.enum(['CARD', 'MOBILE_MONEY', 'BANK_TRANSFER']),
});

type FormData = z.infer<typeof schema>;

export const BillingInfo: React.FC = () => {
  // const { hasPermission } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      billingName: '',
      billingAddress: '',
      paymentMethod: 'CARD',
    },
  });

  // if (!hasPermission('MANAGE_BILLING')) {
  //   return (
  //     <div className="text-center text-red-400">
  //       Access Denied: Insufficient permissions
  //     </div>
  //   );
  // }

  const onSubmit = (data: FormData) => {
    console.log('Updating billing info:', data);
    // Simulate API call
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-lg">Billing Name</label>
          <input
            {...register('billingName')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.billingName && (
            <p className="text-red-400">{errors.billingName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Billing Address</label>
          <input
            {...register('billingAddress')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.billingAddress && (
            <p className="text-red-400">{errors.billingAddress.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Payment Method</label>
          <select
            {...register('paymentMethod')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          >
            <option value="CARD">Credit Card</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Save Billing Info
        </button>
      </form>
    </motion.div>
  );
};
