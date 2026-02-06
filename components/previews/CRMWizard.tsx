import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, ArrowRight, ArrowLeft, Check, Star,
  RotateCcw, Users, Calendar, Mail, BarChart3,
  CheckCircle2, Circle,
} from 'lucide-react';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface CRMWizardProps {
  onCheckout: (email: string) => void;
}

interface WizardStep {
  id: string;
  question: string;
  options: { label: string; value: string; icon?: React.ElementType }[];
}

const STEPS: WizardStep[] = [
  {
    id: 'business_type',
    question: 'What type of business do you run?',
    options: [
      { label: 'Service-based (appointments)', value: 'service' },
      { label: 'Sales-driven (deals/pipeline)', value: 'sales' },
      { label: 'E-commerce or product', value: 'ecommerce' },
      { label: 'Agency or consulting', value: 'agency' },
    ],
  },
  {
    id: 'team_size',
    question: 'How many people will use the CRM?',
    options: [
      { label: 'Just me', value: '1' },
      { label: '2-5 team members', value: '2-5' },
      { label: '6-15 team members', value: '6-15' },
      { label: '15+ team members', value: '15+' },
    ],
  },
  {
    id: 'current_tools',
    question: 'What are you using right now?',
    options: [
      { label: 'Spreadsheets / Nothing', value: 'none' },
      { label: 'A free CRM (HubSpot Free, etc.)', value: 'free_crm' },
      { label: 'A paid CRM I want to switch from', value: 'paid_crm' },
      { label: 'An industry-specific tool', value: 'industry' },
    ],
  },
  {
    id: 'must_haves',
    question: 'What matters most to you?',
    options: [
      { label: 'Easy to use, minimal setup', value: 'ease', icon: CheckCircle2 },
      { label: 'Powerful automations', value: 'automation', icon: BarChart3 },
      { label: 'Built-in marketing tools', value: 'marketing', icon: Mail },
      { label: 'Lowest cost', value: 'budget', icon: Star },
    ],
  },
];

interface CRMRec {
  name: string;
  logo: string;
  price: string;
  rating: number;
  match: number;
  pros: string[];
  cons: string[];
  bestFor: string;
}

function getRecommendation(answers: Record<string, string>): CRMRec[] {
  const recs: CRMRec[] = [];

  const hubspot: CRMRec = {
    name: 'HubSpot CRM',
    logo: 'H',
    price: 'Free - $50/mo',
    rating: 4.5,
    match: 85,
    pros: ['Free tier is genuinely useful', 'Great marketing integration', 'Intuitive interface'],
    cons: ['Paid tiers get expensive fast', 'Some features feel locked behind upgrades'],
    bestFor: 'Small teams who want marketing + sales in one place',
  };

  const pipedrive: CRMRec = {
    name: 'Pipedrive',
    logo: 'P',
    price: '$15 - $59/mo',
    rating: 4.3,
    match: 78,
    pros: ['Best visual pipeline', 'Easy to learn', 'Great mobile app'],
    cons: ['Limited marketing features', 'Reporting could be deeper'],
    bestFor: 'Sales-focused teams who live in their pipeline',
  };

  const ghl: CRMRec = {
    name: 'GoHighLevel',
    logo: 'G',
    price: '$97 - $297/mo',
    rating: 4.2,
    match: 72,
    pros: ['All-in-one platform', 'White-label option', 'Powerful automations'],
    cons: ['Steeper learning curve', 'Interface can feel overwhelming'],
    bestFor: 'Agencies and power users who want everything in one tool',
  };

  if (answers.must_haves === 'automation' || answers.business_type === 'agency') {
    ghl.match = 92;
    recs.push(ghl, hubspot, pipedrive);
  } else if (answers.must_haves === 'marketing' || answers.business_type === 'service') {
    hubspot.match = 90;
    recs.push(hubspot, pipedrive, ghl);
  } else if (answers.must_haves === 'budget' || answers.current_tools === 'none') {
    hubspot.match = 88;
    pipedrive.match = 82;
    recs.push(hubspot, pipedrive, ghl);
  } else {
    pipedrive.match = 88;
    recs.push(pipedrive, hubspot, ghl);
  }

  return recs;
}

const DEAL_STAGES = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Won'];

export const CRMWizard: React.FC<CRMWizardProps> = ({ onCheckout }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [showMockup, setShowMockup] = useState(false);

  const handleAnswer = (value: string) => {
    const step = STEPS[currentStep];
    setAnswers((prev) => ({ ...prev, [step.id]: value }));

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
      trackEvent('crm_wizard_completed', { category: 'product_preview' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setShowMockup(false);
  };

  const recommendations = showResults ? getRecommendation(answers) : [];

  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RotateCcw size={16} /> Start Over
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your CRM Match</h3>
          {recommendations.map((crm, idx) => (
            <motion.div
              key={crm.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`bg-white dark:bg-gray-900 rounded-2xl border p-6 ${
                idx === 0
                  ? 'border-emerald-200 dark:border-emerald-800 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    idx === 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {crm.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 dark:text-white">{crm.name}</p>
                      {idx === 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                          Best Match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{crm.bestFor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{crm.match}%</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">match</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Pros</p>
                  {crm.pros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <Check size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">{pro}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Cons</p>
                  {crm.cons.map((con, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <Circle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{crm.rating}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{crm.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {!showMockup ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">See your CRM in action</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Enter your business name to preview a mock dashboard.</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Bright Smile Dental"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 text-sm"
              />
              <button
                onClick={() => { setShowMockup(true); trackEvent('crm_mockup_viewed', { category: 'product_preview' }); }}
                disabled={!businessName.trim()}
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{businessName} -- Deal Pipeline</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Mock Preview</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-3 min-w-[700px]">
                {DEAL_STAGES.map((stage, idx) => {
                  const deals = idx === 0 ? 4 : idx === 1 ? 3 : idx === 2 ? 2 : idx === 3 ? 2 : 1;
                  return (
                    <div key={stage} className="flex-1 min-w-[130px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{stage}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">{deals}</span>
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: deals }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (idx * deals + i) * 0.05 }}
                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                          >
                            <p className="text-xs font-medium text-gray-900 dark:text-white">Client {idx * 3 + i + 1}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">${(Math.random() * 5000 + 500).toFixed(0)}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Setup Timeline</h3>
          <div className="space-y-2">
            {[
              { week: 'Week 1', task: 'CRM account setup, data import, and pipeline configuration' },
              { week: 'Week 2', task: 'Automation rules, email templates, and team training' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-16 flex-shrink-0">{item.week}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.task}</span>
              </div>
            ))}
          </div>
        </div>

        <PreviewEmailCapture
          productSlug="crm-quickstart"
          ctaLabel="Set Up My CRM"
          ctaPrice="$997"
          headline="Let us set up your CRM the right way."
          subtext="Our team will configure your chosen CRM, import your data, build automations, and train your team -- all done for you in 2 weeks."
          quizData={answers}
          onCheckout={onCheckout}
        />
      </motion.div>
    );
  }

  const step = STEPS[currentStep];

  return (
    <div className="max-w-xl mx-auto">
      {currentStep === 0 && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Database className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Find your perfect CRM
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Answer 4 quick questions and get a personalized CRM recommendation with a live pipeline preview.
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-gray-900 dark:bg-white rounded-full"
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{step.question}</h3>
          <div className="space-y-3">
            {step.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  {option.icon && <option.icon size={16} className="text-gray-400" />}
                  {option.label}
                </div>
                <ArrowRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {currentStep > 0 && (
        <button onClick={handleBack} className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      )}
    </div>
  );
};
