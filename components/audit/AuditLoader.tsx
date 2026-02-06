import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, BarChart3, ShieldCheck, FileText } from 'lucide-react';

const STEPS = [
  { label: 'Connecting to server...', icon: Globe },
  { label: 'Scanning pages...', icon: Search },
  { label: 'Analyzing performance...', icon: BarChart3 },
  { label: 'Checking SEO & accessibility...', icon: ShieldCheck },
  { label: 'Generating report...', icon: FileText },
];

interface AuditLoaderProps {
  phaseLabel: string;
}

export const AuditLoader: React.FC<AuditLoaderProps> = ({ phaseLabel }) => {
  const activeIndex = STEPS.findIndex((s) => s.label === phaseLabel);

  return (
    <div className="max-w-md mx-auto py-16">
      <div className="relative mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Search className="w-8 h-8 text-gray-900 dark:text-white" />
          </motion.div>
        </div>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isComplete = idx < activeIndex;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : isComplete
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{step.label}</span>
              {isActive && (
                <motion.div
                  className="ml-auto flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
              {isComplete && (
                <motion.svg
                  className="w-4 h-4 ml-auto"
                  viewBox="0 0 16 16"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <path
                    d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                    fill="currentColor"
                  />
                </motion.svg>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
