import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Globe, Search, RotateCcw, Loader2, AlertCircle,
  CheckCircle2, XCircle, TrendingUp, Users, MousePointer,
  Eye, Target,
} from 'lucide-react';
import { ScoreGauge } from '../audit/ScoreGauge';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface AnalyticsCheckProps {
  onCheckout: (email: string) => void;
}

interface CheckResult {
  name: string;
  found: boolean;
  detail: string;
  weight: number;
}

interface AnalyticsResult {
  url: string;
  score: number;
  checks: CheckResult[];
  foundCount: number;
  totalChecks: number;
}

const MOCK_DASHBOARD_METRICS = [
  { label: 'Monthly Visitors', value: '2,847', change: '+18%', icon: Users },
  { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: Target },
  { label: 'Avg. Session Duration', value: '2m 14s', change: '+12%', icon: Eye },
  { label: 'Top Traffic Source', value: 'Google Search', change: '62%', icon: Search },
  { label: 'Goal Completions', value: '91', change: '+23%', icon: MousePointer },
];

export const AnalyticsCheck: React.FC<AnalyticsCheckProps> = ({ onCheckout }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyticsResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setError(null);
    trackEvent('analytics_check_started', { category: 'product_preview', label: urlInput });

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-check`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      setResult(data);
      trackEvent('analytics_check_completed', { category: 'product_preview', value: data.score });
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUrlInput('');
  };

  if (!result) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <BarChart3 className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Check your analytics setup
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            We'll scan your website for GA4, Tag Manager, conversion tracking, and more.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter your website URL"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !urlInput.trim()}
            className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base whitespace-nowrap flex items-center gap-2"
          >
            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Scanning...</> : <><Search size={18} /> Scan My Site</>}
          </button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          We scan the HTML source of your homepage. No data is stored from your website.
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Results for</p>
            <p className="font-bold text-gray-900 dark:text-white truncate max-w-xs">{result.url}</p>
          </div>
        </div>
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <RotateCcw size={16} /> New Scan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center">
          <ScoreGauge score={result.score} label="Analytics Health" size={140} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
            {result.foundCount} of {result.totalChecks} checks passed
          </p>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {result.checks.map((check, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                check.found
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'
              }`}
            >
              {check.found ? (
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{check.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{check.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-gray-900 dark:text-white" />
          <h3 className="font-bold text-gray-900 dark:text-white">What you could see with proper analytics</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">A mock dashboard showing the 5 key metrics every business should track:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOCK_DASHBOARD_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center"
              >
                <Icon size={16} className="mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{metric.label}</p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{metric.change}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <PreviewEmailCapture
        productSlug="analytics-setup"
        ctaLabel="Set Up My Analytics"
        ctaPrice="$497"
        headline="Get analytics that actually work."
        subtext="We'll install GA4, Google Tag Manager, conversion tracking, and custom dashboards -- so you know exactly where your leads come from."
        onCheckout={onCheckout}
      />
    </motion.div>
  );
};
