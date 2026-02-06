import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatRatingWidgetProps {
  onRate: (rating: 'positive' | 'negative', feedback?: string) => void;
}

export const ChatRatingWidget: React.FC<ChatRatingWidgetProps> = ({ onRate }) => {
  const [rated, setRated] = useState<'positive' | 'negative' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleRate = (rating: 'positive' | 'negative') => {
    setRated(rating);
    if (rating === 'negative') {
      setShowFeedback(true);
    } else {
      onRate(rating);
    }
  };

  const handleFeedbackSubmit = () => {
    onRate('negative', feedback);
    setShowFeedback(false);
  };

  if (rated === 'positive') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>Thanks for your feedback!</span>
      </motion.div>
    );
  }

  if (rated === 'negative' && !showFeedback) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>Thanks for your feedback!</span>
      </motion.div>
    );
  }

  if (showFeedback) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What could we improve?"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none"
          rows={2}
        />
        <button
          onClick={handleFeedbackSubmit}
          className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium"
        >
          Submit
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <span className="text-xs text-gray-500 dark:text-gray-400">Was this helpful?</span>
      <div className="flex gap-1">
        <button
          onClick={() => handleRate('positive')}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-emerald-500 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleRate('negative')}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
