'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDynamicPricing } from '@/hooks/useDynamicPricing';
import { TicketTypeConfig } from '@/types/schema';

interface DynamicPricingAdjusterProps {
  ticket: TicketTypeConfig;
}

export const DynamicPricingAdjuster: React.FC<DynamicPricingAdjusterProps> = ({
  ticket,
}) => {
  const [manualPrice, setManualPrice] = useState(ticket.price);
  const dynamicPrice = useDynamicPricing(ticket.id, ticket.price);

  const handlePriceAdjust = (value: number) => {
    setManualPrice(value);
    console.log(`Adjusting price to SZL ${value}`);
    // Simulate API call
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Dynamic Pricing</h2>
      <p>Current Dynamic Price: SZL {dynamicPrice.toFixed(2)}</p>
      <p>
        Demand Heatmap:{' '}
        {ticket.sold / ticket.quantity > 0.8 ? 'High' : 'Moderate'}
      </p>
      <div className="mt-4">
        <label className="block text-lg">Adjust Price (SZL)</label>
        <input
          type="range"
          min={ticket.price * 0.5}
          max={ticket.price * 1.5}
          value={manualPrice}
          onChange={(e) => handlePriceAdjust(Number(e.target.value))}
          className="w-full"
        />
        <p>Selected Price: SZL {manualPrice.toFixed(2)}</p>
      </div>
      <button className="btn-primary mt-4">Apply Price</button>
    </motion.div>
  );
};
