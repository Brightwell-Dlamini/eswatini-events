import { motion } from 'framer-motion';

interface ValuePropCardProps {
  title: string;
  description: string;
}

export const ValuePropCard: React.FC<ValuePropCardProps> = ({
  title,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white bg-opacity-10 p-6 rounded-lg text-center"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};
