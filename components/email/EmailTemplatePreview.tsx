import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useEmailPreviews, EmailTemplate } from '../../hooks/useEmailPreviews';
import { trackEvent } from '../../lib/analytics';
import { supabase } from '../../lib/supabase';

interface EmailTemplatePreviewProps {
  onCheckout: (email: string) => void;
}

const INDUSTRIES = [
  { key: 'general', label: 'General' },
  { key: 'dental', label: 'Dental' },
  { key: 'legal', label: 'Legal' },
  { key: 'real_estate', label: 'Real Estate' },
];

const getVisitorId = (): string => {
  const key = 'axrategy_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ onCheckout }) => {
  const { templates, isLoading } = useEmailPreviews();
  const [activeIndustry, setActiveIndustry] = useState('general');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const filtered = useMemo(
    () => templates.filter((t) => t.industry === activeIndustry),
    [templates, activeIndustry]
  );

  const unlocked = filtered.filter((t) => !t.isLocked);
  const locked = filtered.filter((t) => t.isLocked);

  const handleIndustryChange = (key: string) => {
    setActiveIndustry(key);
    setExpandedId(null);
    trackEvent('templates_industry_changed', { category: 'product_preview', label: key });
    supabase.from('product_events').insert({
      event_type: 'template_industry_changed',
      product_slug: 'email-sequence-templates',
      visitor_id: getVisitorId(),
      metadata: { industry: key },
    });
  };

  const handlePurchase = () => {
    trackEvent('templates_purchase_initiated', { category: 'product_preview' });
    supabase.from('product_events').insert({
      event_type: 'templates_purchase_initiated',
      product_slug: 'email-sequence-templates',
      visitor_id: getVisitorId(),
      metadata: { email },
    });
    onCheckout(email);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind.key}
            onClick={() => handleIndustryChange(ind.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeIndustry === ind.key
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndustry}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {unlocked.map((template) => (
            <UnlockedTemplate
              key={template.id}
              template={template}
              isExpanded={expandedId === template.id}
              onToggle={() => setExpandedId(expandedId === template.id ? null : template.id)}
            />
          ))}

          {locked.length > 0 && (
            <div className="relative mt-8">
              <div className="absolute left-0 right-0 top-0 h-12 bg-gradient-to-b from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none -mt-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {locked.map((template, idx) => (
                  <LockedTemplate key={template.id} template={template} index={idx} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="sticky bottom-0 z-30 -mx-6 px-6 py-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-base">
              Unlock all 75+ email templates across 6 industries
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Copy-paste ready. Includes subject line variations for A/B testing.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 sm:w-48 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
            <button
              onClick={handlePurchase}
              disabled={!email.trim()}
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Get Templates -- $37
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UnlockedTemplate: React.FC<{
  template: EmailTemplate;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ template, isExpanded, onToggle }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{template.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {template.sequenceName} -- Email {template.sequencePosition}
          </p>
        </div>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
    </button>

    <AnimatePresence>
      {isExpanded && template.content && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 space-y-1.5 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 w-12">From:</span>
                  <span className="text-gray-700 dark:text-gray-300">{template.content.from}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 w-12">Subject:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{template.subjectLine}</span>
                </div>
              </div>
              <div
                className="px-6 py-5 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_ul]:space-y-1 [&_ol]:space-y-1 [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: template.content.body }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const LockedTemplate: React.FC<{
  template: EmailTemplate;
  index: number;
}> = ({ template, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 overflow-hidden"
  >
    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 dark:bg-gray-900/40 z-10 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
    </div>
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
        <Mail className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{template.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {template.subjectLine}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{template.sequenceName}</p>
      </div>
    </div>
  </motion.div>
);
