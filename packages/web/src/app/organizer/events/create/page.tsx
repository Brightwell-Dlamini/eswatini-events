'use client';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

// Leaflet dynamic import (SSR disabled)
const MapWithNoSSR = dynamic(
  () =>
    import('react-leaflet').then((mod) => {
      const { MapContainer, TileLayer, Marker } = mod;
      return function Map({
        center,
        onClick,
      }: {
        center: [number, number];
        onClick: (lat: number, lng: number) => void;
      }) {
        return (
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
            className="z-0" // Fix z-index issues
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={center}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  onClick(lat, lng);
                },
                click: (e) => {
                  const { lat, lng } = e.latlng;
                  onClick(lat, lng);
                },
              }}
            />
          </MapContainer>
        );
      };
    }),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

const schema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().optional(),
  type: z.enum(['MUSIC', 'FESTIVAL', 'CONFERENCE', 'SPORTS', 'COMMUNITY']),
  startTime: z.string().min(1, 'Start time is required'),
  venue: z.object({
    name: z.string().min(1, 'Venue name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    capacity: z.number().min(1, 'Capacity must be greater than 0'),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
  }),
  isOnline: z.boolean(),
  dynamicPricing: z.boolean(),
  ticketTypes: z.array(
    z.object({
      name: z.string().min(1, 'Ticket name is required'),
      type: z.enum(['GENERAL_ADMISSION', 'VIP', 'EARLY_BIRD']),
      price: z.number().min(0, 'Price must be non-negative'),
      quantity: z.number().min(1, 'Quantity must be greater than 0'),
      isTransferable: z.boolean(),
      isRefundable: z.boolean(),
    })
  ),
  vendors: z.array(
    z.object({
      name: z.string().min(1, 'Vendor name is required'),
      commissionRate: z.number().min(0).max(100),
      booth: z.string().optional(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

const EventCreatePage: React.FC = () => {
  const router = useRouter();
  const { isOffline, saveOffline, syncOfflineData } = useOfflineStorage();
  const [step, setStep] = useState(1);
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ticketTypes: [],
      vendors: [],
      isOnline: false,
      dynamicPricing: false,
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data: FormData) => {
    const eventData = { ...data, id: `event-draft-${Date.now()}` };
    if (isOffline) {
      saveOffline(eventData.id, eventData);
      alert('Event saved offline. Will sync when online.');
    } else {
      await api.createEvent(eventData);
      await syncOfflineData();
    }
    router.push('/organizer/events');
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleMapClick = (lat: number, lng: number) => {
    setValue('venue.coordinates', { lat, lng });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Create Event</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Basic Info</h2>
              <div>
                <label className="block text-lg">Event Name</label>
                <input
                  {...register('name')}
                  className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                />
                {errors.name && (
                  <p className="text-red-400">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-lg">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                />
              </div>
              <div>
                <label className="block text-lg">Category</label>
                <select
                  {...register('type')}
                  className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                >
                  <option value="MUSIC">Music</option>
                  <option value="FESTIVAL">Festival</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="SPORTS">Sports</option>
                  <option value="COMMUNITY">Community</option>
                </select>
              </div>
              <div>
                <label className="block text-lg">Start Time</label>
                <input
                  type="datetime-local"
                  {...register('startTime')}
                  className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                />
                {errors.startTime && (
                  <p className="text-red-400">{errors.startTime.message}</p>
                )}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Venue & Logistics</h2>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isOnline')}
                    className="mr-2"
                  />
                  Online Event
                </label>
              </div>
              {!methods.watch('isOnline') && (
                <>
                  <div>
                    <label className="block text-lg">Venue Name</label>
                    <input
                      {...register('venue.name')}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.venue?.name && (
                      <p className="text-red-400">
                        {errors.venue.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">Address</label>
                    <input
                      {...register('venue.address')}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.venue?.address && (
                      <p className="text-red-400">
                        {errors.venue.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">City</label>
                    <input
                      {...register('venue.city')}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.venue?.city && (
                      <p className="text-red-400">
                        {errors.venue.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">Capacity</label>
                    <input
                      type="number"
                      {...register('venue.capacity', { valueAsNumber: true })}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.venue?.capacity && (
                      <p className="text-red-400">
                        {errors.venue.capacity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">Venue Location</label>
                    <div className="mt-2">
                      <MapWithNoSSR
                        center={[31.1333, -26.3167]} // Default to Mbabane
                        onClick={handleMapClick}
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Click or drag the marker to set location
                      </p>
                      {errors.venue?.coordinates && (
                        <p className="text-red-400">Location is required</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Ticket Types & Pricing
              </h2>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('dynamicPricing')}
                    className="mr-2"
                  />
                  Enable Dynamic Pricing
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setValue('ticketTypes', [
                    ...methods.watch('ticketTypes'),
                    {
                      name: '',
                      type: 'GENERAL_ADMISSION',
                      price: 0,
                      quantity: 0,
                      isTransferable: true,
                      isRefundable: true,
                    },
                  ])
                }
                className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-4 py-2 rounded-full"
              >
                Add Ticket Type
              </button>
              {methods.watch('ticketTypes').map((_, index) => (
                <div key={index} className="space-y-2 border-t pt-4">
                  <div>
                    <label className="block text-lg">Ticket Name</label>
                    <input
                      {...register(`ticketTypes.${index}.name`)}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.ticketTypes?.[index]?.name && (
                      <p className="text-red-400">
                        {errors.ticketTypes[index].name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">Type</label>
                    <select
                      {...register(`ticketTypes.${index}.type`)}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    >
                      <option value="GENERAL_ADMISSION">
                        General Admission
                      </option>
                      <option value="VIP">VIP</option>
                      <option value="EARLY_BIRD">Early Bird</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg">Price (SZL)</label>
                    <input
                      type="number"
                      {...register(`ticketTypes.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.ticketTypes?.[index]?.price && (
                      <p className="text-red-400">
                        {errors.ticketTypes[index].price.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">Quantity</label>
                    <input
                      type="number"
                      {...register(`ticketTypes.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.ticketTypes?.[index]?.quantity && (
                      <p className="text-red-400">
                        {errors.ticketTypes[index].quantity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register(`ticketTypes.${index}.isTransferable`)}
                        className="mr-2"
                      />
                      Transferable
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register(`ticketTypes.${index}.isRefundable`)}
                        className="mr-2"
                      />
                      Refundable
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Vendor Management</h2>
              <button
                type="button"
                onClick={() =>
                  setValue('vendors', [
                    ...methods.watch('vendors'),
                    { name: '', commissionRate: 0, booth: '' },
                  ])
                }
                className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-4 py-2 rounded-full"
              >
                Add Vendor
              </button>
              {methods.watch('vendors').map((_, index) => (
                <div key={index} className="space-y-2 border-t pt-4">
                  <div>
                    <label className="block text-lg">Vendor Name</label>
                    <input
                      {...register(`vendors.${index}.name`)}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.vendors?.[index]?.name && (
                      <p className="text-red-400">
                        {errors.vendors[index].name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">Commission Rate (%)</label>
                    <input
                      type="number"
                      {...register(`vendors.${index}.commissionRate`, {
                        valueAsNumber: true,
                      })}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                    {errors.vendors?.[index]?.commissionRate && (
                      <p className="text-red-400">
                        {errors.vendors[index].commissionRate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg">Booth Assignment</label>
                    <input
                      {...register(`vendors.${index}.booth`)}
                      className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Review & Publish</h2>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <p>
                  <strong>Name:</strong> {methods.watch('name')}
                </p>
                <p>
                  <strong>Type:</strong> {methods.watch('type')}
                </p>
                <p>
                  <strong>Start Time:</strong> {methods.watch('startTime')}
                </p>
                {!methods.watch('isOnline') && (
                  <>
                    <p>
                      <strong>Venue:</strong> {methods.watch('venue.name')},{' '}
                      {methods.watch('venue.city')}
                    </p>
                    <p>
                      <strong>Capacity:</strong>{' '}
                      {methods.watch('venue.capacity')}
                    </p>
                  </>
                )}
                <p>
                  <strong>Ticket Types:</strong>{' '}
                  {methods.watch('ticketTypes').length}
                </p>
                <p>
                  <strong>Vendors:</strong> {methods.watch('vendors').length}
                </p>
                <p>
                  <strong>Dynamic Pricing:</strong>{' '}
                  {methods.watch('dynamicPricing') ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-6 py-3 rounded-full"
                >
                  Publish Now
                </button>
                <button
                  type="submit"
                  onClick={() => console.log('Scheduling publish')}
                  className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-full"
                >
                  Schedule Later
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-full"
              >
                Previous
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                onClick={nextStep}
                className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-4 py-2 rounded-full"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </motion.div>
  );
};

export default EventCreatePage;
