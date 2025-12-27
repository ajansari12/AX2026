import React from 'react';
import { motion } from 'framer-motion';

export const NotFoundIllustration: React.FC = () => {
  return (
    <div className="relative w-80 h-80 mx-auto mb-8">
      {/* Floating background blobs */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-900/30 dark:to-pink-900/30 blur-xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: '10%', left: '5%' }}
      />
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-900/30 dark:to-indigo-900/30 blur-xl"
        animate={{
          x: [0, -15, 0],
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: '60%', right: '10%' }}
      />
      <motion.div
        className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-900/30 dark:to-teal-900/30 blur-xl"
        animate={{
          x: [0, 10, 0],
          y: [0, 10, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: '15%', left: '20%' }}
      />

      {/* Main 404 container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Animated orbit ring */}
          <motion.div
            className="absolute inset-0 w-64 h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ top: '-32px', left: '-32px' }}
          />

          {/* Center content */}
          <div className="relative z-10 w-48 h-48 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center">
            {/* Confused face */}
            <motion.div
              className="text-6xl mb-2"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-gray-300 dark:text-gray-600 select-none">?</span>
            </motion.div>

            {/* 404 text */}
            <div className="flex items-center gap-1">
              <motion.span
                className="text-4xl font-bold text-gray-900 dark:text-white"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              >
                4
              </motion.span>
              <motion.span
                className="text-4xl font-bold text-red-500"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              >
                0
              </motion.span>
              <motion.span
                className="text-4xl font-bold text-gray-900 dark:text-white"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              >
                4
              </motion.span>
            </div>
          </div>

          {/* Orbiting elements */}
          <motion.div
            className="absolute w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg shadow-lg flex items-center justify-center"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ top: '-20px', left: '50%', marginLeft: '-16px' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-white text-xs font-bold">/</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ bottom: '-10px', right: '-10px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundIllustration;
