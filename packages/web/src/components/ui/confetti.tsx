import { motion } from 'framer-motion';

const FloatingParticles = () => {
  return (
    <>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: -20,
            x: Math.random() * 100 - 50,
            rotate: Math.random() * 360,
          }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, Math.random() * 200 - 100],
            x: [0, Math.random() * 200 - 100],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
            delay: Math.random() * 5,
          }}
          className="absolute w-3 h-3 rounded-sm bg-gradient-to-r from-purple-400 to-pink-400 pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </>
  );
};

export default FloatingParticles;
