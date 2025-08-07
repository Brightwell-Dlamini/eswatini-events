'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MusicalNoteIcon,
  FireIcon,
  CakeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const experiences = [
  {
    icon: <MusicalNoteIcon className="h-8 w-8" />,
    title: 'Live Music',
    description: 'From traditional Swazi rhythms to international headliners',
    stats: '200+ performances yearly',
  },
  {
    icon: <FireIcon className="h-8 w-8" />,
    title: 'Cultural Festivals',
    description: "Immerse yourself in Eswatini's rich heritage",
    stats: '12 major festivals annually',
  },
  {
    icon: <CakeIcon className="h-8 w-8" />,
    title: 'Food & Drink',
    description: 'Taste the flavors of Southern Africa',
    stats: '50+ food vendors at major events',
  },
  {
    icon: <GlobeAltIcon className="h-8 w-8" />,
    title: 'Adventure',
    description: 'Unique outdoor experiences with a cultural twist',
    stats: '15 adventure events monthly',
  },
];

const ExperienceSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Eswatini Experience
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            More than just events - discover the soul of the kingdom
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
            >
              <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-4 text-purple-600 dark:text-purple-400">
                {exp.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {exp.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {exp.description}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                {exp.stats}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="relative h-96">
            <Image
              src="/images/umhlanga.jpg"
              alt="Eswatini cultural performance"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Feel the Rhythm
                </h3>
                <p className="text-gray-200 max-w-2xl">
                  Our events are more than entertainment - they&apos;re a
                  connection to Eswatini&apos;s vibrant culture and community
                  spirit.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
