'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { VendorCard } from '@/components/organizer/VendorCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Vendor } from '@/types/schema'; // Make sure to import your Vendor type

const VendorHub: React.FC = () => {
  const [eventId, setEventId] = useState('');
  const {
    data: vendors = [], // Provide default empty array
    isLoading,
    error,
  } = useQuery<Vendor[]>({
    queryKey: ['vendors', eventId],
    queryFn: () => api.getVendors(eventId),
    enabled: !!eventId, // Only run query when eventId is present
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading vendors</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Vendor Coordination</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Filter by Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="p-2 rounded bg-white bg-opacity-10 text-white flex-grow"
        />
        <Link
          href="/organizer/vendors/create"
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full"
        >
          Invite Vendor
        </Link>
      </div>
      <div className="space-y-4">
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        ) : (
          <div className="text-center py-8">No vendors found</div>
        )}
      </div>
    </motion.div>
  );
};

export default VendorHub;
