import { motion } from 'framer-motion';

export const ScrollIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8 }}
      className="absolute bottom-15 sm:bottom-5 left-1/2 transform -translate-x-1/2 z-30"
    >
      <motion.div
        className="animate-bounce flex flex-col items-center"
        whileHover={{ scale: 1.1 }}
        aria-label="Scroll down indicator"
      >
        <div className="flex items-end h-6 sm:h-8 gap-1">
          {[4, 6, 8, 6, 4].map((height, i) => (
            <motion.div
              key={i}
              animate={{
                height: [`${height}px`, `${height + 6}px`, `${height}px`],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className={`w-1.5 rounded-full ${
                i % 3 === 0
                  ? 'bg-blue-500'
                  : i % 3 === 1
                    ? 'bg-yellow-400'
                    : 'bg-red-600'
              }`}
            />
          ))}
        </div>
        <motion.p
          className="text-sm sm:text-md font-bold mt-2 text-white"
          whileHover={{ scale: 1.05 }}
        >
          Feel the rhythm!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
