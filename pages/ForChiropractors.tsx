import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, Users, ArrowRight, Clock, CalendarCheck, Activity } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';

export const ForChiropractors: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Patient Automation for Chiropractic Practices",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "Automated appointment reminders, patient intake, and recall systems for chiropractic clinics"
  };

  return (
    <>
      <SEO
        title="Patient Automation for Chiropractors"
        description="Reduce no-shows, automate patient recalls, and streamline intake. Built specifically for chiropractic practices that want to see more patients with less admin."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase tracking-widest mb-8 border border-sky-100 dark:border-sky-800">
              For Chiropractors
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              Fill Your Schedule <span className="text-gray-400 dark:text-gray-500">Without the Calls</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              Automatic appointment reminders. Digital intake forms. Patient recall that runs itself. Spend time adjusting, not on the phone.
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
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-sky-100 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/20 p-10 border border-sky-200 dark:border-sky-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Appointment Confirmed</p>
                      <p className="text-sm text-gray-500">Mike T. tapped to confirm</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Recall Successful</p>
                      <p className="text-sm text-gray-500">Inactive patient rebooked</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Intake Completed</p>
                      <p className="text-sm text-gray-500">New patient ready for visit</p>
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
              "Staff spends hours calling to confirm appointments",
              "No-shows leave gaps in your schedule",
              "Patients who need follow-up care don't come back",
              "New patients fill out paperwork in the waiting room"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that reduce no-shows, bring patients back, and streamline your front desk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automatic Reminders</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Patients get text reminders at 48hrs, 24hrs, and 2hrs. One tap to confirm. No-show rates drop 30-50% without your staff touching a phone.
                </p>
                <ul className="space-y-3">
                  {["SMS reminders on autopilot", "One-tap confirmation", "Automatic rescheduling options"].map((item, i) => (
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
                  <CalendarCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Patient Recall System</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Patients who haven't been in for 30, 60, or 90 days get automatic outreach. Bring back lapsed patients without manual tracking.
                </p>
                <ul className="space-y-3">
                  {["Automatic reactivation campaigns", "Personalized messaging", "Track who comes back"].map((item, i) => (
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
                  <Activity className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Digital Intake Forms</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  New patients complete health history, consent forms, and insurance info before they arrive. Start adjusting immediately.
                </p>
                <ul className="space-y-3">
                  {["Mobile-friendly forms", "Auto-sent before appointment", "HIPAA-compliant storage"].map((item, i) => (
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

      <Section light className="bg-sky-50 dark:bg-sky-900/10 border-y border-sky-100 dark:border-sky-900/30">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                Results
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">What Practices Are Seeing</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Chiropractic practices using our systems are seeing more patients with less front desk work. The combination of fewer no-shows and better recalls fills schedules fast.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "35% reduction in no-shows",
                  "20% increase in patient retention",
                  "15+ hours saved on phone calls weekly"
                ].map((result, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result}</span>
                  </div>
                ))}
              </div>
              <NavLink to="/work" className="inline-flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold hover:underline">
                View Case Studies <ArrowRight size={18} />
              </NavLink>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-sky-200 dark:border-sky-800 shadow-xl">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">35%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Fewer no-shows</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Before</span>
                    <span className="text-gray-900 dark:text-white font-bold">15% no-show rate</span>
                  </div>
                  <div className="h-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <div className="h-full w-[15%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">After</span>
                    <span className="text-gray-900 dark:text-white font-bold">10% no-show rate</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="h-full w-[10%] bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">More patients, less phone time.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll look at your current no-show rate and show you exactly how much you could recover.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Book Your Free Practice Analysis
          </Button>
          <p className="text-sm text-gray-400 mt-4">Most practices see ROI within the first month</p>
        </Container>
      </Section>
    </>
  );
};
