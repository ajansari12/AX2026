
import React from 'react';
import { Section, FadeIn, Button } from '../components/UI';
import { SEO } from '../components/SEO';
import { NavLink } from 'react-router-dom';
import { Database, Globe, Cpu, Workflow, Calendar } from 'lucide-react';
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
              We help small businesses <br /><span className="text-gray-400 dark:text-gray-500">work smarter.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-xl">
              You shouldn't have to work nights and weekends just to keep up. We build simple tools that handle the repetitive stuff, so you can focus on the parts of your business you actually enjoy.
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
                "I've seen too many small businesses pay for websites that sit there doing nothing. Every tool we build should bring in customers, save time, or both. If it doesn't, what's the point?"
              </h3>
              <p className="text-gray-300 font-medium text-lg">
                — Ali Ansari, Founder
              </p>
           </div>
        </div>
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
