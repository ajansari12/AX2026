import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedGradientMeshProps {
  className?: string;
}

export const AnimatedGradientMesh: React.FC<AnimatedGradientMeshProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-rose-50 to-amber-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />

      {/* Animated mesh blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-rose-300/70 to-pink-400/70 dark:from-rose-500/30 dark:to-pink-500/30 blur-[80px]"
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: '-20%', left: '-10%' }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-300/70 to-cyan-400/70 dark:from-blue-500/30 dark:to-cyan-500/30 blur-[80px]"
        animate={{
          x: [0, -80, -40, 0],
          y: [0, 80, 40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: '10%', right: '-5%' }}
      />

      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-emerald-300/70 to-teal-400/70 dark:from-emerald-500/30 dark:to-teal-500/30 blur-[80px]"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -60, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: '-15%', left: '20%' }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-amber-300/60 to-orange-400/60 dark:from-amber-500/25 dark:to-orange-500/25 blur-[80px]"
        animate={{
          x: [0, -40, 60, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: '20%', right: '10%' }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20 dark:from-gray-900/60 dark:via-transparent dark:to-gray-900/40" />
    </div>
  );
};

export default AnimatedGradientMesh;
