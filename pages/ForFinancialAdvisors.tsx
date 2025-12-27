import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, FileText, MessageSquare, FolderOpen, ArrowRight, Clock, TrendingUp, Lock } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';

export const ForFinancialAdvisors: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Client Automation for Financial Advisors",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "Compliant client intake, portfolio review scheduling, and prospect nurturing for financial advisors and wealth managers"
  };

  return (
    <>
      <SEO
        title="Client Automation for Financial Advisors"
        description="Compliant intake, automated review scheduling, and prospect nurturing. Built for financial advisors who want to grow AUM without growing admin work."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 border border-amber-100 dark:border-amber-800">
              For Financial Advisors
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              Grow Your AUM <span className="text-gray-400 dark:text-gray-500">Not Your Admin</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              Compliant client intake. Automatic portfolio review scheduling. Prospect nurturing that runs on autopilot. Focus on advice, not administration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Book a Free Practice Review
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Case Studies</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 p-10 border border-amber-200 dark:border-amber-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Annual Review Scheduled</p>
                      <p className="text-sm text-gray-500">Client self-booked for Q1</p>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Reminder sent automatically</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Prospect Engaged</p>
                      <p className="text-sm text-gray-500">Opened 3 nurture emails</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Intake Complete</p>
                      <p className="text-sm text-gray-500">KYC forms signed digitally</p>
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
              "Annual reviews get pushed back because scheduling is a hassle",
              "New client paperwork takes 3 meetings to complete",
              "Hot prospects go cold while you're busy with current clients",
              "Compliance documentation is scattered across systems"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that streamline client management, capture prospects, and keep you compliant.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Review Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Clients get automatic reminders to schedule their annual or quarterly reviews. They book directly on your calendar. No back-and-forth.
                </p>
                <ul className="space-y-3">
                  {["Automatic review reminders", "Self-service scheduling", "Prep materials auto-sent"].map((item, i) => (
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
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <Lock className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Compliant Digital Intake</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  New clients complete KYC, risk tolerance, and account forms before the first meeting. E-signatures included. Audit trail built-in.
                </p>
                <ul className="space-y-3">
                  {["Digital KYC forms", "E-signature integration", "Automatic compliance archive"].map((item, i) => (
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
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Prospect Nurturing</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Prospects get valuable content over time, building trust automatically. When they're ready to move, they book a discovery call themselves.
                </p>
                <ul className="space-y-3">
                  {["Automated email sequences", "Educational content delivery", "Engagement tracking"].map((item, i) => (
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

      <Section light className="bg-amber-50 dark:bg-amber-900/10 border-y border-amber-100 dark:border-amber-900/30">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Results
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">What Advisors Are Seeing</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Financial advisors using our systems are meeting with more clients and converting more prospects without adding staff. The key is removing friction from every step.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "100% of clients get annual review invites",
                  "New client onboarding drops from 3 meetings to 1",
                  "30% more prospects convert to clients"
                ].map((result, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result}</span>
                  </div>
                ))}
              </div>
              <NavLink to="/work" className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold hover:underline">
                View Case Studies <ArrowRight size={18} />
              </NavLink>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-amber-200 dark:border-amber-800 shadow-xl">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">3x</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Faster client onboarding</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Clock className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3 meetings</p>
                  <p className="text-sm text-gray-500">Traditional intake</p>
                </div>
                <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1 meeting</p>
                  <p className="text-sm text-gray-500">With automation</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-900 dark:bg-black">
        <Container size="md">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 text-gray-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              Compliance Note
            </div>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              All systems are designed with financial services compliance in mind. Audit trails, secure document storage, and proper record-keeping are built into every workflow.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">More client time. Less paperwork.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll look at your current workflows and show you exactly where automation can help you grow.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Book Your Free Practice Review
          </Button>
          <p className="text-sm text-gray-400 mt-4">Designed for compliance-conscious advisors</p>
        </Container>
      </Section>
    </>
  );
};
