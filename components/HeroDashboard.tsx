import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const AnimatedLogo: React.FC = () => {
  const letters = [
    { char: 'A', isRed: true },
    { char: 'X', isRed: true },
    { char: 'R', isRed: false },
    { char: 'A', isRed: false },
    { char: 'T', isRed: false },
    { char: 'E', isRed: false },
    { char: 'G', isRed: false },
    { char: 'Y', isRed: false },
  ];

  return (
    <div className="flex items-center justify-center gap-0.5">
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.3 + index * 0.06,
            ease: 'easeOut',
          }}
          className={`text-xl font-bold tracking-tight ${
            letter.isRed
              ? 'text-red-600'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {letter.char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.9 }}
        className="ml-2 w-2 h-2 rounded-full bg-emerald-500"
      />
    </div>
  );
};

const AnimatedCounter: React.FC<{ target: number; delay: number }> = ({ target, delay }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
      {count.toLocaleString()}
    </span>
  );
};

const AnimatedBar: React.FC<{ height: number; index: number; isHighest: boolean }> = ({
  height,
  index,
  isHighest
}) => {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: `${height}%` }}
      transition={{
        duration: 0.6,
        delay: 1.0 + index * 0.1,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={`flex-1 rounded-md transition-all duration-300 hover:opacity-30 ${
        isHighest
          ? 'bg-gradient-to-t from-gray-900 to-red-900/60 dark:from-white/80 dark:to-red-400/40 opacity-15'
          : 'bg-gray-900 dark:bg-white/80 opacity-8'
      }`}
    />
  );
};

export const HeroDashboard: React.FC = () => {
  const barHeights = [40, 60, 45, 70, 85, 60, 75];
  const maxHeight = Math.max(...barHeights);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative hidden lg:block h-[640px]"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.5,
          }}
          className="w-full h-full bg-gradient-to-tr from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-[48px] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
          <div className="p-10 space-y-8">
            <div className="flex justify-between items-center mb-8">
              <AnimatedLogo />
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="relative"
              >
                <div className="h-10 w-10 bg-gray-100/80 dark:bg-white/10 rounded-full" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"
                />
              </motion.div>
            </div>

            <div className="flex gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                className="w-2/3 h-56 bg-blue-50/80 dark:bg-blue-500/10 rounded-3xl border border-blue-100 dark:border-blue-500/20 p-8 flex flex-col justify-between shadow-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7, type: 'spring' }}
                  className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
                >
                  <Zap size={20} />
                </motion.div>
                <div>
                  <div className="h-10 flex items-center mb-3">
                    <AnimatedCounter target={2847} delay={1.2} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Leads Automated
                  </div>
                </div>
              </motion.div>

              <div className="w-1/3 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
                  className="h-24 bg-white/70 dark:bg-white/5 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm flex items-center justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-center"
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-white">98%</div>
                    <div className="text-xs text-gray-400">Response Rate</div>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9, ease: 'easeOut' }}
                  className="h-24 bg-white/70 dark:bg-white/5 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm flex items-center justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center"
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-white">+42%</div>
                    <div className="text-xs text-gray-400">Conversions</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="h-72 bg-gray-50/80 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-inner"
            >
              <div className="flex items-end gap-3 h-full pb-4 px-2">
                {barHeights.map((h, i) => (
                  <AnimatedBar
                    key={i}
                    height={h}
                    index={i}
                    isHighest={h === maxHeight}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
