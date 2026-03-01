import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { timelineItems } from '@/lib/mockData';

export const OurStory = () => {
  return (
    <div className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Our Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Reclaiming Eswatini&apos;s{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Event Industry
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300"
          >
            <p className="mb-6">
              Founded in 2025, Eswa Tickets was born from a vision to create a
              ticketing platform that truly understands and serves the unique
              needs of Eswatini&apos;s event ecosystem.
            </p>
            <p className="mb-6">
              While foreign platforms dominated the market with high fees and
              poor localization, we saw an opportunity to build something better
              - a platform that empowers all stakeholders with inclusive,
              secure, and innovative tools.
            </p>
            <p>
              From our first pilot with Sidvokodvo Riders to powering major
              events like MTN Bushfire, we&apos;ve remained committed to our
              mission of making event access seamless for everyone.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="mt-16">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8"
          >
            Our Milestones
          </motion.h3>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 h-full w-0.5 bg-blue-200 dark:bg-blue-900 transform -translate-x-1/2"></div>

            {/* Timeline items */}
            <div className="space-y-8">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}
                  >
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        index % 2 === 0
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}
                    >
                      {item.year}
                    </div>
                    <h4 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 dark:border-blue-400 flex items-center justify-center z-10">
                    <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
