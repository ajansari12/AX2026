import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, Users, ArrowRight, Clock, Heart, Syringe } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';

export const ForVeterinarians: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Pet Owner Automation for Veterinary Clinics",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "Automated vaccination reminders, appointment scheduling, and pet owner communication for veterinary practices"
  };

  return (
    <>
      <SEO
        title="Pet Owner Automation for Veterinary Clinics"
        description="Never miss a vaccination reminder. Reduce no-shows, fill cancellations, and keep pet owners engaged. Built specifically for veterinary practices."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-widest mb-8 border border-rose-100 dark:border-rose-800">
              For Veterinarians
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              Keep Pets Healthy <span className="text-gray-400 dark:text-gray-500">Automatically</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              Automatic vaccination reminders. Appointment confirmations. Waitlist management. Focus on caring for animals, not chasing pet owners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Book a Free Practice Analysis
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Case Studies</Button>
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
                      <p className="text-sm text-gray-500">Max (Golden Retriever) - Checkup</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Syringe className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Vaccine Reminder Sent</p>
                      <p className="text-sm text-gray-500">Rabies due in 30 days</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Cancellation Filled</p>
                      <p className="text-sm text-gray-500">Waitlist pet booked in 12 min</p>
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
              "Staff spends hours calling to remind owners about vaccines",
              "No-shows leave gaps in your schedule",
              "Cancelled appointments stay empty",
              "Follow-up care instructions get ignored"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that keep pets on schedule, fill your appointments, and improve compliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                  <Syringe className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Vaccination Reminders</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Pet owners get automatic reminders 30, 14, and 7 days before vaccines are due. They can book directly from the text. Compliance rates soar.
                </p>
                <ul className="space-y-3">
                  {["Automatic vaccine tracking", "SMS + email reminders", "One-tap booking links"].map((item, i) => (
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appointment Confirmations</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Pet owners confirm appointments with one tap. No-show rates drop dramatically. Staff stops making confirmation calls.
                </p>
                <ul className="space-y-3">
                  {["48hr, 24hr, 2hr reminders", "One-tap confirmation", "Easy rescheduling option"].map((item, i) => (
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
                  <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Waitlist Auto-Fill</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  When someone cancels, your waitlist gets texted instantly. First to respond gets the slot. Empty appointments become revenue.
                </p>
                <ul className="space-y-3">
                  {["Instant waitlist alerts", "First-come booking", "Zero manual coordination"].map((item, i) => (
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

      <Section light className="bg-rose-50 dark:bg-rose-900/10 border-y border-rose-100 dark:border-rose-900/30">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Results
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">What Practices Are Seeing</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Veterinary practices using our systems are seeing more pets and spending less time on the phone. The combination of better reminders and waitlist management keeps schedules full.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "40% improvement in vaccine compliance",
                  "30% fewer no-shows",
                  "15+ hours saved on phone calls weekly"
                ].map((result, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result}</span>
                  </div>
                ))}
              </div>
              <NavLink to="/work" className="inline-flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold hover:underline">
                View Case Studies <ArrowRight size={18} />
              </NavLink>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-rose-200 dark:border-rose-800 shadow-xl">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">40%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Better vaccine compliance</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Before</span>
                    <span className="text-gray-900 dark:text-white font-bold">55% on-time vaccines</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div className="h-full w-[55%] bg-rose-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">After</span>
                    <span className="text-gray-900 dark:text-white font-bold">77% on-time vaccines</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="h-full w-[77%] bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Healthier pets. Happier practice.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll look at your current workflows and show you exactly where automation can help.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Book Your Free Practice Analysis
          </Button>
          <p className="text-sm text-gray-400 mt-4">Most practices see ROI from improved compliance alone</p>
        </Container>
      </Section>
    </>
  );
};
