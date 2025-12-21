import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import {
  PRICING_TIERS,
  MONTHLY_PRICING_TIERS,
  PRICING_COMPARISON_DATA,
  MONTHLY_COMPARISON_DATA,
  ENGAGEMENT_PROCESS,
  PRICING_FAQ_ONE_TIME,
  PRICING_FAQ_MONTHLY
} from '../constants';
import { Check, ShieldCheck, ChevronDown, Minus, Info, Calendar, Zap, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalBookingModal, useBookingModal } from '../components/CalBookingModal';
import { PricingToggle } from '../components/PricingToggle';
import { ROICalculator } from '../components/ROICalculator';
import { PricingMode } from '../types';

export const Pricing: React.FC = () => {
  const [pricingMode, setPricingMode] = useState<PricingMode>('one-time');
  const bookingModal = useBookingModal();

  const currentTiers = pricingMode === 'one-time' ? PRICING_TIERS : MONTHLY_PRICING_TIERS;
  const currentComparison = pricingMode === 'one-time' ? PRICING_COMPARISON_DATA : MONTHLY_COMPARISON_DATA;
  const currentFAQ = pricingMode === 'one-time' ? PRICING_FAQ_ONE_TIME : PRICING_FAQ_MONTHLY;

  return (
    <>
      <SEO
        title="Pricing & Packages"
        description="Clear, flexible pricing for websites, AI automation, and system builds. Choose one-time payment or monthly partnership."
      />

      <Section className="pt-32 md:pt-48 pb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100 dark:border-emerald-800">
          Flexible Pricing
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pricingMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
              {pricingMode === 'one-time'
                ? 'Know what you\'re paying upfront.'
                : 'Start small. Grow together.'
              }
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              {pricingMode === 'one-time'
                ? 'One flat price per project. No hourly billing, no surprise invoices. You\'ll know the cost before we start.'
                : 'Lower upfront investment with ongoing partnership. We stay invested in your success with continuous optimization.'
              }
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mb-16">
          <PricingToggle mode={pricingMode} onChange={setPricingMode} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pricingMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-start text-left"
          >
            {pricingMode === 'one-time' ? (
              PRICING_TIERS.map((tier, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className={`relative p-8 rounded-[2rem] h-full flex flex-col transition-all duration-300 ${
                    tier.isPopular
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl ring-4 ring-gray-100 dark:ring-gray-800 lg:scale-105 z-10'
                      : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800'
                  }`}>
                    {tier.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg whitespace-nowrap z-20">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className={`text-xl font-bold mb-2 ${tier.isPopular ? 'text-gray-100 dark:text-gray-900' : 'text-gray-900 dark:text-white'}`}>{tier.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-bold tracking-tight">{tier.price}</span>
                        <span className={`text-sm font-medium ${tier.isPopular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400'}`}>/ project</span>
                      </div>
                    </div>

                    <p className={`text-base mb-8 leading-relaxed border-b pb-8 ${tier.isPopular ? 'text-gray-300 dark:text-gray-600 border-gray-800 dark:border-gray-200' : 'text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800'}`}>
                      {tier.description}
                    </p>

                    <div className="flex-grow space-y-4 mb-10">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-sm font-medium">
                          <Check size={18} className={`mt-0.5 flex-shrink-0 ${tier.isPopular ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-600 dark:text-emerald-400'}`} />
                          <span className={tier.isPopular ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <NavLink to="/contact" className="w-full mt-auto">
                      <button className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                        tier.isPopular
                          ? 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg'
                      }`}>
                        {tier.ctaText}
                      </button>
                    </NavLink>
                  </div>
                </FadeIn>
              ))
            ) : (
              MONTHLY_PRICING_TIERS.map((tier, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className={`relative p-8 rounded-[2rem] h-full flex flex-col transition-all duration-300 ${
                    tier.isPopular
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl ring-4 ring-gray-100 dark:ring-gray-800 lg:scale-105 z-10'
                      : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800'
                  }`}>
                    {tier.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg whitespace-nowrap z-20">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className={`text-xl font-bold mb-2 ${tier.isPopular ? 'text-gray-100 dark:text-gray-900' : 'text-gray-900 dark:text-white'}`}>{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl md:text-5xl font-bold tracking-tight">{tier.monthlyPrice}</span>
                        <span className={`text-sm font-medium ${tier.isPopular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400'}`}>/month</span>
                      </div>
                      <div className={`text-sm ${tier.isPopular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500'}`}>
                        + {tier.setupFee} setup fee
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${
                      tier.isPopular
                        ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-700'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      <RefreshCw size={12} />
                      {tier.commitment} minimum
                    </div>

                    <p className={`text-base mb-6 leading-relaxed ${tier.isPopular ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                      {tier.description}
                    </p>

                    <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${tier.isPopular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400'}`}>
                      What you get to start
                    </div>
                    <div className="space-y-3 mb-6">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-sm font-medium">
                          <Check size={16} className={`mt-0.5 flex-shrink-0 ${tier.isPopular ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-600 dark:text-emerald-400'}`} />
                          <span className={tier.isPopular ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${tier.isPopular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400'}`}>
                      Ongoing every month
                    </div>
                    <div className="flex-grow space-y-3 mb-10">
                      {tier.ongoingBenefits.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-3 text-sm font-medium">
                          <Zap size={16} className={`mt-0.5 flex-shrink-0 ${tier.isPopular ? 'text-blue-400 dark:text-blue-600' : 'text-blue-500 dark:text-blue-400'}`} />
                          <span className={tier.isPopular ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <NavLink to="/contact" className="w-full mt-auto">
                      <button className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                        tier.isPopular
                          ? 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg'
                      }`}>
                        {tier.ctaText}
                      </button>
                    </NavLink>
                  </div>
                </FadeIn>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </Section>

      <Section light className="bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Which option is right for you?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Both models get you the same quality work. The difference is in how you pay and what ongoing support you need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Pay Once - Own Everything</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Best if you have the budget upfront and want complete independence. You own all the code, accounts, and assets. No ongoing fees to us.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>Full ownership of everything</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>No ongoing payments to us</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>30-90 days support included</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>Lower total cost over 2+ years</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Monthly - We Stay Invested</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Best if you want lower upfront cost and ongoing partnership. We continuously optimize your systems and share in your success.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>60-80% lower upfront investment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>Continuous optimization included</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>Regular check-ins and updates</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={16} className="text-emerald-500" />
                  <span>Can buy out to ownership later</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">See Your Return on Investment</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Adjust the numbers to match your business. Most clients see their investment pay for itself within 2-3 months.
            </p>
          </div>
          <ROICalculator />
        </Container>
      </Section>

      <Section light className="bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">What might change the price?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Most projects fit the base price. But some things add extra work. We'll tell you upfront if any of these apply to you.
              </p>
              <div className="space-y-4">
                {[
                  "More pages on your website",
                  "Complicated automations with lots of steps",
                  "Moving over lots of old contacts or data",
                  "Connecting to tools we don't normally use",
                  "AI that needs extra training for your industry"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
                      <Info size={14} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Extra Services (Optional)</h3>
              <div className="space-y-4">
                {[
                  { name: "Monthly Content", price: "$1,200/mo", desc: "We write blog posts and social media content for you." },
                  { name: "Brand Refresh", price: "$2,500", desc: "New logo, colors, and design that looks professional." },
                  { name: "Priority Help", price: "$500/mo", desc: "We respond within 24 hours and check in weekly." },
                  { name: "Results Dashboard", price: "$1,500", desc: "See exactly where your leads come from." }
                ].map((addon, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{addon.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{addon.desc}</p>
                    </div>
                    <span className="text-sm font-mono font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-900 dark:text-white">{addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              What's included in each package
            </h2>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              Viewing: <span className="font-semibold text-gray-900 dark:text-white">{pricingMode === 'one-time' ? 'Pay Once' : 'Monthly'}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div
              className="min-w-[768px] bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
              role="table"
              aria-label="Pricing Features Comparison"
            >
              <div role="rowgroup" className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <div role="row" className="grid grid-cols-4 p-6">
                  <div role="columnheader" className="col-span-1"></div>
                  {(pricingMode === 'one-time' ? ['Starter', 'Growth', 'Scale'] : ['Starter', 'Professional', 'Growth']).map((h, i) => (
                    <div
                      key={i}
                      role="columnheader"
                      className={`col-span-1 text-center font-bold text-lg ${i === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}
                    >
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              <div role="rowgroup" className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentComparison.map((category, catIdx) => (
                  <React.Fragment key={catIdx}>
                    <div role="row" className="grid grid-cols-4 p-4 bg-gray-50/50 dark:bg-gray-900/50">
                      <div role="cell" className="col-span-4 font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider pl-2">
                        {category.category}
                      </div>
                    </div>
                    {category.items.map((row, rowIdx) => (
                      <div role="row" key={rowIdx} className="grid grid-cols-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div role="rowheader" className="col-span-1 text-gray-700 dark:text-gray-300 font-medium pl-4 flex items-center">{row.label}</div>
                        {[row.tier1, row.tier2, row.tier3].map((val, i) => (
                          <div key={i} role="cell" className="col-span-1 flex justify-center items-center text-sm text-gray-600 dark:text-gray-400 text-center px-2">
                            {val === true ? <Check size={20} className="text-emerald-500" aria-label="Included" /> :
                              val === false ? <Minus size={16} className="text-gray-300" aria-label="Not Included" /> :
                              <span className="font-medium text-gray-900 dark:text-white">{val}</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section light className="bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center">How we work together</h2>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-0.5 bg-gray-200 dark:bg-gray-800 -translate-x-1/2"></div>

            <div className="space-y-12">
              {ENGAGEMENT_PROCESS.map((step, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 md:gap-16 items-start relative ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-4 border-emerald-500 -translate-x-1/2 z-10"></div>

                  <div className="flex-1 pl-20 md:pl-0 text-left md:text-right w-full">
                    <div className={`${i % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-2 block">{step.duration}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md ml-auto mr-0 inline-block">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Common Questions About {pricingMode === 'one-time' ? 'Pay Once' : 'Monthly'} Pricing
          </h2>
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pricingMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {currentFAQ.map((faq, i) => (
                  <details key={i} className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 open:shadow-lg transition-all duration-300">
                    <summary className="flex items-center justify-between p-8 font-semibold text-lg cursor-pointer list-none text-gray-900 dark:text-white select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl">
                      {faq.q}
                      <ChevronDown className="group-open:rotate-180 transition-transform text-gray-400 group-open:text-white" />
                    </summary>
                    <div className="px-8 pb-8 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </Section>

      <Section className="pb-32 pt-0">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[3rem] p-8 md:p-12 border border-emerald-100 dark:border-emerald-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left max-w-5xl mx-auto">
          <div className="flex-shrink-0 p-6 bg-emerald-100 dark:bg-emerald-800 rounded-full text-emerald-600 dark:text-emerald-200">
            <ShieldCheck size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {pricingMode === 'one-time'
                ? 'You Own Everything. Period.'
                : 'We\'re In This Together.'
              }
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {pricingMode === 'one-time'
                ? 'When we\'re done, you get the website, the code, all the accounts - everything. No monthly fees to us just to keep things running. No asking permission to make changes to your own stuff.'
                : 'Our success is tied to your success. We don\'t just build and disappear - we actively work to improve your results every month. When you grow, we grow together.'
              }
            </p>
          </div>
        </div>
      </Section>

      <Section className="pb-32 pt-0">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Book a quick call to discuss your project. We'll give you an honest assessment of what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={bookingModal.open}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-lg"
            >
              <Calendar size={20} />
              Book a Call
            </button>
            <NavLink to="/contact" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Or send us a message
            </NavLink>
          </div>
        </div>
      </Section>

      <CalBookingModal isOpen={bookingModal.isOpen} onClose={bookingModal.close} />
    </>
  );
};
