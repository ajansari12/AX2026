import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Lock, Check, ArrowRight, Star,
  Users, Mail, Calendar, CreditCard, BarChart3, MessageSquare,
} from 'lucide-react';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface BundleSelectorProps {
  onCheckout: (email: string) => void;
}

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  locked: boolean;
  tools: { name: string; price: string; rating: number; best_for: string; recommended?: boolean }[];
}

const INDUSTRIES = ['All Businesses', 'Healthcare', 'Legal', 'Real Estate', 'Home Services', 'Financial'];
const SIZES = ['Solo', 'Small Team (2-5)', 'Growing (6-15)', 'Established (15+)'];

const CATEGORIES: ToolCategory[] = [
  {
    id: 'crm',
    name: 'CRM',
    icon: Users,
    description: 'Manage contacts and deals',
    locked: false,
    tools: [
      { name: 'HubSpot CRM', price: 'Free - $50/mo', rating: 4.5, best_for: 'Small teams, inbound marketing', recommended: true },
      { name: 'Pipedrive', price: '$15 - $59/mo', rating: 4.3, best_for: 'Sales-focused teams' },
      { name: 'GoHighLevel', price: '$97 - $297/mo', rating: 4.2, best_for: 'All-in-one agencies' },
      { name: 'Zoho CRM', price: 'Free - $45/mo', rating: 4.0, best_for: 'Budget-conscious, feature-rich' },
    ],
  },
  {
    id: 'email',
    name: 'Email Marketing',
    icon: Mail,
    description: 'Newsletters and drip campaigns',
    locked: false,
    tools: [
      { name: 'Mailchimp', price: 'Free - $20/mo', rating: 4.2, best_for: 'Beginners, small lists', recommended: true },
      { name: 'ConvertKit', price: 'Free - $29/mo', rating: 4.4, best_for: 'Creators, automations' },
      { name: 'ActiveCampaign', price: '$29 - $149/mo', rating: 4.5, best_for: 'Advanced automations' },
      { name: 'Brevo (Sendinblue)', price: 'Free - $25/mo', rating: 4.0, best_for: 'Budget transactional + marketing' },
    ],
  },
  {
    id: 'scheduling',
    name: 'Scheduling',
    icon: Calendar,
    description: 'Booking and appointments',
    locked: true,
    tools: [
      { name: 'Cal.com', price: 'Free - $15/mo', rating: 4.6, best_for: 'Open-source, developer-friendly', recommended: true },
      { name: 'Calendly', price: 'Free - $16/mo', rating: 4.5, best_for: 'Simple, polished UX' },
      { name: 'Acuity Scheduling', price: '$16 - $49/mo', rating: 4.4, best_for: 'Service businesses' },
    ],
  },
  {
    id: 'payments',
    name: 'Payments',
    icon: CreditCard,
    description: 'Invoicing and collections',
    locked: true,
    tools: [
      { name: 'Stripe', price: '2.9% + 30c', rating: 4.7, best_for: 'Online payments, subscriptions', recommended: true },
      { name: 'Square', price: '2.6% + 10c', rating: 4.4, best_for: 'In-person + online' },
      { name: 'FreshBooks', price: '$17 - $55/mo', rating: 4.3, best_for: 'Invoicing-first' },
    ],
  },
  {
    id: 'reviews',
    name: 'Reviews',
    icon: Star,
    description: 'Reputation management',
    locked: true,
    tools: [
      { name: 'Birdeye', price: '$299/mo', rating: 4.5, best_for: 'Enterprise reputation', recommended: true },
      { name: 'Podium', price: '$249/mo', rating: 4.3, best_for: 'Messaging + reviews' },
      { name: 'NiceJob', price: '$75/mo', rating: 4.4, best_for: 'Budget-friendly automation' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart3,
    description: 'Track what matters',
    locked: true,
    tools: [
      { name: 'Google Analytics 4', price: 'Free', rating: 4.2, best_for: 'Website traffic basics', recommended: true },
      { name: 'Hotjar', price: 'Free - $39/mo', rating: 4.3, best_for: 'Heatmaps and recordings' },
      { name: 'Databox', price: 'Free - $72/mo', rating: 4.4, best_for: 'KPI dashboards' },
    ],
  },
];

export const BundleSelector: React.FC<BundleSelectorProps> = ({ onCheckout }) => {
  const [activeCategory, setActiveCategory] = useState('crm');
  const [industry, setIndustry] = useState('All Businesses');
  const [size, setSize] = useState('Small Team (2-5)');

  const category = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    trackEvent('bundle_category_viewed', { category: 'product_preview', label: id });
  };

  const individualTotal = 37 + 67 + 297 + 37 + 67;
  const bundlePrice = 197;
  const savings = individualTotal - bundlePrice;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20"
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {cat.locked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                  <Lock size={8} className="text-white" />
                </div>
              )}
              <Icon size={18} />
              <span className="text-[10px] font-semibold leading-tight">{cat.name}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {category.locked ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 dark:to-gray-950/90 z-10 pointer-events-none rounded-2xl" />
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 opacity-60">
                <div className="flex items-center gap-2 mb-4">
                  <category.icon size={18} className="text-gray-400" />
                  <h3 className="font-bold text-gray-400">{category.name} -- {category.description}</h3>
                </div>
                <div className="space-y-3">
                  {category.tools.map((tool, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-400">{tool.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{tool.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-4 z-20 px-6">
                <div className="text-center">
                  <Lock size={20} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Unlock with the full bundle</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <category.icon size={18} className="text-gray-900 dark:text-white" />
                <h3 className="font-bold text-gray-900 dark:text-white">{category.name} -- {category.description}</h3>
              </div>
              <div className="space-y-3">
                {category.tools.map((tool, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`p-4 rounded-xl border ${tool.recommended ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</p>
                          {tool.recommended && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.best_for}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{tool.price}</p>
                        <div className="flex items-center gap-0.5 mt-1 justify-end">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">{tool.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Bundle Savings Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Individual products</p>
            <p className="text-xl font-bold text-gray-400 line-through">${individualTotal}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Bundle price</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">${bundlePrice}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">You save</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-400">${savings}</p>
          </div>
        </div>
      </div>

      <PreviewEmailCapture
        productSlug="diy-automation-bundle"
        ctaLabel="Get the Bundle"
        ctaPrice="$197"
        headline="Get all 6 categories for one price."
        subtext="The DIY Automation Bundle includes tool recommendations, setup guides, and templates for every category -- tailored to your industry."
        onCheckout={onCheckout}
      />
    </div>
  );
};
