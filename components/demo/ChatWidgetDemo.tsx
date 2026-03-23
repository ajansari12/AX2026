import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Bot, User, ArrowRight, RotateCcw,
  Phone, MapPin, Clock, Globe, X,
} from 'lucide-react';
import { useDemoChat } from '../../hooks/useDemoChat';
import { trackEvent } from '../../lib/analytics';
import { supabase } from '../../lib/supabase';

interface ChatWidgetDemoProps {
  onCheckout: (email: string) => void;
}

const INDUSTRIES = [
  'Dental Practice',
  'Law Firm',
  'Real Estate Agency',
  'Chiropractic Clinic',
  'Accounting Firm',
  'Insurance Agency',
  'Veterinary Clinic',
  'Consulting Firm',
  'Contractor / Home Services',
  'Financial Advisory',
];

const QUICK_ACTIONS: Record<string, string[]> = {
  'Dental Practice': ['What insurance do you accept?', 'Book a cleaning', 'What are your hours?'],
  'Law Firm': ['Do you offer free consultations?', 'What areas of law do you practice?', 'How do your fees work?'],
  'Real Estate Agency': ['I want to sell my home', 'Show me listings in my area', 'What is my home worth?'],
  'Chiropractic Clinic': ['Do I need a referral?', 'Book an adjustment', 'What conditions do you treat?'],
  'Accounting Firm': ['I need help with my taxes', 'Do you work with small businesses?', 'What are your rates?'],
  'Insurance Agency': ['Get a quote for auto insurance', 'What types of insurance do you offer?', 'I need to file a claim'],
  'Veterinary Clinic': ['Book a wellness exam', 'Do you handle emergencies?', 'What vaccines does my pet need?'],
  'Consulting Firm': ['What industries do you serve?', 'Book a discovery call', 'How do engagements work?'],
  'Contractor / Home Services': ['Get a free estimate', 'What services do you offer?', 'Are you licensed and insured?'],
  'Financial Advisory': ['I want to plan for retirement', 'Do you offer free consultations?', 'What are your minimums?'],
};

const getVisitorId = (): string => {
  const key = 'axrategy_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export const ChatWidgetDemo: React.FC<ChatWidgetDemoProps> = ({ onCheckout }) => {
  const [setupStep, setSetupStep] = useState<'form' | 'demo'>('form');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [primaryService, setPrimaryService] = useState('');
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [email, setEmail] = useState('');

  const context = setupStep === 'demo' ? { businessName, industry, primaryService } : null;
  const { messages, messageCount, isLoading, error, sendMessage, reset } = useDemoChat(context);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messageCount >= 5 && !showBanner) setShowBanner(true);
    if (messageCount >= 8 && !showConversionModal) setShowConversionModal(true);
  }, [messageCount, showBanner, showConversionModal]);

  const handleLaunchDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !primaryService.trim()) return;
    setSetupStep('demo');
    trackEvent('demo_started', { category: 'product_preview', label: industry });
    supabase.from('product_events').insert({
      event_type: 'demo_started',
      product_slug: 'ai-chat-widget',
      visitor_id: getVisitorId(),
      metadata: { businessName, industry, primaryService },
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const msg = inputValue;
    setInputValue('');
    await sendMessage(msg);
  };

  const handleQuickAction = async (action: string) => {
    await sendMessage(action);
  };

  const handlePurchase = () => {
    trackEvent('demo_purchase_initiated', { category: 'product_preview' });
    supabase.from('product_events').insert({
      event_type: 'demo_purchase_initiated',
      product_slug: 'ai-chat-widget',
      visitor_id: getVisitorId(),
      metadata: { email, messageCount },
    });
    onCheckout(email);
  };

  const handleReset = () => {
    reset();
    setSetupStep('form');
    setBusinessName('');
    setPrimaryService('');
    setShowBanner(false);
    setShowConversionModal(false);
  };

  const quickActions = QUICK_ACTIONS[industry] || QUICK_ACTIONS['Consulting Firm'];
  const hostname = businessName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'yourbusiness';

  if (setupStep === 'form') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <MessageSquare className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Try it with your business
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Enter your details and chat with an AI assistant trained for your industry.
          </p>
        </div>

        <form onSubmit={handleLaunchDemo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Bright Smile Dental"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Primary Service
            </label>
            <input
              type="text"
              value={primaryService}
              onChange={(e) => setPrimaryService(e.target.value)}
              placeholder="e.g. Family dentistry and cosmetic treatments"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base flex items-center justify-center gap-2"
          >
            Launch Demo
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          New Demo
        </button>
        <button
          onClick={() => {
            setShowConversionModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm"
        >
          Get This Widget
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
        <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-300 flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            {hostname}.com
          </div>
        </div>

        <div className="relative min-h-[500px] md:min-h-[600px] bg-white dark:bg-gray-900">
          <AnimatePresence>
            {showBanner && (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                className="absolute top-0 left-0 right-0 z-20 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium text-center py-2 px-4"
              >
                This is a live AI assistant — trained for your business. Get it on your site starting at $99/mo — no setup fee, live in 48 hours
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 md:p-10">
            <div className="max-w-lg mx-auto text-center mb-8 mt-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {businessName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{primaryService}</p>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> (555) 123-4567</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 123 Main St</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Mon-Fri 9-5</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
              {['Services', 'About Us', 'Contact'].map((item) => (
                <div
                  key={item}
                  className="h-20 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 right-4 w-[340px] max-w-[calc(100%-32px)] z-10">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col" style={{ height: '420px' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{businessName}</p>
                    <p className="text-xs text-emerald-500">Online</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white dark:text-gray-900" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md px-3 py-2 max-w-[80%]">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Hi! Welcome to {businessName}. How can I help you today?
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 pl-8">
                      {quickActions.map((action) => (
                        <button
                          key={action}
                          onClick={() => handleQuickAction(action)}
                          className="block w-full text-left px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs text-gray-600 dark:text-gray-400"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white dark:text-gray-900" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          msg.role === 'user'
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}

                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white dark:text-gray-900" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-3 py-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-xs text-red-500 text-center py-2">{error}</div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConversionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConversionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowConversionModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                  <MessageSquare className="w-7 h-7 text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Get Your AI Receptionist
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your own AI front-desk that handles inquiries, answers questions, and books clients — 24/7, even while you sleep. Trained on your business in 48 hours.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  'Trained on YOUR business info and services',
                  'Books directly into your calendar',
                  'Qualifies leads before they reach you',
                  'Works 24/7 including holidays',
                  'Unlimited conversations',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                      </svg>
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
                />
                <button
                  onClick={handlePurchase}
                  disabled={!email.trim()}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Get This for My Business — $99/mo
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowConversionModal(false)}
                  className="w-full py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Keep exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
