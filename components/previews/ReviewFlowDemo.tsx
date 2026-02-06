import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MessageSquare, Mail, ArrowRight, RotateCcw,
  ThumbsUp, ThumbsDown, TrendingUp, CheckCircle2, Send,
} from 'lucide-react';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface ReviewFlowDemoProps {
  onCheckout: (email: string) => void;
}

const PROJECTIONS = [
  { month: 'Today', reviews: 12, rating: 4.1 },
  { month: '30 days', reviews: 24, rating: 4.3 },
  { month: '60 days', reviews: 42, rating: 4.5 },
  { month: '90 days', reviews: 65, rating: 4.7 },
];

export const ReviewFlowDemo: React.FC<ReviewFlowDemoProps> = ({ onCheckout }) => {
  const [step, setStep] = useState<'form' | 'flow' | 'projection'>('form');
  const [businessName, setBusinessName] = useState('');
  const [flowStep, setFlowStep] = useState<'request' | 'rating' | 'happy' | 'unhappy'>('request');
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [animatedProjection, setAnimatedProjection] = useState(0);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    trackEvent('review_flow_demo_started', { category: 'product_preview' });
    setStep('flow');
    setFlowStep('request');
  };

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    setTimeout(() => {
      setFlowStep(rating >= 4 ? 'happy' : 'unhappy');
    }, 600);
  };

  const handleViewProjection = () => {
    setStep('projection');
    trackEvent('review_flow_projection_viewed', { category: 'product_preview' });
  };

  const handleReset = () => {
    setStep('form');
    setFlowStep('request');
    setSelectedRating(0);
    setAnimatedProjection(0);
  };

  useEffect(() => {
    if (step === 'projection') {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        if (current > 3) {
          clearInterval(interval);
        } else {
          setAnimatedProjection(current);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (step === 'form') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Star className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            See the review generation flow
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Experience exactly what your customers see when they receive a review request.
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Bright Smile Dental"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <button type="submit" className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2">
            Start Demo <ArrowRight size={18} />
          </button>
        </form>
      </div>
    );
  }

  if (step === 'flow') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RotateCcw size={16} /> New Demo
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex gap-1">
              {['request', 'rating', 'happy'].map((s, i) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    ['request', 'rating', 'happy', 'unhappy'].indexOf(flowStep) >= i
                      ? 'bg-gray-900 dark:bg-white'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            Step {['request', 'rating', 'happy', 'unhappy'].indexOf(flowStep) + 1} of 3
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {flowStep === 'request' && (
              <motion.div
                key="request"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center gap-2">
                    <MessageSquare size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Text Message</span>
                  </div>
                  <div className="p-5">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Hi there! Thanks for visiting {businessName} today. We'd love to hear how your experience was. Tap below to leave a quick rating -- it only takes 10 seconds!
                      <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 underline cursor-pointer">
                        rate.{businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/feedback
                      </div>
                    </div>
                    <button
                      onClick={() => setFlowStep('rating')}
                      className="w-full mt-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm"
                    >
                      Customer Taps Link
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {flowStep === 'rating' && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Star size={24} className="text-gray-900 dark:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">How was your experience?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    at {businessName}
                  </p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRating(rating)}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          size={36}
                          className={`transition-colors ${
                            rating <= (hoveredRating || selectedRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {selectedRating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >
                      {selectedRating >= 4 ? 'Awesome! Redirecting to Google...' : 'Redirecting to feedback form...'}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {flowStep === 'happy' && (
              <motion.div
                key="happy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                  <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 flex items-center gap-2">
                    <ThumbsUp size={14} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Happy Path (4-5 stars)</span>
                  </div>
                  <div className="p-5">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-white dark:bg-gray-800 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_42x16dp.png" alt="" className="h-4" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Google Reviews</span>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{businessName}</p>
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <textarea
                          placeholder="Share details of your experience..."
                          className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 resize-none focus:outline-none"
                          defaultValue={`Great experience at ${businessName}! The team was professional and friendly.`}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                      Customer is redirected directly to your Google Reviews page with 5 stars pre-selected.
                    </p>
                  </div>
                </div>

                <button onClick={handleViewProjection} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm flex items-center justify-center gap-2">
                  See 90-Day Growth Projection <TrendingUp size={16} />
                </button>
              </motion.div>
            )}

            {flowStep === 'unhappy' && (
              <motion.div
                key="unhappy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                  <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 flex items-center gap-2">
                    <ThumbsDown size={14} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Recovery Path (1-3 stars)</span>
                  </div>
                  <div className="p-5">
                    <div className="text-center mb-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">We're sorry about your experience</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your feedback goes directly to our manager -- not online.</p>
                    </div>
                    <div className="space-y-3">
                      <textarea
                        placeholder="What could we have done better?"
                        className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 resize-none focus:outline-none"
                      />
                      <button className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg text-sm flex items-center justify-center gap-2">
                        <Send size={14} /> Send Private Feedback
                      </button>
                    </div>
                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                          Negative feedback is captured privately. This prevents bad reviews from going public while giving you a chance to recover the relationship.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={handleViewProjection} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm flex items-center justify-center gap-2">
                  See 90-Day Growth Projection <TrendingUp size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <RotateCcw size={16} /> New Demo
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">90-Day Review Growth Projection</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Based on sending review requests to 80% of your clients with a 30% response rate:
        </p>

        <div className="space-y-3">
          {PROJECTIONS.map((proj, idx) => (
            <motion.div
              key={proj.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: idx <= animatedProjection ? 1 : 0.3,
                x: idx <= animatedProjection ? 0 : -20,
              }}
              transition={{ delay: idx * 0.3 }}
              className="flex items-center gap-4"
            >
              <div className="w-20 text-right">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{proj.month}</span>
              </div>
              <div className="flex-1">
                <div className="h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: idx <= animatedProjection ? `${(proj.reviews / 65) * 100}%` : '0%' }}
                    transition={{ duration: 0.8, delay: idx * 0.3 }}
                    className="h-full bg-amber-400/80 dark:bg-amber-500/60 rounded-xl flex items-center justify-end px-3"
                  >
                    {idx <= animatedProjection && (
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200">{proj.reviews} reviews</span>
                    )}
                  </motion.div>
                </div>
              </div>
              <div className="w-16 text-right">
                <div className="flex items-center gap-0.5 justify-end">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{proj.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Google Business Profile Preview</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Here's what your profile could look like in 90 days:</p>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white flex-shrink-0">
            {businessName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{businessName}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= 4 ? 'fill-amber-400 text-amber-400' : s === 5 ? 'fill-amber-400/50 text-amber-400/50' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">4.7</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">(65 reviews)</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+53 new reviews in 90 days</p>
          </div>
        </div>
      </div>

      <PreviewEmailCapture
        productSlug="review-generation"
        ctaLabel="Start Free Trial"
        ctaPrice="$79/mo"
        headline="Start collecting 5-star reviews on autopilot."
        subtext="Automated review requests after every appointment. Happy clients go to Google, unhappy ones come to you first."
        onCheckout={onCheckout}
      />
    </motion.div>
  );
};
