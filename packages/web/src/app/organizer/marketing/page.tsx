'use client';
import { motion } from 'framer-motion';
import { PromoCodeForm } from '@/components/organizer/PromoCodeForm';
import { EmailCampaignForm } from '@/components/organizer/EmailCampaignForm';

const MarketingToolkit: React.FC = () => {
  const handleSocialShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
    // Simulate social media share
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold">Marketing Toolkit</h1>
      <PromoCodeForm />
      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Social Media Sharing</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleSocialShare('Facebook')}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
          >
            Share to Facebook
          </button>
          <button
            onClick={() => handleSocialShare('Instagram')}
            className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full"
          >
            Share to Instagram
          </button>
        </div>
      </div>
      <EmailCampaignForm />
    </motion.div>
  );
};

export default MarketingToolkit;
