
import React from 'react';
import { Section, FadeIn, Button, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { NavLink } from 'react-router-dom';
import { Database, Globe, Cpu, Workflow, Calendar, CircleCheck as CheckCircle, Wrench, Zap, Check } from 'lucide-react';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { GTADotMap } from '../components/GTADotMap';
import { IllustratedAvatar } from '../components/IllustratedAvatar';

export const About: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Axrategy",
    "description": "We are a digital consultancy focused on building efficient systems for small businesses.",
    "publisher": {
      "@type": "Organization",
      "name": "Axrategy"
    }
  };

  return (
    <>
      <SEO
        title="About Us"
        description="We build simple systems that actually help small businesses save time and grow. No fluff, just tools that work."
        schema={aboutSchema}
      />

      {/* Hero */}
      <Section className="pt-32 md:pt-48 pb-20 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest mb-8">
               Why We Do This
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              We got tired of watching great businesses lose clients to bad processes.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-xl">
              Axrategy started because the best accountant in the room kept losing to the one who returned calls faster. That's not a talent problem. That's a systems problem. We fix it.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => triggerBookingModal()}>
                <Calendar className="mr-2 w-4 h-4" />
                Book a Free Call
              </Button>
              <NavLink to="/work">
                <Button variant="outline">See Our Work</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
               <GTADotMap className="absolute inset-0" />
               <div className="absolute inset-0 flex items-end p-10">
                 <div className="relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                   <p className="font-bold text-lg text-gray-900 dark:text-white">Toronto, Canada</p>
                   <p className="text-gray-600 dark:text-gray-400 text-sm">Working with businesses across North America</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section light className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">How We're Different</h2>
           <p className="text-lg text-gray-500 dark:text-gray-400">We're not a typical agency. Whether you want to own everything outright or partner with us for ongoing support, we build something useful and make sure it works.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {[
             { title: "Pay Your Way", desc: "Choose what works for you: pay once and own everything outright, or start with a lower upfront cost and partner with us monthly for ongoing optimization and support." },
             { title: "Done in 4-6 Weeks", desc: "We don't drag things out. You'll have something working in about a month. No endless meetings or waiting around." },
             { title: "It's 100% Yours", desc: "The website, the code, all the accounts - everything belongs to you. No asking permission to make changes to your own stuff." }
           ].map((val, i) => (
             <FadeIn key={i} delay={i * 0.1}>
               <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl h-full border border-gray-100 dark:border-gray-800">
                 <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{val.title}</h4>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{val.desc}</p>
               </div>
             </FadeIn>
           ))}
        </div>
      </Section>
      
      {/* Founder Note */}
      <Section className="bg-white dark:bg-gray-900">
        <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row gap-12 items-center shadow-2xl">
           <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 border-4 border-white/10 shadow-xl">
              <span className="text-white font-bold text-4xl md:text-6xl">AA</span>
           </div>
           <div className="flex-1">
              <div className="mb-6 text-emerald-400 font-bold uppercase tracking-widest text-sm">Why I Started This</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed text-white">
                "I kept asking myself: why are accountants and lawyers and dentists — smart, qualified professionals — losing clients to bad response times and clunky processes? The answer isn't that they're bad at business. The answer is they're working in their business, not on it. We exist to fix that."
              </h3>
              <p className="text-gray-300 font-medium text-lg">
                — Ali Ansari, Founder
              </p>
           </div>
        </div>
      </Section>

      {/* Transparency: What we build vs. set up */}
      <Section className="py-20 bg-gray-50 dark:bg-gray-900/30">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What we build vs. what we set up for you
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              We believe in being honest about how this works. Some things are built inside our platform. Others we set up using best-in-class external tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Built into our platform</h3>
              </div>
              {[
                'AI chat assistant on your website (Claude-powered)',
                'Website performance and SEO audit tool',
                'Google Business Profile audit',
                'Lead capture and pipeline management',
                'Client portal (projects, invoices, messages)',
                'Booking via Cal.com integration',
                'Proposal generation and sending',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <Check size={16} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Wrench className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Set up for you using partner tools</h3>
              </div>
              {[
                'AI phone answering (via Vapi.ai — Automation & AI Partner plans)',
                'SMS appointment reminders (via Twilio + Zapier)',
                'Automated follow-up email sequences (configured per client)',
                'CRM integration with existing tools (HubSpot, Pipedrive)',
                'Review request automation',
                'Custom reporting dashboards',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <Zap size={16} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-4">These are configured during your onboarding using the best tools for your specific setup — not locked into one platform.</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* The Stack */}
      <Section light className="bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Tools We Use</h2>
          <p className="text-gray-600 dark:text-gray-400">We use proven, reliable tools that won't disappear tomorrow.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
           {[
             { icon: Globe, name: "Websites" },
             { icon: Database, name: "Databases" },
             { icon: Cpu, name: "AI Assistants" },
             { icon: Workflow, name: "Automation" }
           ].map((tool, i) => (
             <div key={i} className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:opacity-100 transition-opacity">
                <tool.icon size={32} className="text-gray-900 dark:text-white" />
                <span className="font-bold text-gray-900 dark:text-white">{tool.name}</span>
             </div>
           ))}
        </div>
      </Section>
    </>
  );
};
