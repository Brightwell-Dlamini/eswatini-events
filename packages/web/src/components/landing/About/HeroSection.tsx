import { motion, MotionValue } from 'framer-motion';

interface HeroSectionProps {
  yBg: MotionValue<string>;
}

export const HeroSection = ({ yBg }: HeroSectionProps) => {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900"
        style={{ y: yBg }}
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
              <span className="block">Where Africa</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                Celebrates
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0"
            >
              Eswatini Events is revolutionizing event management in Eswatini
              with world-class technology tailored for local needs.
            </motion.p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/events"
                  className="px-8 py-3 bg-white text-blue-900 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all"
                >
                  Browse Events
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/contact"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all"
                >
                  Contact Us
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrolling indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
