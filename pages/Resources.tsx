
import React, { useState } from 'react';
import { Section, Button, FadeIn, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Download, FileText, Check, Loader2, ShieldCheck, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Resources: React.FC = () => {
  const [downloading, setDownloading] = useState<number | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  const handleDownload = (index: number) => {
    setDownloading(index);
    // Simulate API call
    setTimeout(() => {
      setDownloading(null);
      setSuccess(index);
    }, 1500);
  };

  const LEAD_MAGNETS = [
    {
      title: "AI Automation Checklist",
      desc: "Identify where AI can save you 10+ hours/week. Don't build robots for tasks that don't matter. A 20-point audit for high-ROI workflows.",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      title: "Website Conversion Teardown Template",
      desc: "A step-by-step audit sheet to find the conversion leaks on your homepage before you buy ads. Based on 100+ SMB site reviews.",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      title: "Follow-up Scripts Pack",
      desc: "5 copy-paste email templates to re-engage dead leads without sounding desperate. Includes 'The 9-Word Email' and 'The Breakup Email'.",
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
    },
    {
      title: "Small Business Systems Blueprint",
      desc: "The exact operational SOPs, tech stack, and hiring triggers we use to run a lean, high-margin consultancy without burnout.",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
    }
  ];

  return (
    <>
      <SEO 
        title="Free Tools & Resources"
        description="Download free checklists, templates, and guides to automate your business and improve your website conversion rates."
      />

      <Section className="pt-32 md:pt-48 text-center pb-20">
         <Container size="md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100 dark:border-emerald-800">
                Free Toolkit
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Stop starting from scratch.</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Use our battle-tested templates, checklists, and scripts to speed up your growth. Zero fluff, 100% utility.
            </p>
         </Container>
      </Section>

      <Section className="pt-0">
        <Container size="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LEAD_MAGNETS.map((resource, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                <div className="h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col hover:shadow-2xl hover:dark:shadow-white/5 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${resource.color}`}>
                            <FileText size={28} />
                        </div>
                        <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                            PDF Guide
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{resource.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-base mb-8 leading-relaxed flex-grow">{resource.desc}</p>
                    
                    <div className="mt-auto">
                        <AnimatePresence mode="wait">
                            {success === i ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="flex items-center gap-3 mb-2 text-emerald-700 dark:text-emerald-400 font-bold text-lg">
                                    <Check size={24} /> Check your inbox
                                </div>
                                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/70 mb-4 font-medium">
                                    We've sent the guide to your email.
                                </p>
                                <button className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5 opacity-80 hover:opacity-100">
                                    Direct Download PDF <Download size={12} />
                                </button>
                            </motion.div>
                            ) : (
                            <motion.form 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
                                onSubmit={(e) => { e.preventDefault(); handleDownload(i); }}
                            >
                                <div className="flex flex-col gap-3">
                                    <label htmlFor={`email-${i}`} className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 ml-1">
                                        <Mail size={12} /> Email Address
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            id={`email-${i}`}
                                            type="email" 
                                            placeholder="you@company.com" 
                                            required
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base flex-grow focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white min-w-0 transition-all shadow-sm" 
                                        />
                                        <Button size="md" className="flex-shrink-0 rounded-xl px-5" disabled={downloading === i}>
                                            {downloading === i ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium pt-1 ml-1">
                                        <ShieldCheck size={12} className="text-emerald-500" /> No spam. Unsubscribe anytime.
                                    </div>
                                </div>
                            </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                </FadeIn>
            ))}
            </div>
        </Container>
      </Section>
    </>
  );
};
