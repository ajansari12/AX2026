import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, Phone, MessageSquare, CalendarCheck, ArrowRight } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { RelatedArticles } from '../components/RelatedArticles';

export const ForAutoRepair: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Automation for Auto Repair Shops",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "AI appointment booking, automated vehicle status updates, and declined service follow-up for auto repair shops"
  };

  return (
    <>
      <SEO
        title="AI & Automation for Auto Repair Shops"
        description="8 out of 10 customers choose the shop that responds first. AI handles bookings 24/7. Automated status updates keep customers informed. Declined services get followed up automatically."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 border border-gray-200 dark:border-gray-700">
              For Auto Repair Shops
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              8 Out of 10 Customers Choose the Shop <span className="text-gray-400 dark:text-gray-500">That Responds First</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              We build AI and automation for auto repair shops. AI handles appointment booking and service questions 24/7. Customers get automatic status updates. Declined services get followed up — without your advisors spending time on the phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Get a Free AI Demo for Your Shop
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Our Work</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-gray-100 to-orange-50 dark:from-gray-800/50 dark:to-orange-900/20 p-10 border border-gray-200 dark:border-gray-700">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CalendarCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Booking Made at 10pm</p>
                      <p className="text-sm text-gray-500">AI confirmed — shop was closed</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Status Update Sent</p>
                      <p className="text-sm text-gray-500">"Your car is ready for pickup"</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Declined Service Follow-Up</p>
                      <p className="text-sm text-gray-500">Brakes follow-up sent — 30 days later</p>
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
              "Your service advisor is on the phone constantly — answering the same questions about availability, pricing, and service status instead of working with customers in-shop",
              "Estimates take too long because customers need to call back for answers, and jobs pile up while advisors play phone tag",
              "Customers have no idea when their car is ready and keep calling to check in — adding more interruptions to an already busy day"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that get your techs focused on cars — not customer calls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                  <CalendarCheck className="w-7 h-7 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Handles Booking, Service Questions & Estimates Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  AI answers calls and chats around the clock — booking appointments, answering service questions, and queuing estimates — even when your shop is closed or your advisors are busy with walk-ins.
                </p>
                <ul className="space-y-3">
                  {["Bookings captured 24/7 including evenings", "Service questions answered without staff", "40% of bookings now happen outside business hours"].map((item, i) => (
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
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Vehicle Status Updates</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Customers receive automatic text updates at every stage — car dropped off, service started, ready for pickup. Zero status-check calls, zero interruptions, and happier customers throughout.
                </p>
                <ul className="space-y-3">
                  {["Dropped off, in-progress, and ready-for-pickup texts", "Customers never need to call to check in", "Advisor time freed for in-shop work"].map((item, i) => (
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
                  <Phone className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quote Follow-Up for Declined Services</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  When a customer declines a service recommendation, a follow-up sequence starts automatically — reminding them at 30 days, 60 days, and before their next likely service date. Revenue that used to walk out the door comes back.
                </p>
                <ul className="space-y-3">
                  {["Auto follow-up on every declined service", "Timed reminders at 30 and 60 days", "Revenue recovered with zero advisor effort"].map((item, i) => (
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">FastFix Auto (Brampton)</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                FastFix Auto was losing after-hours bookings to competitors who had online scheduling. Their advisors were also constantly interrupted by status-check calls. We set up 24/7 AI booking and automated status updates.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "40% of appointment bookings now happen outside business hours via AI chat",
                  "Tech team can focus on cars, not phones",
                  "Status-check calls dropped significantly after automated updates launched"
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
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">40%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Of bookings now happen outside business hours</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">After-hours bookings before</span>
                    <span className="text-gray-900 dark:text-white font-bold">~0%</span>
                  </div>
                  <div className="h-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <div className="h-full w-[2%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">After-hours bookings after</span>
                    <span className="text-gray-900 dark:text-white font-bold">40% of total</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="h-full w-[40%] bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <RelatedArticles slugs={['speed-to-lead-rule', 'automating-boring-stuff', 'zapier-automations']} />

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Let your tech team focus on what they're best at — fixing cars.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll walk through your current booking and customer communication flow and show you exactly where AI can help.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            Get a Free AI Demo for Your Shop
          </Button>
          <p className="text-sm text-gray-400 mt-4">No pitch, no pressure — just an honest assessment</p>
        </Container>
      </Section>
    </>
  );
};
