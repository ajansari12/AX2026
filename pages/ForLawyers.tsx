import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, Clock, Scale, ArrowRight, Zap } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';

export const ForLawyers: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Intake Automation for Law Firms",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "AI-powered intake, instant lead response, and qualification for solo practitioners and small law firms"
  };

  return (
    <>
      <SEO
        title="AI Intake & Automation for Law Firms"
        description="Respond to legal inquiries in seconds, not hours. AI-powered intake, qualification, and scheduling for solo practitioners and small law firms."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest mb-8 border border-slate-200 dark:border-slate-700">
              For Law Firms
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              Stop Losing Clients <span className="text-gray-400 dark:text-gray-500">to Faster Firms</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              When you're in court, your AI handles intake. It qualifies leads, schedules consultations, and gathers case details - before you even return to the office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Book a Free Intake Audit
              </Button>
              <NavLink to="/work/legal-firm-lead-gen">
                <Button variant="outline" size="lg">See Case Study</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-slate-100 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/30 p-10 border border-slate-200 dark:border-slate-700">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">New Lead Qualified</p>
                      <p className="text-sm text-gray-500">Personal injury - car accident</p>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Response time: 8 seconds</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Consultation Booked</p>
                      <p className="text-sm text-gray-500">Tomorrow at 2:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Case Summary Ready</p>
                      <p className="text-sm text-gray-500">All intake info compiled</p>
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
              "Potential clients hire whoever calls back first",
              "Voicemail is where leads go to die",
              "Intake forms get filled out wrong or not at all",
              "Associates waste time on unqualified consultations"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that capture every potential client and qualify them before you get on the phone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Intake Assistant</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Your AI answers calls 24/7, asks qualifying questions (accident date, injuries, insurance), and books consultations only with qualified prospects.
                </p>
                <ul className="space-y-3">
                  {["Instant response, even at 2am", "Pre-qualifies before your time", "Gathers case details upfront"].map((item, i) => (
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
                  <MessageSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instant Lead Response</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Website form submissions get a response in under 60 seconds - even at 2am on a weekend. No more losing clients to faster firms.
                </p>
                <ul className="space-y-3">
                  {["Sub-60-second response time", "Personalized follow-up sequences", "SMS + email combined"].map((item, i) => (
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
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Conflict-Free Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  New consultations book directly on your calendar, checking conflicts and court dates automatically. No double-booking.
                </p>
                <ul className="space-y-3">
                  {["Syncs with your calendar", "Blocks court dates automatically", "Sends prep materials to clients"].map((item, i) => (
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

      <Section light className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Case Study
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Harrison & Co. Law</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Lawyers were in court when potential clients called. By the time they called back hours later, those clients had already hired another firm that picked up.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "2x consultations, 12 new cases in 30 days",
                  "Response time: 4 hours to 8 seconds",
                  "Estimated $180K+ in new case revenue"
                ].map((result, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result}</span>
                  </div>
                ))}
              </div>
              <NavLink to="/work/legal-firm-lead-gen" className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold hover:underline">
                Read Full Case Study <ArrowRight size={18} />
              </NavLink>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">2x</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">More consultations booked</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Clock className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">4 hrs</p>
                  <p className="text-sm text-gray-500">Old response time</p>
                </div>
                <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <Zap className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8 sec</p>
                  <p className="text-sm text-gray-500">New response time</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-900 dark:bg-black">
        <Container size="md">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              Ethics Note
            </div>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              All AI responses are reviewed to ensure compliance with bar advertising rules. We never guarantee outcomes or make claims that could violate ethics guidelines. Your reputation matters.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Never lose another client to a faster firm.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll audit your current intake process and show you exactly where you're losing potential clients.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Book Your Free Intake Audit
          </Button>
          <p className="text-sm text-gray-400 mt-4">No pitch, no pressure - just an honest assessment</p>
        </Container>
      </Section>
    </>
  );
};
