import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CallbackRequestFormProps {
  onSubmit: (data: { name: string; phone: string; preferredTime: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const CallbackRequestForm: React.FC<CallbackRequestFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('asap');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, preferredTime });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-medium text-gray-900 dark:text-white">Request a Callback</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        disabled={isSubmitting}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        required
        disabled={isSubmitting}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
      />
      <select
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
        disabled={isSubmitting}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white disabled:opacity-50"
      >
        <option value="asap">As soon as possible</option>
        <option value="morning">Morning (9am - 12pm)</option>
        <option value="afternoon">Afternoon (12pm - 5pm)</option>
        <option value="evening">Evening (5pm - 8pm)</option>
      </select>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Request Call'}
        </button>
      </div>
    </motion.form>
  );
};
