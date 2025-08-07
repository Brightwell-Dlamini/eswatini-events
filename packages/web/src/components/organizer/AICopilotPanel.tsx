import { motion } from 'framer-motion';

export const AICopilotPanel: React.FC = () => {
  const suggestions = [
    'Optimal event time: Friday 6 PM',
    'Increase VIP price by 10% based on demand',
    'Target Mbabane audience with Instagram ads',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">AI Copilot (Coming Soon)</h2>
      <p>Voice-activated suggestions for event optimization.</p>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-gray-300">
            {suggestion}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
