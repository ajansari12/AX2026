import React from 'react';
import { motion } from 'framer-motion';
import { PricingMode } from '../types';

interface PricingToggleProps {
  mode: PricingMode;
  onChange: (mode: PricingMode) => void;
}

export const PricingToggle: React.FC<PricingToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 flex">
        <motion.div
          className="absolute top-1.5 bottom-1.5 rounded-full bg-black dark:bg-white shadow-lg"
          initial={false}
          animate={{
            left: mode === 'one-time' ? '6px' : 'calc(50% + 2px)',
            width: 'calc(50% - 8px)'
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        <button
          onClick={() => onChange('one-time')}
          className={`relative z-10 px-6 py-3 rounded-full text-sm font-bold transition-colors ${
            mode === 'one-time'
              ? 'text-white dark:text-black'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Pay Once
        </button>
        <button
          onClick={() => onChange('monthly')}
          className={`relative z-10 px-6 py-3 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
            mode === 'monthly'
              ? 'text-white dark:text-black'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Monthly
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            mode === 'monthly'
              ? 'bg-emerald-500 text-white'
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            Lower Upfront
          </span>
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        {mode === 'one-time'
          ? 'One flat price, full ownership. You pay once and own everything forever.'
          : 'Lower upfront cost with ongoing partnership. We stay invested in your results.'
        }
      </p>
    </div>
  );
};
