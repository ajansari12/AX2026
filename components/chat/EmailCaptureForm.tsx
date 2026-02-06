import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EmailCaptureFormProps {
  onSubmit: (email: string) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
  onSubmit,
  onSkip,
  isSubmitting,
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-xl p-4 space-y-3"
    >
      <p className="text-sm font-medium text-white dark:text-gray-900">
        Want a copy of this conversation?
      </p>
      <p className="text-xs text-gray-300 dark:text-gray-600">
        Enter your email and we'll send you a transcript.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 rounded-lg bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-900/20 text-sm text-white dark:text-gray-900 placeholder-gray-400 disabled:opacity-50"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 rounded-lg border border-white/20 dark:border-gray-900/20 text-sm text-white/80 dark:text-gray-700 hover:bg-white/10 dark:hover:bg-gray-900/10 disabled:opacity-50"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Transcript'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
