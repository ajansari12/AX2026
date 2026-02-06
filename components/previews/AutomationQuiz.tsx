import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, ArrowRight, ArrowLeft, CheckCircle2, Clock, DollarSign,
  Zap, RotateCcw, Lock,
} from 'lucide-react';
import { ScoreGauge } from '../audit/ScoreGauge';
import { PreviewEmailCapture } from './PreviewEmailCapture';
import { trackEvent } from '../../lib/analytics';

interface AutomationQuizProps {
  onCheckout: (email: string) => void;
}

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'industry',
    question: 'What industry is your business in?',
    options: [
      { label: 'Healthcare / Dental', value: 'healthcare', score: 0 },
      { label: 'Legal', value: 'legal', score: 0 },
      { label: 'Real Estate', value: 'real_estate', score: 0 },
      { label: 'Home Services / Contracting', value: 'home_services', score: 0 },
      { label: 'Financial Services', value: 'financial', score: 0 },
      { label: 'Other Professional Services', value: 'other', score: 0 },
    ],
  },
  {
    id: 'team_size',
    question: 'How large is your team?',
    options: [
      { label: 'Just me', value: 'solo', score: 25 },
      { label: '2-5 people', value: 'small', score: 20 },
      { label: '6-15 people', value: 'medium', score: 15 },
      { label: '16-50 people', value: 'large', score: 10 },
      { label: '50+ people', value: 'enterprise', score: 5 },
    ],
  },
  {
    id: 'tools',
    question: 'Which tools do you currently use? (pick the closest match)',
    options: [
      { label: 'Mostly spreadsheets and email', value: 'manual', score: 5 },
      { label: 'A basic CRM (HubSpot Free, Zoho, etc.)', value: 'basic_crm', score: 12 },
      { label: 'An industry-specific platform', value: 'industry', score: 15 },
      { label: 'Multiple disconnected tools', value: 'disconnected', score: 8 },
      { label: 'A fully integrated stack', value: 'integrated', score: 22 },
    ],
  },
  {
    id: 'time_sink',
    question: 'What eats up most of your time?',
    options: [
      { label: 'Following up with leads', value: 'follow_up', score: 10 },
      { label: 'Scheduling and reminders', value: 'scheduling', score: 10 },
      { label: 'Invoicing and admin', value: 'admin', score: 10 },
      { label: 'Social media and marketing', value: 'marketing', score: 10 },
      { label: 'Client onboarding', value: 'onboarding', score: 10 },
    ],
  },
  {
    id: 'manual_tasks',
    question: 'How many hours per week do you spend on tasks that feel repetitive?',
    options: [
      { label: 'Less than 2 hours', value: 'minimal', score: 20 },
      { label: '2-5 hours', value: 'some', score: 15 },
      { label: '5-10 hours', value: 'moderate', score: 10 },
      { label: '10-20 hours', value: 'high', score: 5 },
      { label: '20+ hours', value: 'extreme', score: 2 },
    ],
  },
];

const AUTOMATION_RECS: Record<string, { title: string; impact: string }[]> = {
  follow_up: [
    { title: 'Speed-to-Lead Auto-Responder', impact: 'Respond to every lead in under 60 seconds' },
    { title: 'Email Drip Sequences', impact: 'Nurture leads on autopilot over 14 days' },
    { title: 'Lead Scoring Rules', impact: 'Prioritize hot leads, skip the tire-kickers' },
  ],
  scheduling: [
    { title: 'Appointment Reminder System', impact: 'Reduce no-shows by 65% with SMS + email' },
    { title: 'Self-Service Booking Widget', impact: 'Let clients book without calling' },
    { title: 'Waitlist Auto-Fill', impact: 'Fill cancellations instantly' },
  ],
  admin: [
    { title: 'Auto-Invoicing on Job Completion', impact: 'Send invoices the moment work is done' },
    { title: 'Document Auto-Generation', impact: 'Populate contracts and proposals in seconds' },
    { title: 'Client Intake Forms', impact: 'Collect info before the first call' },
  ],
  marketing: [
    { title: 'Review Generation Autopilot', impact: 'Collect 5-star reviews automatically' },
    { title: 'Social Post Scheduler', impact: 'Queue a month of posts in 30 minutes' },
    { title: 'Referral Tracking System', impact: 'Reward clients who send you business' },
  ],
  onboarding: [
    { title: 'Automated Welcome Sequence', impact: '5-email series that sets expectations' },
    { title: 'Client Portal Setup', impact: 'Give clients a self-serve dashboard' },
    { title: 'Task Assignment Automation', impact: 'Auto-assign tasks when a client signs' },
  ],
};

export const AutomationQuiz: React.FC<AutomationQuizProps> = ({ onCheckout }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string, score: number) => {
    const question = QUESTIONS[currentQ];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setScores((prev) => [...prev, score]);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
      trackEvent('automation_quiz_completed', { category: 'product_preview' });
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setScores((prev) => prev.slice(0, -1));
      setCurrentQ(currentQ - 1);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers({});
    setScores([]);
    setShowResults(false);
  };

  const totalScore = scores.reduce((sum, s) => sum + s, 0);
  const readinessScore = Math.min(100, Math.round(totalScore));
  const timeSink = answers.time_sink || 'follow_up';
  const recs = AUTOMATION_RECS[timeSink] || AUTOMATION_RECS.follow_up;
  const manualHours = { minimal: 1, some: 3.5, moderate: 7.5, high: 15, extreme: 25 }[answers.manual_tasks || 'moderate'] || 7.5;
  const savingsHours = Math.round(manualHours * 0.65);
  const savingsDollars = savingsHours * 50 * 4;

  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RotateCcw size={16} /> Retake Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex justify-center lg:justify-start">
            <ScoreGauge score={readinessScore} label="Automation Readiness" size={140} />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
              <Clock size={18} className="text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{savingsHours} hrs/week</p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/60 mt-1">Estimated time you could save</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
              <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">${savingsDollars.toLocaleString()}/mo</p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/60 mt-1">Estimated savings (at $50/hr)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top 3 Automations to Implement First</h3>
          <div className="space-y-3">
            {recs.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <Zap size={14} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{rec.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rec.impact}</p>
                </div>
                <CheckCircle2 size={16} className="text-emerald-500 ml-auto flex-shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 dark:via-gray-950/80 to-white dark:to-gray-950 z-10 pointer-events-none rounded-2xl" />
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 opacity-60">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Your Custom Automation Roadmap</h3>
            <div className="space-y-3">
              {['Phase 1: Quick wins (Week 1-2)', 'Phase 2: Core systems (Week 3-4)', 'Phase 3: Advanced automations (Month 2)', 'Phase 4: Optimization and scaling (Month 3)'].map((phase, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Lock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-400">{phase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PreviewEmailCapture
          productSlug="automation-playbook"
          ctaLabel="Get the Playbook"
          ctaPrice="$67"
          headline="Unlock your full automation roadmap."
          subtext="The complete Industry Automation Playbook includes step-by-step instructions, tool recommendations, and template workflows for your specific business."
          quizData={answers}
          onCheckout={onCheckout}
        />
      </motion.div>
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div className="max-w-xl mx-auto">
      {currentQ === 0 && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Cpu className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            How ready is your business for automation?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            5 quick questions to reveal your biggest automation opportunities.
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-gray-900 dark:bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value, option.score)}
                className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between group"
              >
                {option.label}
                <ArrowRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {currentQ > 0 && (
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
      )}
    </div>
  );
};
