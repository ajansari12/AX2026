import React, { useState } from 'react';
import { useNewsletter } from '../hooks/useNewsletter';
import { Mail, CheckCircle2 } from 'lucide-react';

export const InlineBlogCTA: React.FC = () => {
  const { subscribe, isSubmitting } = useNewsletter();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    const result = await subscribe(email, 'blog-inline');
    if (result.success) {
      setSuccess(true);
      setEmail('');
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          You're subscribed!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          We'll send you our latest insights and strategies.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-3">
        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Get more like this
        </h3>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
        Join our newsletter for actionable insights on AI, automation, and growth.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Subscribe'}
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <p className="text-gray-400 text-xs mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
};
