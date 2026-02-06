import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Clock, Mail, MessageSquare, Phone, ArrowRight,
  User, Send, RotateCcw, AlertCircle, CheckCircle2, Timer,
} from 'lucide-react';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface SpeedToLeadDemoProps {
  onCheckout: (email: string) => void;
}

const FOLLOW_UP_TIMELINE = [
  { day: 'Instant', label: 'Auto-Response', type: 'sms', message: 'Hi {name}! Thanks for reaching out to {business}. We received your inquiry about {service} and a team member will follow up shortly. In the meantime, here\'s a link to book a time that works for you: [booking link]' },
  { day: 'Day 1', label: 'Follow-Up Email', type: 'email', message: 'Subject: Your inquiry about {service}\n\nHi {name},\n\nThanks again for your interest in {service}. I wanted to personally follow up and answer any questions you might have.\n\nHere are 3 things our clients love most:\n- Fast turnaround times\n- Transparent pricing with no surprises\n- Dedicated point of contact throughout\n\nWould any of these times work for a quick 15-minute call?\n[Calendar link]' },
  { day: 'Day 3', label: 'Value-Add SMS', type: 'sms', message: 'Hi {name}, just sharing a quick guide our clients have found helpful: "5 Questions to Ask Before Choosing a {industry} Provider." Want me to send it over? Reply YES and I\'ll email it right away.' },
  { day: 'Day 5', label: 'Case Study Email', type: 'email', message: 'Subject: How {similar_business} solved the same challenge\n\nHi {name},\n\nI thought you might find this relevant -- one of our clients in {industry} was facing a similar situation. Here\'s how we helped them:\n\nResult: 40% improvement in just 30 days.\n\n[Read the full case study]\n\nStill interested in chatting? My calendar is open:\n[Calendar link]' },
  { day: 'Day 14', label: 'Final Check-In', type: 'sms', message: 'Hi {name}, it\'s been a couple weeks since you reached out. No pressure at all -- just wanted to check if you still need help with {service}. If the timing isn\'t right, no worries. We\'re here whenever you\'re ready!' },
];

const RESPONSE_STATS = [
  { time: '< 1 min', rate: '391%', label: 'higher contact rate vs. 30-min response' },
  { time: '5 min', rate: '21x', label: 'more likely to qualify a lead vs. 30 min' },
  { time: '> 10 min', rate: '400%', label: 'decrease in odds of qualifying the lead' },
];

export const SpeedToLeadDemo: React.FC<SpeedToLeadDemoProps> = ({ onCheckout }) => {
  const [step, setStep] = useState<'form' | 'race' | 'timeline'>('form');
  const [formData, setFormData] = useState({ name: '', business: '', service: '', industry: 'dental' });
  const [elapsedMs, setElapsedMs] = useState(0);
  const [showSms, setShowSms] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [raceComplete, setRaceComplete] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [currentResponseTime, setCurrentResponseTime] = useState('');
  const [lostLeadsCalc, setLostLeadsCalc] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.business.trim()) return;
    trackEvent('speed_to_lead_demo_started', { category: 'product_preview' });
    setStep('race');
    setElapsedMs(0);
    setShowSms(false);
    setShowEmail(false);
    setRaceComplete(false);

    timerRef.current = setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);

    setTimeout(() => { setShowSms(true); }, 3500);
    setTimeout(() => { setShowEmail(true); }, 5500);
    setTimeout(() => {
      setRaceComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }, 7000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleViewTimeline = () => {
    setStep('timeline');
    trackEvent('speed_to_lead_timeline_viewed', { category: 'product_preview' });
  };

  const handleReset = () => {
    setStep('form');
    setElapsedMs(0);
    setShowSms(false);
    setShowEmail(false);
    setRaceComplete(false);
    setExpandedStep(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fillTemplate = (text: string) =>
    text
      .replace(/\{name\}/g, formData.name || 'there')
      .replace(/\{business\}/g, formData.business || 'our team')
      .replace(/\{service\}/g, formData.service || 'our services')
      .replace(/\{industry\}/g, formData.industry || 'your industry')
      .replace(/\{similar_business\}/g, 'a local business');

  const calcLostLeads = () => {
    const mins = parseInt(currentResponseTime);
    if (isNaN(mins) || mins <= 0) return;
    const lostPercent = Math.min(95, Math.round((mins / 60) * 50 + 10));
    setLostLeadsCalc(lostPercent);
  };

  if (step === 'form') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Zap className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            See how fast your leads get a response
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Submit a test lead and watch the auto-responder fire in real time.
          </p>
        </div>

        <form onSubmit={handleStartDemo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sarah"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Name</label>
              <input
                type="text"
                value={formData.business}
                onChange={(e) => setFormData((p) => ({ ...p, business: e.target.value }))}
                placeholder="e.g. Bright Smile Dental"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Primary Service</label>
            <input
              type="text"
              value={formData.service}
              onChange={(e) => setFormData((p) => ({ ...p, service: e.target.value }))}
              placeholder="e.g. Teeth whitening consultation"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Submit Test Lead
          </button>
        </form>
      </div>
    );
  }

  if (step === 'race') {
    const seconds = (elapsedMs / 1000).toFixed(1);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RotateCcw size={16} /> New Demo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Lead submitted</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formData.name} via contact form</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Name</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Business</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formData.business}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 dark:text-gray-400">Interest</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formData.service || 'General inquiry'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${raceComplete ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Timer size={20} className={raceComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'} />
                <span className={`text-3xl font-mono font-bold tabular-nums ${raceComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                  {seconds}s
                </span>
              </div>
            </div>

            <AnimatePresence>
              {showSms && (
                <motion.div initial={{ opacity: 0, x: 30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MessageSquare size={14} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">SMS Sent</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">3.5 seconds</p>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-500 ml-auto" />
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {fillTemplate(FOLLOW_UP_TIMELINE[0].message)}
                  </div>
                </motion.div>
              )}

              {showEmail && (
                <motion.div initial={{ opacity: 0, x: 30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Email Sent</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400">5.5 seconds</p>
                    </div>
                    <CheckCircle2 size={16} className="text-blue-500 ml-auto" />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p className="font-semibold mb-1">Subject: Thanks for reaching out to {formData.business}!</p>
                    Confirmation email with booking link and next steps sent to the lead.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {raceComplete && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button onClick={handleViewTimeline} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm flex items-center justify-center gap-2">
                  View Full 5-Touch Follow-Up <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </div>
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

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">5-Touch Follow-Up Timeline</h3>
        {FOLLOW_UP_TIMELINE.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
              className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === 'sms' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                {item.type === 'sms' ? <MessageSquare size={18} className="text-emerald-600 dark:text-emerald-400" /> : <Mail size={18} className="text-blue-600 dark:text-blue-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.day}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium uppercase">{item.type}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
              </div>
              <ArrowRight size={16} className={`text-gray-400 transition-transform ${expandedStep === idx ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedStep === idx && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-4">
                    <div className={`rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line ${item.type === 'sms' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-gray-700 dark:text-gray-300' : 'bg-blue-50 dark:bg-blue-900/10 text-gray-700 dark:text-gray-300'}`}>
                      {fillTemplate(item.message)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Lead Response Time Calculator</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">What's your current average response time to new leads?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={currentResponseTime}
              onChange={(e) => setCurrentResponseTime(e.target.value)}
              placeholder="Minutes (e.g. 45)"
              min="1"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 text-sm"
            />
          </div>
          <button onClick={calcLostLeads} className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm whitespace-nowrap">
            Calculate
          </button>
        </div>

        {lostLeadsCalc !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-700 dark:text-red-400 text-sm">
                  You're potentially losing ~{lostLeadsCalc}% of leads
                </p>
                <p className="text-xs text-red-600 dark:text-red-400/80 mt-1">
                  Research from MIT and Harvard shows that contacting a lead within 5 minutes makes you 21x more likely to qualify them compared to waiting 30 minutes.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-3 mt-6">
          {RESPONSE_STATS.map((stat, idx) => (
            <div key={idx} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.rate}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-1">{stat.label}</p>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-2">{stat.time}</p>
            </div>
          ))}
        </div>
      </div>

      <PreviewEmailCapture
        productSlug="speed-to-lead"
        ctaLabel="Start Free Trial"
        ctaPrice="$99/mo"
        headline="Never lose a lead to slow response again."
        subtext="Get the Speed-to-Lead Auto-Responder on your website and respond to every lead in under 60 seconds."
        onCheckout={onCheckout}
      />
    </motion.div>
  );
};
