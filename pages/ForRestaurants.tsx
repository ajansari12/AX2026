import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { RelatedArticles } from '../components/RelatedArticles';

export const ForRestaurants: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Automation for Restaurants",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "AI phone agent for reservations, automated deposit collection, and Google review follow-up for restaurants"
  };

  return (
    <>
      <SEO
        title="AI & Automation for Restaurants"
        description="Stop phones ringing during dinner rush. AI handles reservations, hours, and menu questions. Automated deposits eliminate no-shows. Review follow-up runs itself."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-8 border border-orange-100 dark:border-orange-800">
              For Restaurants
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              60% of Diners Call to Ask Questions <span className="text-gray-400 dark:text-gray-500">Your Website Already Answers</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              We build AI and automation systems for restaurants. AI phone agents for reservations and FAQs, automated deposit collection, and review follow-up after every visit — so your staff focuses on guests, not phones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                See How It Works for Restaurants
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Our Work</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20 p-10 border border-orange-200 dark:border-orange-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Reservation Confirmed</p>
                      <p className="text-sm text-gray-500">AI handled call — staff not interrupted</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Review Request Sent</p>
                      <p className="text-sm text-gray-500">Auto follow-up 1hr after visit</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Deposit Collected</p>
                      <p className="text-sm text-gray-500">Party of 8 — no-show prevented</p>
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
              "Phones ring during dinner rush — staff is pulled away from tables to answer basic questions about hours and menu",
              "Large party no-shows cost you hundreds with no deposit system and no automated reminders in place",
              "Review management is fully manual — you remember to ask some guests but forget most, and your rating suffers for it"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that free your staff, eliminate no-shows, and build your reputation automatically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Phone Agent for Reservations & FAQs</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  An AI agent answers calls with your hours, menu highlights, specials, and takes reservations — without a single staff member picking up the phone during service.
                </p>
                <ul className="space-y-3">
                  {["Handles hours, menu, and reservation questions", "Takes bookings and sends confirmations", "Frees staff to focus entirely on guests"].map((item, i) => (
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Deposit Collection & Reminders</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Collect deposits from large parties automatically at booking. Send reminder texts before the reservation. No-shows drop dramatically with zero manual effort.
                </p>
                <ul className="space-y-3">
                  {["Deposits collected at time of booking", "Automated SMS reminders pre-reservation", "No-shows virtually eliminated for large groups"].map((item, i) => (
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
                  <Star className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Google Review Follow-Up After Every Visit</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  An automated message goes out after every reservation, asking happy guests to leave a Google review. Your rating grows consistently without anyone remembering to ask.
                </p>
                <ul className="space-y-3">
                  {["Auto-triggered after each completed visit", "Direct link to your Google review page", "Rating grows on autopilot, every week"].map((item, i) => (
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Bella Cucina (Toronto)</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Bella Cucina was constantly pulling servers off the floor to answer phones during the dinner rush. Their hosts spent half their shift answering the same questions about hours, the menu, and reservation availability. We set up an AI phone agent and automated review follow-up.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "45% reduction in phone interruptions during service",
                  "AI handles hours, menu, and reservation questions",
                  "Staff focuses entirely on guests — not the phone"
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
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">45%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Reduction in service-hour phone interruptions</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Before</span>
                    <span className="text-gray-900 dark:text-white font-bold">~22 calls/dinner service</span>
                  </div>
                  <div className="h-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <div className="h-full w-[88%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">After</span>
                    <span className="text-gray-900 dark:text-white font-bold">~12 calls/dinner service</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="h-full w-[48%] bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <RelatedArticles slugs={['speed-to-lead-rule', 'automating-boring-stuff', 'ai-agents-guide']} />

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Your staff deserves to focus on hospitality, not phones.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll show you exactly how AI can reduce interruptions during service and automate your review follow-up.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            See How It Works for Restaurants
          </Button>
          <p className="text-sm text-gray-400 mt-4">No pitch, no pressure — just an honest assessment</p>
        </Container>
      </Section>
    </>
  );
};
