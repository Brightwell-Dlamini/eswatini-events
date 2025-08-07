'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

const schema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  name: z.string().min(1, 'Vendor name is required'),
  inventory: z.string().min(1, 'Inventory description is required'),
  commissionRate: z
    .number()
    .min(0)
    .max(100, 'Commission rate must be between 0 and 100'),
});

type FormData = z.infer<typeof schema>;

const VendorCreatePage: React.FC = () => {
  const router = useRouter();
  const { isOffline, saveOffline, syncOfflineData } = useOfflineStorage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const vendorData = {
      ...data,
      id: `vendor-draft-${Date.now()}`,
      isApproved: false,
      fraudScore: 0,
    };
    if (isOffline) {
      saveOffline(vendorData.id, vendorData);
      alert('Vendor saved offline. Will sync when online.');
    } else {
      await api.createVendor(vendorData);
      await syncOfflineData();
    }
    router.push('/organizer/vendors');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Invite Vendor</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-lg">Event ID</label>
          <input
            {...register('eventId')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.eventId && (
            <p className="text-red-400">{errors.eventId.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Vendor Name</label>
          <input
            {...register('name')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-lg">Inventory Description</label>
          <textarea
            {...register('inventory')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.inventory && (
            <p className="text-red-400">{errors.inventory.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Commission Rate (%)</label>
          <input
            type="number"
            {...register('commissionRate', { valueAsNumber: true })}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.commissionRate && (
            <p className="text-red-400">{errors.commissionRate.message}</p>
          )}
        </div>
        <button type="submit" className="btn-primary">
          Invite Vendor
        </button>
      </form>
    </motion.div>
  );
};

export default VendorCreatePage;
