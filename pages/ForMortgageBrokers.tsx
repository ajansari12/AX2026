import React from 'react';
import { NavLink } from 'react-router-dom';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Check, Calendar, MessageSquare, FileText, Users, ArrowRight } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { RelatedArticles } from '../components/RelatedArticles';

export const ForMortgageBrokers: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Automation for Mortgage Brokers",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Axrategy"
    },
    "areaServed": ["Canada", "United States"],
    "description": "Instant AI lead pre-qualification, automated document collection, and referral partner nurture sequences for mortgage brokers"
  };

  return (
    <>
      <SEO
        title="AI & Automation for Mortgage Brokers"
        description="The first broker to respond gets the deal. Cut lead response time from 4 hours to 8 seconds. AI pre-qualification, automated document collection, and referral follow-up."
        schema={schema}
      />

      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-widest mb-8 border border-teal-100 dark:border-teal-800">
              For Mortgage Brokers
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
              The First Broker to Respond <span className="text-gray-400 dark:text-gray-500">Gets the Deal — Are You First?</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              We build AI and automation for mortgage brokers. Instant pre-qualification via AI chat. Document collection that doesn't drag on for weeks. Referral partner follow-up that never gets forgotten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                See Your Automation Score — Free
              </Button>
              <NavLink to="/work">
                <Button variant="outline" size="lg">See Our Work</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-teal-100 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/20 p-10 border border-teal-200 dark:border-teal-800">
              <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Lead Responded in 8s</p>
                      <p className="text-sm text-gray-500">AI pre-qual chat triggered instantly</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 ml-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Document Uploaded</p>
                      <p className="text-sm text-gray-500">T4 submitted via secure portal</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Referral Follow-Up Sent</p>
                      <p className="text-sm text-gray-500">Monthly touchpoint — auto sequence</p>
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
              "Rate inquiries flood your inbox but response takes hours — by then, the lead has already spoken to a broker who got back to them faster",
              "Document collection drags on for weeks because clients forget, procrastinate, and need multiple reminders you have to send manually",
              "Referral partners send you business, but follow-up is inconsistent — some get regular touchpoints, others hear from you only when you remember"
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
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Three systems that make you the fastest broker to respond, the easiest to work with, and the most memorable referral partner.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-200 dark:border-gray-800 h-full">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instant AI Pre-Qualification Chat</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  When a lead comes in, AI immediately engages them with a pre-qualification conversation — income, credit range, down payment — and hands off a warm, qualified prospect to you within seconds.
                </p>
                <ul className="space-y-3">
                  {["Responds to leads in under 10 seconds", "Gathers income, credit, and down payment info", "Delivers qualified prospects directly to you"].map((item, i) => (
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
                  <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Document Checklist & Secure Upload Portal</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Clients receive a personalized document checklist immediately after engaging. Automated reminders chase outstanding documents so you never have to. A secure portal makes upload simple.
                </p>
                <ul className="space-y-3">
                  {["Auto-sent checklist at client onboarding", "Automated reminders until all docs submitted", "Secure upload portal — no email attachments"].map((item, i) => (
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Referral Partner Nurture Sequences</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Your referral partners — realtors, financial planners, accountants — receive regular, value-driven touchpoints on autopilot. Relationships stay warm and referrals keep coming.
                </p>
                <ul className="space-y-3">
                  {["Monthly touchpoints to every referral partner", "Rate updates, market insights, and check-ins", "Relationships that stay warm without manual effort"].map((item, i) => (
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Apex Mortgage (Toronto)</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Apex Mortgage was losing deals to faster competitors. Their average lead response time was 4 hours. Document collection stretched timelines by weeks. We built instant AI pre-qualification and automated the entire document collection process.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Average lead response time went from 4 hours to 8 seconds",
                  "Conversion rate improved 35% in first 90 days",
                  "Document collection time cut from weeks to days"
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
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">35%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Conversion rate improvement in first 90 days</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Lead response time before</span>
                    <span className="text-gray-900 dark:text-white font-bold">~4 hours</span>
                  </div>
                  <div className="h-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <div className="h-full w-full bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Lead response time after</span>
                    <span className="text-gray-900 dark:text-white font-bold">8 seconds</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="h-full w-[2%] bg-emerald-500 rounded-full"></div>
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

      <RelatedArticles slugs={['speed-to-lead-rule', 'crm-migration', 'ai-agents-guide']} />

      <Section>
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">The broker who responds first wins the deal. Every time.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Book a free 15-minute call. We'll assess your current response time and show you exactly how much faster you could be moving.
          </p>
          <Button size="lg" onClick={() => triggerBookingModal()}>
            <Calendar className="mr-2 w-4 h-4" />
            See Your Automation Score — Free
          </Button>
          <p className="text-sm text-gray-400 mt-4">No pitch, no pressure — just an honest assessment</p>
        </Container>
      </Section>
    </>
  );
};
