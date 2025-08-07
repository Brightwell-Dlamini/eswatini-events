'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { api } from '@/lib/api';

const schema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  name: z.string().min(1, 'Ticket name is required'),
  type: z.enum(['GENERAL_ADMISSION', 'VIP', 'EARLY_BIRD']),
  price: z.number().min(0, 'Price must be non-negative'),
  quantity: z.number().min(1, 'Quantity must be greater than 0'),
  isTransferable: z.boolean(),
  isRefundable: z.boolean(),
  dynamicPricing: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const TicketTypeCreatePage: React.FC = () => {
  const router = useRouter();
  const { isOffline, saveOffline, syncOfflineData } = useOfflineStorage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isTransferable: true,
      isRefundable: true,
      dynamicPricing: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    const ticketData = { ...data, id: `ticket-draft-${Date.now()}` };
    if (isOffline) {
      saveOffline(ticketData.id, ticketData);
      alert('Ticket type saved offline. Will sync when online.');
    } else {
      await api.createTicketType(ticketData);
      await syncOfflineData();
    }
    router.push('/organizer/tickets');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Create Ticket Type</h1>
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
          <label className="block text-lg">Ticket Name</label>
          <input
            {...register('name')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-lg">Type</label>
          <select
            {...register('type')}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          >
            <option value="GENERAL_ADMISSION">General Admission</option>
            <option value="VIP">VIP</option>
            <option value="EARLY_BIRD">Early Bird</option>
          </select>
        </div>
        <div>
          <label className="block text-lg">Price (SZL)</label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.price && (
            <p className="text-red-400">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg">Quantity</label>
          <input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
          />
          {errors.quantity && (
            <p className="text-red-400">{errors.quantity.message}</p>
          )}
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isTransferable')}
              className="mr-2"
            />
            Transferable
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isRefundable')}
              className="mr-2"
            />
            Refundable
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('dynamicPricing')}
              className="mr-2"
            />
            Dynamic Pricing
          </label>
        </div>
        <button
          type="submit"
          className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-6 py-3 rounded-full"
        >
          Create Ticket Type
        </button>
      </form>
    </motion.div>
  );
};

export default TicketTypeCreatePage;
