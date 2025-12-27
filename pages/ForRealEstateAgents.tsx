import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, Home, Users, ArrowRight, Clock, Zap } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';

export const ForRealEstateAgents: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Lead Automation for Real Estate Agents",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "Instant lead response, automated follow-ups, and showing scheduling for real estate agents and brokerages"
  };

  return (
    <>
      <SEO
        title="Lead Automation for Real Estate Agents"
        description="Respond to leads in seconds, not hours. Automated follow-ups, showing scheduling, and CRM organization for real estate agents who want to close more deals."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-widest mb-8 border border-teal-100 dark:border-teal-800">
              For Real Estate Agents
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              Stop Losing Deals <span className="text-gray-400 dark:text-gray-500">to Faster Agents</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              When you're at a showing, your AI responds to new leads instantly. Automatic follow-ups. Showing scheduling. Never lose a buyer to slow response again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Book a Free Lead Audit
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Case Studies</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-teal-100 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/20 p-10 border border-teal-200 dark:border-teal-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">New Lead Captured</p>
                      <p className="text-sm text-gray-500">Zillow inquiry - 4BR in Oakville</p>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">AI responded in 12 seconds</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Showing Booked</p>
                      <p className="text-sm text-gray-500">Saturday 2pm confirmed</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Follow-Up Sent</p>
                      <p className="text-sm text-gray-500">Day 3 check-in automated</p>
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
              "Leads from Zillow and Realtor.com go cold before you call back",
              "You're at showings when hot buyers are trying to reach you",
              "Follow-ups fall through the cracks during busy weeks",
              "Your CRM is a mess of outdated contacts and missed tasks"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that capture every lead, follow up automatically, and keep your pipeline organized.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instant Lead Response</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  New leads get a personalized response within 60 seconds - even at 2am. Your AI qualifies buyers, answers questions, and books showings automatically.
                </p>
                <ul className="space-y-3">
                  {["Sub-60-second response time", "Works with all lead sources", "Qualifies buyer intent upfront"].map((item, i) => (
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Follow-Up Sequences</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Buyers get nurturing messages at the perfect intervals. Day 1, day 3, day 7 - personalized texts that keep you top of mind without lifting a finger.
                </p>
                <ul className="space-y-3">
                  {["Timed drip sequences", "Personalized to property interest", "Know when they engage"].map((item, i) => (
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Showing Scheduler</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Buyers book showings directly on your calendar. No back-and-forth texts. Automatic reminders reduce no-shows by 40%.
                </p>
                <ul className="space-y-3">
                  {["Self-service booking", "Calendar sync & conflict checks", "Automated showing reminders"].map((item, i) => (
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

      <Section light className="bg-teal-50 dark:bg-teal-900/10 border-y border-teal-100 dark:border-teal-900/30">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Results
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">What Agents Are Seeing</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Real estate agents using our systems are converting more leads and spending less time on admin work. The difference comes down to speed and consistency.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "3x more leads convert to showings",
                  "Response time drops from hours to seconds",
                  "10+ hours saved per week on follow-ups"
                ].map((result, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result}</span>
                  </div>
                ))}
              </div>
              <NavLink to="/work" className="inline-flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold hover:underline">
                View Case Studies <ArrowRight size={18} />
              </NavLink>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-teal-200 dark:border-teal-800 shadow-xl">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">78%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Of buyers choose the first agent who responds</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Clock className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5 hrs</p>
                  <p className="text-sm text-gray-500">Average response</p>
                </div>
                <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <Zap className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12 sec</p>
                  <p className="text-sm text-gray-500">With automation</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Be the first agent to respond. Every time.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll audit your current lead flow and show you exactly where deals are slipping away.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Book Your Free Lead Audit
          </Button>
          <p className="text-sm text-gray-400 mt-4">Most agents see ROI within their first month</p>
        </Container>
      </Section>
    </>
  );
};
