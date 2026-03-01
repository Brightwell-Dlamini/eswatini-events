import { AboutStats } from '@/lib/mockData';
import { motion } from 'framer-motion';

export const StatsSection = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trusted by Eswatini&apos;s Event Community
          </h2>
          <p className="mt-3 text-xl text-blue-100">
            Our numbers tell the story of a platform built for and by Eswatini.
          </p>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {AboutStats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: stat.id * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold text-white">{stat.value}</div>
              <div className="mt-2 text-blue-100">{stat.name}</div>
              <div className="mt-1 text-sm text-green-300 flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
                {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
