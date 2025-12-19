
import React from 'react';
import { Section, FadeIn, Button } from '../components/UI';
import { SEO } from '../components/SEO';
import { NavLink } from 'react-router-dom';
import { Database, Globe, Cpu, Workflow } from 'lucide-react';

export const About: React.FC = () => {
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
        description="We believe small businesses need better systems, not just more leads. Learn about our mission to fix the broken agency model."
        schema={aboutSchema}
      />

      {/* Hero */}
      <Section className="pt-32 md:pt-48 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest mb-8">
               Our Mission
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              We build systems, <br /><span className="text-gray-400">not just hype.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
              Small businesses don't need more "brand awareness." They need systems that capture demand and close deals without burning out the founder. That's what we build. Nothing more, nothing less.
            </p>
            <div className="flex gap-4">
              <NavLink to="/contact">
                <Button>Work With Us</Button>
              </NavLink>
              <NavLink to="/work">
                <Button variant="outline">View Case Studies</Button>
              </NavLink>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
               <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Office minimalist" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                 <div className="text-white">
                   <p className="font-bold text-lg">Toronto HQ</p>
                   <p className="text-white/80 text-sm">Serving clients globally</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section light className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">The Anti-Agency Manifesto</h2>
           <p className="text-lg text-gray-500 dark:text-gray-400">The agency model is broken. Most charge high monthly retainers for "activity" without guaranteeing outcomes. We operate differently.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {[
             { title: "No Monthly Retainers", desc: "We build systems, hand them over, and get out of the way. You don't pay rent on what you already own." },
             { title: "Ship in Weeks, Not Months", desc: "Momentum matters. We deploy working systems in 4-6 weeks. No endless discovery phases. No death by committee." },
             { title: "You Own Everything", desc: "Every line of code. Every account. Every asset. No gatekeeping. No hostage fees. No lock-in. Ever." }
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
      <Section>
        <div className="bg-black dark:bg-white text-white dark:text-black rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row gap-12 items-center shadow-2xl">
           <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gray-800 dark:bg-gray-200 overflow-hidden flex-shrink-0 border-4 border-white/10 dark:border-black/10">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Founder" className="w-full h-full object-cover" />
           </div>
           <div className="flex-1">
              <div className="mb-6 text-emerald-400 dark:text-emerald-600 font-bold uppercase tracking-widest text-sm">From the Founder</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                "I watched my dad's dental practice lose $100k a year to no-shows before anyone told him automation existed. Now I make sure that doesn't happen to anyone else."
              </h3>
              <p className="text-gray-400 dark:text-gray-600 font-medium text-lg">
                — Alex Stratton, Founder
              </p>
           </div>
        </div>
      </Section>

      {/* The Stack */}
      <Section light className="bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Toolkit</h2>
          <p className="text-gray-600 dark:text-gray-400">We use modern, reliable tools to build your infrastructure.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
           {[
             { icon: Globe, name: "Webflow / React" },
             { icon: Database, name: "Supabase / SQL" },
             { icon: Cpu, name: "OpenAI / Claude" },
             { icon: Workflow, name: "Make / Zapier" }
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
