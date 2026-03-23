import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, Users, ArrowRight } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { RelatedArticles } from '../components/RelatedArticles';

export const ForMedSpas: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Automation for Med Spas and Aesthetic Clinics",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "AI receptionist, automated intake forms, and waitlist management for med spas, aesthetic clinics, and beauty businesses"
  };

  return (
    <>
      <SEO
        title="AI & Automation for Med Spas & Aesthetic Clinics"
        description="Reduce no-shows by 28% and save $38K annually. AI receptionist handles hours, pricing, and bookings. Automated intake forms. Waitlist fills cancellations in minutes."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-widest mb-8 border border-rose-100 dark:border-rose-800">
              For Med Spas & Aesthetics
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              Your Front Desk Is Your Most Expensive Employee <span className="text-gray-400 dark:text-gray-500">— Let AI Help</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              We build AI and automation for med spas and aesthetic clinics. An AI receptionist handles the front desk 24/7. Intake forms complete themselves before arrival. Cancellations fill before you even notice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Book a Free AI Consultation
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Our Work</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20 p-10 border border-rose-200 dark:border-rose-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Appointment Confirmed</p>
                      <p className="text-sm text-gray-500">AI handled booking at 11:30pm</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Intake Form Completed</p>
                      <p className="text-sm text-gray-500">Submitted before arrival — 0 paper forms</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Waitlist Slot Filled</p>
                      <p className="text-sm text-gray-500">Cancellation filled in 4 minutes</p>
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
              "Appointment no-shows cost you $150–$800 per empty slot — and with no deposit system or reminders, they happen constantly",
              "Intake and consent forms are done manually at reception, slowing check-in and adding admin work to every single appointment",
              "Online booking leads go cold because no one follows up fast enough — potential clients book with whoever responds first"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that eliminate wasted slots, streamline check-in, and fill your calendar automatically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Receptionist</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  An AI receptionist handles hours, pricing, treatments, and booking — 24 hours a day. Prospective clients get answers instantly, whether it's 2pm or 2am, and book without waiting for a callback.
                </p>
                <ul className="space-y-3">
                  {["Answers hours, pricing, and treatment questions", "Books appointments 24/7 via chat or text", "Responds in seconds — never loses a lead to a competitor"].map((item, i) => (
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Pre-Appointment Intake Forms</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Intake and consent forms are sent automatically when a booking is confirmed. Clients complete them before they arrive. Zero paper forms at reception and faster check-in every time.
                </p>
                <ul className="space-y-3">
                  {["Forms sent automatically at booking confirmation", "Completed digitally before arrival", "Zero paper forms, faster check-in, cleaner records"].map((item, i) => (
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
                  <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Waitlist Management That Fills Cancellations in Minutes</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  When a cancellation comes in, your waitlist is notified instantly. The first person to respond gets the slot. Empty appointment slots become a thing of the past.
                </p>
                <ul className="space-y-3">
                  {["Instant waitlist notification on cancellation", "First-come-first-served slot filling", "Average fill time under 10 minutes"].map((item, i) => (
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Glow Studio (Mississauga)</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Glow Studio had a no-show problem costing them thousands per month. Their receptionist also spent hours on intake forms, phone calls, and manual follow-ups. We set up full AI reception, automated intake, and waitlist management.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "28% no-show reduction = $38K saved annually",
                  "Intake forms completed before arrival — 0 paper forms at reception",
                  "Cancellations consistently filled within minutes via waitlist"
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
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">$38K</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Saved annually from 28% no-show reduction</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">No-show rate before</span>
                    <span className="text-gray-900 dark:text-white font-bold">~18%</span>
                  </div>
                  <div className="h-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <div className="h-full w-[72%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">No-show rate after</span>
                    <span className="text-gray-900 dark:text-white font-bold">~13%</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="h-full w-[52%] bg-emerald-500 rounded-full"></div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Empty slots are costing you more than you think.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll calculate your no-show cost and show you exactly what AI automation could save you.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Book a Free AI Consultation
          </Button>
          <p className="text-sm text-gray-400 mt-4">No pitch, no pressure — just an honest assessment</p>
        </Container>
      </Section>
    </>
  );
};
