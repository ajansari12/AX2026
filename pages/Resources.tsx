import React, { useState } from 'react';
import { Section, Button, FadeIn, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { Download, FileText, Check, Loader2, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useResourceDownload } from '../hooks/useResourceDownload';

const LEAD_MAGNETS = [
  {
    title: "The 20-Point AI Audit: Find Where You're Wasting 10+ Hours/Week",
    desc: "Don't automate tasks that don't matter. This checklist helps you identify the high-ROI workflows that actually deserve AI. Used by 200+ service businesses.",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  },
  {
    title: "The Homepage Scorecard: Grade Your Site in 5 Minutes",
    desc: "Find the conversion leaks on your homepage before you spend another dollar on ads. Based on 100+ SMB site reviews. Includes video walkthrough.",
    color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
  },
  {
    title: "5 Emails That Revive Dead Leads (Including the Breakup Email)",
    desc: "Copy-paste templates to re-engage cold leads without sounding desperate. Includes 'The 9-Word Email' that gets 35% response rates.",
    color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400"
  },
  {
    title: "The Lean Ops Blueprint: How We Run a 6-Figure Consultancy Solo",
    desc: "The exact SOPs, tech stack, and hiring triggers we use internally. No fluff. Just the systems that let you work 40 hours, not 70.",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
  }
];

interface ResourceCardProps {
  resource: typeof LEAD_MAGNETS[0];
  index: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { requestDownload, isSubmitting } = useResourceDownload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const result = await requestDownload(email, resource.title);

    if (result.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <FadeIn delay={index * 0.1}>
      <div className="h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col hover:shadow-2xl hover:dark:shadow-white/5 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${resource.color}`}>
            <FileText size={28} />
          </div>
          <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
            PDF Guide
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {resource.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-8 leading-relaxed flex-grow">
          {resource.desc}
        </p>

        <div className="mt-auto">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
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
                <button
                  onClick={() => setStatus('idle')}
                  className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5 opacity-80 hover:opacity-100"
                >
                  Request again <Download size={12} />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-3">
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                    >
                      <AlertCircle size={14} />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                  <label htmlFor={`email-${index}`} className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 ml-1">
                    <Mail size={12} /> Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`email-${index}`}
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base flex-grow focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white min-w-0 transition-all shadow-sm"
                    />
                    <Button
                      size="md"
                      className="flex-shrink-0 rounded-xl px-5"
                      disabled={isSubmitting || status === 'submitting'}
                    >
                      {isSubmitting || status === 'submitting' ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Download size={20} />
                      )}
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
  );
};

export const Resources: React.FC = () => {
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
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
            Stop starting from scratch.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Use our battle-tested templates, checklists, and scripts to speed up your growth. Zero fluff, 100% utility.
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LEAD_MAGNETS.map((resource, i) => (
              <ResourceCard key={i} resource={resource} index={i} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
};
