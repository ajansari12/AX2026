import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { trackEvent } from '../../lib/analytics';

interface PreviewEmailCaptureProps {
  productSlug: string;
  ctaLabel: string;
  ctaPrice: string;
  headline?: string;
  subtext?: string;
  quizData?: Record<string, unknown>;
  onCheckout: (email: string) => void;
}

const getVisitorId = (): string => {
  const key = 'axrategy_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export const PreviewEmailCapture: React.FC<PreviewEmailCaptureProps> = ({
  productSlug,
  ctaLabel,
  ctaPrice,
  headline = 'Your free preview ends here.',
  subtext = 'Enter your email to save your results and unlock the full experience.',
  quizData,
  onCheckout,
}) => {
  const [email, setEmail] = useState('');
  const [captured, setCaptured] = useState(false);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setCaptured(true);
    trackEvent('preview_email_captured', { category: 'product_preview', label: productSlug });
    supabase.from('preview_leads').insert({
      product_slug: productSlug,
      email: email.trim().toLowerCase(),
      quiz_data: quizData || {},
    });
    supabase.from('product_events').insert({
      event_type: 'preview_email_captured',
      product_slug: productSlug,
      visitor_id: getVisitorId(),
      metadata: { email: email.trim().toLowerCase() },
    });
  };

  const handlePurchase = () => {
    trackEvent('preview_purchase_initiated', { category: 'product_preview', label: productSlug });
    supabase.from('product_events').insert({
      event_type: 'preview_purchase_initiated',
      product_slug: productSlug,
      visitor_id: getVisitorId(),
      metadata: { email },
    });
    onCheckout(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-xl"
    >
      <p className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{headline}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{subtext}</p>

      {!captured ? (
        <form onSubmit={handleCapture} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to save results"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm whitespace-nowrap flex items-center gap-2"
          >
            <Check size={16} />
            Save Results
          </button>
        </form>
      ) : (
        <button
          onClick={handlePurchase}
          className="w-full py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2"
        >
          {ctaLabel} -- {ctaPrice}
          <ArrowRight size={18} />
        </button>
      )}
    </motion.div>
  );
};
