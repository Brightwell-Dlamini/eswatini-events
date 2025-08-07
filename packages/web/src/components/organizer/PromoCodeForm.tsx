import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

const promoSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().min(0, 'Discount must be non-negative'),
  usageLimit: z.number().min(1, 'Usage limit must be at least 1'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
});

type PromoFormData = z.infer<typeof promoSchema>;

export const PromoCodeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromoFormData>({
    resolver: zodResolver(promoSchema),
  });

  const onSubmit = (data: PromoFormData) => {
    console.log('Creating promo code:', data);
    // Simulate API call
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Promo Code Generator</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-lg">Code</label>
          <input
            {...register('code')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.code && <p className="text-red-400">{errors.code.message}</p>}
        </div>
        <div>
          <label className="block text-lg">Discount Type</label>
          <select
            {...register('discountType')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select>
        </div>
        <div>
          <label className="block text-lg">Discount Value</label>
          <input
            type="number"
            {...register('discountValue', { valueAsNumber: true })}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.discountValue && (
            <p className="text-red-400">{errors.discountValue.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Usage Limit</label>
          <input
            type="number"
            {...register('usageLimit', { valueAsNumber: true })}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.usageLimit && (
            <p className="text-red-400">{errors.usageLimit.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Expiry Date</label>
          <input
            type="date"
            {...register('expiryDate')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.expiryDate && (
            <p className="text-red-400">{errors.expiryDate.message}</p>
          )}
        </div>
        <button type="submit" className="btn-primary">
          Create Promo Code
        </button>
      </form>
    </motion.div>
  );
};
