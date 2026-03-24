import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, MessageSquare, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { RelatedArticles } from '../components/RelatedArticles';

export const ForGyms: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Automation for Gyms and Fitness Studios",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "24/7 AI membership chat, automated retention milestone messages, and churn early warning for gyms and fitness studios"
  };

  return (
    <>
      <SEO
        title="AI & Automation for Gyms & Fitness Studios"
        description="New members visit your website at 11pm — is anyone there? AI chat converts leads 24/7. Automated retention messages. Churn early warning catches members before they leave."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100 dark:border-emerald-800">
              For Gyms & Fitness
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              New Members Are Visiting Your Gym Website at 11pm <span className="text-gray-400 dark:text-gray-500">— Is Anyone There?</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              We build AI and automation for gyms and fitness studios. AI chat converts membership inquiries 24/7. Automated milestone messages keep members engaged. Churn early warning catches at-risk members before they cancel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Add AI to Your Gym's Website
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Our Work</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-emerald-100 to-lime-50 dark:from-emerald-900/30 dark:to-lime-900/20 p-10 border border-emerald-200 dark:border-emerald-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Trial Signup at 11:14pm</p>
                      <p className="text-sm text-gray-500">AI chat answered membership questions</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Day 30 Milestone Sent</p>
                      <p className="text-sm text-gray-500">"Great work — 30 days strong!"</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Churn Warning Triggered</p>
                      <p className="text-sm text-gray-500">Visit drop detected — re-engage sent</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              "Leads who inquire about membership don't hear back fast enough — prospects who visit your website at night book with the gym that responds first in the morning",
              "Member retention is reactive — you only find out someone is about to cancel when they walk in to cancel, by which point it's already too late to win them back",
              "Class schedule questions flood your front desk staff all day — simple questions that take time away from sign-ins, tours, and actual member interactions"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that convert more leads, keep members longer, and free your staff from repetitive questions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Chat for Membership Questions, Pricing & Class Schedules 24/7</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  An AI chat assistant on your website answers membership questions, pricing, class schedules, and trial signup details at any hour. Most conversions happen between 8pm and midnight — your AI is there when your staff isn't.
                </p>
                <ul className="space-y-3">
                  {["Answers pricing, schedule, and membership questions", "Converts trial signups at night and on weekends", "Front desk freed from repetitive FAQ calls"].map((item, i) => (
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
                  <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Check-In Milestone Messages</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Members receive automatic milestone messages at day 7, day 30, and day 90. These touchpoints celebrate progress, reinforce the habit, and build the kind of loyalty that keeps members renewing year after year.
                </p>
                <ul className="space-y-3">
                  {["Day 7, 30, and 90 milestone messages", "Personalized celebration of their progress", "Builds loyalty and reduces early cancellations"].map((item, i) => (
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
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Churn Early Warning Based on Visit Frequency Drop</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  When a member's visit frequency drops below their normal pattern, the system flags it and triggers a re-engagement message automatically. You catch at-risk members early — before they've already decided to cancel.
                </p>
                <ul className="space-y-3">
                  {["Detects visit frequency drop in real time", "Auto re-engagement message sent to at-risk members", "Catch cancellations before they happen"].map((item, i) => (
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

      <Section light className="bg-emerald-50 dark:bg-emerald-900/10 border-y border-emerald-100 dark:border-emerald-900/30">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Case Study
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Iron & Oak Fitness (Hamilton)</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Iron & Oak Fitness was losing evening leads who visited their website after hours and got no response. Their staff also had no visibility into which members were drifting toward cancellation. We added 24/7 AI chat and a churn early warning system.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "52% more trial signups after adding 24/7 AI chat",
                  "Most conversions happened between 8pm and midnight",
                  "At-risk member flags catch churn before it happens"
                ].map((result, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result}</span>
                  </div>
                ))}
              </div>
              <NavLink to="/work" className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
                See More Case Studies <ArrowRight size={18} />
              </NavLink>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-emerald-200 dark:border-emerald-800 shadow-xl">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">52%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">More trial signups after adding 24/7 AI chat</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Evening/weekend conversions before</span>
                    <span className="text-gray-900 dark:text-white font-bold">Near 0%</span>
                  </div>
                  <div className="h-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <div className="h-full w-[4%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Evening/weekend conversions after</span>
                    <span className="text-gray-900 dark:text-white font-bold">Majority of new signups</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="h-full w-[75%] bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-4 italic">
                Results are representative of typical client outcomes in this industry. Individual results vary.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <RelatedArticles slugs={['speed-to-lead-rule', 'client-retention', 'ai-agents-guide']} />

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">The leads visiting your site at 11pm deserve an answer.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll show you how many leads you're missing after hours and how churn detection could change your retention numbers.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Add AI to Your Gym's Website
          </Button>
          <p className="text-sm text-gray-400 mt-4">No pitch, no pressure — just an honest assessment</p>
        </Container>
      </Section>
    </>
  );
};
