import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, AlertTriangle, AlertCircle, Monitor, Smartphone,
  Lock, FileText, Video, Users, TrendingUp, CalendarCheck,
  ArrowRight, RotateCcw, Loader2,
} from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';
import { AuditLoader } from './AuditLoader';
import { useWebsiteAudit, AuditScores } from '../../hooks/useWebsiteAudit';
import { trackEvent } from '../../lib/analytics';

interface WebsiteAuditPreviewProps {
  onCheckout: (email: string) => void;
}

export const WebsiteAuditPreview: React.FC<WebsiteAuditPreviewProps> = ({ onCheckout }) => {
  const {
    result, phase, phaseLabel, isLoading, error, runAudit, captureEmail, reset,
  } = useWebsiteAudit();
  const [urlInput, setUrlInput] = useState('');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [email, setEmail] = useState('');
  const [emailCaptured, setEmailCaptured] = useState(false);

  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    trackEvent('audit_started', { category: 'product_preview', label: urlInput });
    await runAudit(urlInput.trim());
  };

  const handleEmailCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await captureEmail(email.trim());
    setEmailCaptured(true);
    trackEvent('audit_email_captured', { category: 'product_preview', label: email });
  };

  const handleGetReport = () => {
    trackEvent('audit_purchase_initiated', { category: 'product_preview' });
    onCheckout(email);
  };

  const scores: AuditScores = viewMode === 'mobile'
    ? (result?.mobileScores || { performance: 0, seo: 0, accessibility: 0, bestPractices: 0 })
    : (result?.desktopScores || { performance: 0, seo: 0, accessibility: 0, bestPractices: 0 });

  if (phase === 'idle' || phase === 'error') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Globe className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Get your free website score
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            See how your site performs across speed, SEO, accessibility, and more.
          </p>
        </div>

        <form onSubmit={handleSubmitUrl} className="flex flex-col sm:flex-row gap-3">
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
            disabled={!urlInput.trim()}
            className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base whitespace-nowrap"
          >
            Analyze My Website
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          Powered by Google PageSpeed Insights. Results appear in 15-20 seconds.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <AuditLoader phaseLabel={phaseLabel} />;
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
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
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Scan
          </button>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-300 truncate">
                {result.url}
              </div>
            </div>
            <img
              src={result.screenshotUrl}
              alt={`Screenshot of ${result.url}`}
              className="w-full aspect-[4/3] object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ScoreGauge score={scores.performance} label="Performance" delay={0} />
                <ScoreGauge score={scores.seo} label="SEO" delay={0.1} />
                <ScoreGauge score={scores.accessibility} label="Accessibility" delay={0.2} />
                <ScoreGauge score={scores.bestPractices} label="Best Practices" delay={0.3} />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Core Web Vitals</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'lcp', label: 'Largest Contentful Paint', metric: result.metrics.lcp },
                { key: 'fcp', label: 'First Contentful Paint', metric: result.metrics.fcp },
                { key: 'cls', label: 'Cumulative Layout Shift', metric: result.metrics.cls },
                { key: 'tbt', label: 'Total Blocking Time', metric: result.metrics.tbt },
              ].map(({ key, label, metric }) => (
                <div key={key} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {metric.display}
                    </span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        metric.score >= 0.9
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : metric.score >= 0.5
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {metric.score >= 0.9 ? 'Good' : metric.score >= 0.5 ? 'Needs Work' : 'Poor'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result.topIssues.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Issues Found</h3>
          <div className="space-y-3">
            {result.topIssues.map((issue, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
              >
                {issue.severity === 'critical' ? (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {issue.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 dark:via-gray-950/80 to-white dark:to-gray-950 z-10 pointer-events-none rounded-2xl" />
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 opacity-60">
          <div className="space-y-4">
            {[
              { icon: FileText, text: 'Full 20+ page PDF report with detailed analysis' },
              { icon: Video, text: 'Video walkthrough with expert commentary' },
              { icon: Users, text: 'Competitor benchmarking (3 competitors)' },
              { icon: TrendingUp, text: 'Prioritized action plan with estimated impact' },
              { icon: CalendarCheck, text: 'Monthly monitoring for 90 days' },
            ].map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <p className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
              Your free preview ends here.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Save your results and unlock the complete expert analysis.
            </p>

            {!emailCaptured ? (
              <form onSubmit={handleEmailCapture} className="flex flex-col sm:flex-row gap-3">
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
                  className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm whitespace-nowrap"
                >
                  Save Results
                </button>
              </form>
            ) : (
              <button
                onClick={handleGetReport}
                className="w-full py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2"
              >
                Get the Full Report -- $297
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
