import React from 'react';
import { motion } from 'framer-motion';
import { X, Bot } from 'lucide-react';

interface ProactiveGreetingProps {
  message: string;
  onDismiss: () => void;
  onClick: () => void;
}

export const ProactiveGreeting: React.FC<ProactiveGreetingProps> = ({
  message,
  onDismiss,
  onClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.9 }}
    className="fixed bottom-24 right-6 z-40 max-w-[300px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-4 cursor-pointer"
    onClick={onClick}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDismiss();
      }}
      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
    >
      <X className="w-3 h-3" />
    </button>
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white dark:text-gray-900" />
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  </motion.div>
);
