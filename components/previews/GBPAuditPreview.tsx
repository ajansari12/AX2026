import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, RotateCcw, Loader2, AlertCircle,
  Star, Phone, Globe, Clock, Camera, MessageSquare,
  FileText, CheckCircle2, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { ScoreGauge } from '../audit/ScoreGauge';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface GBPAuditPreviewProps {
  onCheckout: (email: string) => void;
}

interface AuditResult {
  business: {
    name: string;
    placeId: string;
    rating: number;
    reviewCount: number;
    phone: string | null;
    website: string | null;
    mapsUrl: string | null;
    photoCount: number;
    hours: string[];
    categories: string[];
    description: string | null;
    recentReviews: { rating: number; text: string; time: string; author: string }[];
  };
  score: number;
  findings: { category: string; status: string; detail: string; weight: number }[];
  competitors: { name: string; rating: number; reviewCount: number; photoCount: number }[];
}

export const GBPAuditPreview: React.FC<GBPAuditPreviewProps> = ({ onCheckout }) => {
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !city.trim()) return;

    setIsLoading(true);
    setError(null);
    trackEvent('gbp_audit_started', { category: 'product_preview', label: businessName });

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gbp-audit`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ businessName: businessName.trim(), city: city.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setResult(data);
      trackEvent('gbp_audit_completed', { category: 'product_preview', value: data.score });
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setBusinessName('');
    setCity('');
  };

  if (!result) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <MapPin className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Get your free Google Business Profile audit
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            See how your profile compares to top local competitors -- scored across 8 key ranking factors.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Name</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Bright Smile Dental"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Toronto, ON"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !businessName.trim() || !city.trim()}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing Profile...
              </>
            ) : (
              <>
                <Search size={18} />
                Audit My Profile
              </>
            )}
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
          Powered by Google Places API. Results appear in 5-10 seconds.
        </p>
      </div>
    );
  }

  const biz = result.business;
  const statusIcon = (status: string) => {
    if (status === 'good') return <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />;
    if (status === 'warning') return <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />;
    return <AlertCircle size={16} className="text-red-500 flex-shrink-0" />;
  };

  const statusBg = (status: string) => {
    if (status === 'good') return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800';
    if (status === 'warning') return 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800';
    return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-white">
            {biz.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{biz.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-0.5">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>{biz.rating}</span>
              </div>
              <span>({biz.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <RotateCcw size={16} /> New Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex justify-center lg:justify-start">
          <ScoreGauge score={result.score} label="Profile Completeness" size={140} />
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <Star size={16} className="mx-auto mb-1 text-amber-500" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{biz.rating}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Rating</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <MessageSquare size={16} className="mx-auto mb-1 text-blue-500" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{biz.reviewCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Reviews</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <Camera size={16} className="mx-auto mb-1 text-emerald-500" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{biz.photoCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Photos</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <FileText size={16} className="mx-auto mb-1 text-gray-500" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{biz.categories.length}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Categories</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-xs">
            {biz.phone && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                <Phone size={10} /> {biz.phone}
              </span>
            )}
            {biz.website && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                <Globe size={10} /> Website linked
              </span>
            )}
            {biz.hours.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                <Clock size={10} /> Hours set
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Detailed Findings</h3>
        <div className="space-y-3">
          {result.findings.map((finding, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`flex items-start gap-3 p-3 rounded-xl border ${statusBg(finding.status)}`}
            >
              {statusIcon(finding.status)}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{finding.category}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{finding.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {result.competitors.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Competitor Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Business</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Reviews</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Photos</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-900/10">
                  <td className="py-3 font-semibold text-gray-900 dark:text-white">
                    {biz.name} <span className="text-[10px] text-blue-600 dark:text-blue-400 ml-1">(You)</span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{biz.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-medium text-gray-900 dark:text-white">{biz.reviewCount}</td>
                  <td className="py-3 text-center font-medium text-gray-900 dark:text-white">{biz.photoCount}</td>
                </tr>
                {result.competitors.map((comp, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="py-3 text-gray-700 dark:text-gray-300">{comp.name}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className={`font-medium ${comp.rating > biz.rating ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {comp.rating}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 text-center font-medium ${comp.reviewCount > biz.reviewCount ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {comp.reviewCount}
                    </td>
                    <td className={`py-3 text-center font-medium ${comp.photoCount > biz.photoCount ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {comp.photoCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {biz.recentReviews.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {biz.recentReviews.map((review, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{review.time}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">{review.text}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">-- {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <PreviewEmailCapture
        productSlug="gbp-optimization"
        ctaLabel="Optimize My Profile"
        ctaPrice="$497"
        headline="Ready to dominate local search?"
        subtext="Our team will fully optimize your Google Business Profile, implement a review generation strategy, and monitor your local rankings for 90 days."
        onCheckout={onCheckout}
      />
    </motion.div>
  );
};
