import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, ArrowRight, RotateCcw, Loader2, Monitor, Smartphone,
  Star, Check, Quote, Clock, AlertCircle,
} from 'lucide-react';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface LandingPagePreviewProps {
  onCheckout: (email: string) => void;
}

interface GeneratedCopy {
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  features: { title: string; description: string }[];
  socialProof: string;
  socialProofAuthor: string;
  aboutSnippet: string;
  urgencyText: string;
}

const COLOR_SCHEMES = [
  { name: 'Dark', bg: 'bg-gray-950', text: 'text-white', accent: 'bg-white text-gray-950', muted: 'text-gray-400', card: 'bg-gray-900 border-gray-800', heroBg: 'bg-gray-900' },
  { name: 'Light', bg: 'bg-white', text: 'text-gray-900', accent: 'bg-gray-900 text-white', muted: 'text-gray-500', card: 'bg-gray-50 border-gray-200', heroBg: 'bg-gray-50' },
  { name: 'Blue', bg: 'bg-slate-50', text: 'text-slate-900', accent: 'bg-blue-600 text-white', muted: 'text-slate-500', card: 'bg-white border-slate-200', heroBg: 'bg-blue-600' },
];

const INDUSTRIES = [
  'Dental Practice', 'Law Firm', 'Real Estate', 'Home Services',
  'Chiropractic', 'Accounting', 'Insurance', 'Veterinary',
  'Financial Advisory', 'Consulting',
];

const TONES = ['Professional and friendly', 'Bold and confident', 'Warm and approachable', 'Minimal and direct'];

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ onCheckout }) => {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [formData, setFormData] = useState({
    businessName: '',
    industry: INDUSTRIES[0],
    primaryService: '',
    targetAudience: '',
    tone: TONES[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [colorScheme, setColorScheme] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim()) return;

    setIsLoading(true);
    setError(null);
    trackEvent('landing_preview_started', { category: 'product_preview' });

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-landing-preview`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      setCopy(data);
      setStep('preview');
      trackEvent('landing_preview_generated', { category: 'product_preview' });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    setCopy(null);
    setError(null);
  };

  const scheme = COLOR_SCHEMES[colorScheme];

  if (step === 'form') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Layout className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Preview your landing page copy
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            AI generates custom headlines, features, and CTAs for your business in seconds.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData((p) => ({ ...p, businessName: e.target.value }))}
              placeholder="e.g. Bright Smile Dental"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData((p) => ({ ...p, industry: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              >
                {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tone</label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData((p) => ({ ...p, tone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              >
                {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Primary Service</label>
            <input
              type="text"
              value={formData.primaryService}
              onChange={(e) => setFormData((p) => ({ ...p, primaryService: e.target.value }))}
              placeholder="e.g. Cosmetic dentistry and implants"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Audience</label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData((p) => ({ ...p, targetAudience: e.target.value }))}
              placeholder="e.g. Families in the GTA"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !formData.businessName.trim()}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Generating Copy...</> : <><Layout size={18} /> Generate Preview</>}
          </button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </div>
    );
  }

  if (!copy) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <RotateCcw size={16} /> New Preview
        </button>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {COLOR_SCHEMES.map((s, idx) => (
              <button
                key={s.name}
                onClick={() => setColorScheme(idx)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${colorScheme === idx ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button onClick={() => setViewMode('desktop')} className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors ${viewMode === 'desktop' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              <Monitor size={12} /> Desktop
            </button>
            <button onClick={() => setViewMode('mobile')} className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors ${viewMode === 'mobile' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              <Smartphone size={12} /> Mobile
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
        <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-300 truncate">
            {formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
          </div>
        </div>

        <div className={`${scheme.bg} transition-colors duration-300`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${colorScheme}-${viewMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}
            >
              <div className={`${scheme.heroBg} px-6 ${viewMode === 'mobile' ? 'py-10' : 'py-16'}`}>
                <div className={`${viewMode === 'mobile' ? '' : 'max-w-2xl mx-auto'} text-center`}>
                  <h1 className={`${viewMode === 'mobile' ? 'text-2xl' : 'text-4xl'} font-bold ${colorScheme === 2 ? 'text-white' : scheme.text} mb-4 leading-tight`}>
                    {copy.heroHeadline}
                  </h1>
                  <p className={`${viewMode === 'mobile' ? 'text-sm' : 'text-lg'} ${colorScheme === 2 ? 'text-blue-100' : scheme.muted} mb-6 leading-relaxed`}>
                    {copy.heroSubheadline}
                  </p>
                  <button className={`${scheme.accent} px-6 py-3 rounded-lg font-bold ${viewMode === 'mobile' ? 'text-sm w-full' : 'text-base'}`}>
                    {copy.ctaText}
                  </button>
                  {copy.urgencyText && (
                    <p className={`flex items-center justify-center gap-1.5 mt-4 text-xs ${colorScheme === 2 ? 'text-blue-200' : scheme.muted}`}>
                      <Clock size={12} /> {copy.urgencyText}
                    </p>
                  )}
                </div>
              </div>

              <div className={`${scheme.bg} px-6 ${viewMode === 'mobile' ? 'py-8' : 'py-12'}`}>
                <div className={`${viewMode === 'mobile' ? '' : 'max-w-3xl mx-auto'}`}>
                  <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
                    {copy.features.map((feature, idx) => (
                      <div key={idx} className={`p-5 rounded-xl border ${scheme.card}`}>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                          <Check size={14} className="text-emerald-600" />
                        </div>
                        <h3 className={`font-bold ${scheme.text} text-sm mb-1`}>{feature.title}</h3>
                        <p className={`text-xs ${scheme.muted} leading-relaxed`}>{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${scheme.bg} px-6 ${viewMode === 'mobile' ? 'py-8' : 'py-12'}`}>
                <div className={`${viewMode === 'mobile' ? '' : 'max-w-xl mx-auto'} text-center`}>
                  <Quote size={24} className={`mx-auto mb-4 ${scheme.muted} opacity-40`} />
                  <p className={`${viewMode === 'mobile' ? 'text-sm' : 'text-base'} ${scheme.text} italic leading-relaxed mb-3`}>
                    {copy.socialProof}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className={`text-xs ${scheme.muted} font-medium`}>-- {copy.socialProofAuthor}</p>
                </div>
              </div>

              <div className={`${scheme.bg} px-6 ${viewMode === 'mobile' ? 'py-8' : 'py-12'} border-t ${colorScheme === 0 ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className={`${viewMode === 'mobile' ? '' : 'max-w-xl mx-auto'} text-center`}>
                  <p className={`text-sm ${scheme.muted} leading-relaxed mb-6`}>{copy.aboutSnippet}</p>
                  <button className={`${scheme.accent} px-6 py-3 rounded-lg font-bold ${viewMode === 'mobile' ? 'text-sm w-full' : 'text-base'}`}>
                    {copy.ctaText}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <PreviewEmailCapture
        productSlug="landing-page-sprint"
        ctaLabel="Start My Sprint"
        ctaPrice="$1,497"
        headline="Love the preview? Let us build the real thing."
        subtext="Our Landing Page Sprint delivers a fully designed, conversion-optimized page in 5 business days. Custom copy, responsive design, and analytics built in."
        quizData={formData}
        onCheckout={onCheckout}
      />
    </motion.div>
  );
};
