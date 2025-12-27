import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, FileText, ArrowRight, Clock, Shield, RefreshCw } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';

export const ForInsuranceAgents: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Lead & Renewal Automation for Insurance Agents",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "Automated lead follow-up, policy renewal reminders, and client communication for insurance agents and agencies"
  };

  return (
    <>
      <SEO
        title="Lead & Renewal Automation for Insurance Agents"
        description="Never miss a renewal or let a lead go cold. Automated follow-ups, renewal reminders, and quote systems for insurance agents who want to grow their book."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100 dark:border-blue-800">
              For Insurance Agents
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              Never Lose a Renewal <span className="text-gray-400 dark:text-gray-500">or Lead Again</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              Automatic renewal reminders. Instant quote follow-ups. Policy review scheduling that runs itself. Focus on relationships, not reminders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Book a Free Pipeline Review
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Case Studies</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 p-10 border border-blue-200 dark:border-blue-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Renewal Reminder Sent</p>
                      <p className="text-sm text-gray-500">Auto policy expires in 45 days</p>
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Review scheduled for next week</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Quote Follow-Up</p>
                      <p className="text-sm text-gray-500">Day 3 check-in sent</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">New Lead Qualified</p>
                      <p className="text-sm text-gray-500">Home + Auto bundle interest</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section light className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <Container size="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Sound Familiar?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Renewals slip through the cracks and clients leave",
              "Quote requests sit for days before follow-up",
              "Tracking policy dates across hundreds of clients is impossible",
              "Cross-sell opportunities get missed in the chaos"
            ].map((pain, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">{i + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{pain}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">How We Fix It</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that protect your renewals, capture every lead, and surface cross-sell opportunities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                  <RefreshCw className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Renewal Automation</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Clients get automatic reminders 60, 45, and 30 days before renewal. They can schedule a review call with one click. No more lost policies.
                </p>
                <ul className="space-y-3">
                  {["Automatic renewal alerts", "Self-schedule review calls", "Tracks all policy dates"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instant Quote Follow-Up</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  New quote requests get an immediate response. Automatic follow-ups at day 1, 3, and 7 keep you top of mind until they decide.
                </p>
                <ul className="space-y-3">
                  {["Sub-60-second response", "Timed follow-up sequences", "Know when they engage"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cross-Sell Intelligence</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  See which clients have gaps in coverage. Auto-campaigns reach out about bundling opportunities. Grow your book without cold calls.
                </p>
                <ul className="space-y-3">
                  {["Identifies coverage gaps", "Automated outreach campaigns", "Tracks conversion rates"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section light className="bg-blue-50 dark:bg-blue-900/10 border-y border-blue-100 dark:border-blue-900/30">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Results
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">What Agents Are Seeing</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Insurance agents using our systems are retaining more clients and closing more quotes. The key is consistent, timely communication without manual effort.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "95%+ renewal retention rate",
                  "2x quote-to-policy conversion",
                  "15% increase in policies per client"
                ].map((result, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result}</span>
                  </div>
                ))}
              </div>
              <NavLink to="/work" className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold hover:underline">
                View Case Studies <ArrowRight size={18} />
              </NavLink>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-blue-200 dark:border-blue-800 shadow-xl">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">95%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Renewal retention rate</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Clock className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                  <p className="text-sm text-gray-500">Without automation</p>
                </div>
                <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">95%+</p>
                  <p className="text-sm text-gray-500">With automation</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Protect your book. Grow it automatically.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll audit your current renewal process and show you exactly where policies are at risk.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Book Your Free Pipeline Review
          </Button>
          <p className="text-sm text-gray-400 mt-4">Most agents see ROI from saved renewals alone</p>
        </Container>
      </Section>
    </>
  );
};
