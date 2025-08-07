import Link from 'next/link';
import { motion } from 'framer-motion';
import { Vendor } from '@/types/schema';

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const handleApprove = () => {
    console.log(`Approving vendor ${vendor.id}`);
    // Simulate API call
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center"
    >
      <div>
        <h3 className="text-xl font-semibold">{vendor.name}</h3>
        <p>Sales: SZL {vendor.sales.toLocaleString()}</p>
        <p>Inventory: {vendor.inventory}</p>
        <p>Status: {vendor.isApproved ? 'Approved' : 'Pending'}</p>
        <p>Fraud Score: {(vendor.fraudScore * 100).toFixed(1)}%</p>
      </div>
      <div className="flex gap-4 mt-4 sm:mt-0">
        {!vendor.isApproved && (
          <button
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full"
          >
            Approve
          </button>
        )}
        <Link
          href={`/organizer/vendors/${vendor.id}`}
          className="bg-[rgb(255,109,0)] hover:bg-[rgb(200,85,0)] px-4 py-2 rounded-full"
        >
          Details
        </Link>
      </div>
    </motion.div>
  );
};
