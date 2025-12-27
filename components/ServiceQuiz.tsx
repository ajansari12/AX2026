import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, X, CheckCircle2, Sparkles,
  Building2, Users, Clock, Target, Zap, Bot,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    points: Record<string, number>;
  }[];
}

interface QuizResult {
  service: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'challenge',
    question: "What's your biggest business challenge right now?",
    options: [
      {
        value: 'time',
        label: 'Too many repetitive tasks eating up my time',
        icon: <Clock className="w-5 h-5" />,
        points: { automation: 3, ai_assistant: 2, app: 1 },
      },
      {
        value: 'leads',
        label: 'Need more leads and customers',
        icon: <Target className="w-5 h-5" />,
        points: { website: 3, ai_assistant: 2, automation: 1 },
      },
      {
        value: 'support',
        label: 'Customer support is overwhelming',
        icon: <Users className="w-5 h-5" />,
        points: { ai_assistant: 3, automation: 2, app: 1 },
      },
      {
        value: 'efficiency',
        label: 'Our processes are inefficient',
        icon: <Zap className="w-5 h-5" />,
        points: { automation: 3, app: 2, ai_assistant: 1 },
      },
    ],
  },
  {
    id: 'team_size',
    question: 'How large is your team?',
    options: [
      {
        value: 'solo',
        label: 'Just me (solopreneur)',
        points: { ai_assistant: 3, automation: 2, website: 2 },
      },
      {
        value: 'small',
        label: '2-10 employees',
        points: { automation: 3, ai_assistant: 2, app: 1 },
      },
      {
        value: 'medium',
        label: '11-50 employees',
        points: { automation: 3, app: 3, ai_assistant: 2 },
      },
      {
        value: 'large',
        label: '50+ employees',
        points: { app: 3, automation: 3, ai_assistant: 2 },
      },
    ],
  },
  {
    id: 'industry',
    question: 'What industry are you in?',
    options: [
      {
        value: 'professional',
        label: 'Professional Services (consulting, legal, accounting)',
        icon: <Building2 className="w-5 h-5" />,
        points: { automation: 3, ai_assistant: 2, website: 1 },
      },
      {
        value: 'ecommerce',
        label: 'E-commerce / Retail',
        points: { ai_assistant: 3, automation: 2, website: 2 },
      },
      {
        value: 'saas',
        label: 'SaaS / Technology',
        points: { app: 3, automation: 2, ai_assistant: 1 },
      },
      {
        value: 'other',
        label: 'Other',
        points: { automation: 2, ai_assistant: 2, website: 2 },
      },
    ],
  },
  {
    id: 'timeline',
    question: 'When do you need a solution?',
    options: [
      {
        value: 'asap',
        label: 'As soon as possible',
        points: { ai_assistant: 3, automation: 2, website: 1 },
      },
      {
        value: '1month',
        label: 'Within the next month',
        points: { automation: 2, ai_assistant: 2, website: 2 },
      },
      {
        value: '3months',
        label: 'Within 3 months',
        points: { app: 2, automation: 2, website: 2 },
      },
      {
        value: 'exploring',
        label: 'Just exploring options',
        points: { website: 2, ai_assistant: 1, automation: 1 },
      },
    ],
  },
  {
    id: 'budget',
    question: "What's your approximate budget?",
    options: [
      {
        value: 'starter',
        label: 'Under $5,000',
        points: { ai_assistant: 3, website: 2, automation: 1 },
      },
      {
        value: 'growth',
        label: '$5,000 - $15,000',
        points: { automation: 3, ai_assistant: 2, website: 2 },
      },
      {
        value: 'scale',
        label: '$15,000 - $50,000',
        points: { app: 3, automation: 3, ai_assistant: 2 },
      },
      {
        value: 'enterprise',
        label: '$50,000+',
        points: { app: 3, automation: 3, ai_assistant: 3 },
      },
    ],
  },
];

const SERVICE_RESULTS: Record<string, QuizResult> = {
  ai_assistant: {
    service: 'AI Assistant',
    title: 'Custom AI Assistant',
    description: "Based on your answers, a custom AI assistant would be perfect for your business. It can handle customer inquiries 24/7, qualify leads, and free up your team's time.",
    features: [
      'Available 24/7 to answer customer questions',
      'Learns from your business knowledge',
      'Integrates with your existing tools',
      'Reduces support workload by up to 70%',
    ],
    cta: 'Learn About AI Assistants',
    link: '/services/ai-assistant',
  },
  automation: {
    service: 'Business Automation',
    title: 'Workflow Automation',
    description: "You'd benefit most from workflow automation. By automating repetitive tasks, you can save hours every week and reduce errors.",
    features: [
      'Automate data entry and reporting',
      'Connect your favorite apps',
      'Trigger actions based on events',
      'Scale operations without adding headcount',
    ],
    cta: 'Explore Automation Solutions',
    link: '/services/automation',
  },
  app: {
    service: 'Custom Application',
    title: 'Custom Web Application',
    description: "A custom web application would give you the tailored solution your business needs. Build exactly what you need, how you need it.",
    features: [
      'Built specifically for your workflows',
      'Scales with your business',
      'Full ownership and control',
      'Integrates with existing systems',
    ],
    cta: 'Discuss Your App Idea',
    link: '/services/development',
  },
  website: {
    service: 'Website',
    title: 'High-Converting Website',
    description: "A professionally designed website would help you attract more leads and establish credibility. First impressions matter.",
    features: [
      'Designed for conversions',
      'SEO optimized from day one',
      'Mobile-first approach',
      'Easy to update and maintain',
    ],
    cta: 'See Our Web Design Work',
    link: '/work',
  },
};

interface ServiceQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceQuiz: React.FC<ServiceQuizProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  const calculateResult = () => {
    const scores: Record<string, number> = {
      ai_assistant: 0,
      automation: 0,
      app: 0,
      website: 0,
    };

    // Calculate scores based on all answers
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(o => o.value === answerValue);
        if (selectedOption) {
          Object.entries(selectedOption.points).forEach(([service, points]) => {
            scores[service] = (scores[service] || 0) + points;
          });
        }
      }
    });

    // Find the service with the highest score
    const topService = Object.entries(scores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return SERVICE_RESULTS[topService];
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate and show result
      const quizResult = calculateResult();
      setResult(quizResult);
      setShowEmailCapture(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !result) return;

    setIsSubmitting(true);
    try {
      await supabase.from('leads').insert({
        name: name || 'Quiz User',
        email,
        source: 'service_quiz',
        service_interest: result.service,
        message: `Quiz result: ${result.service}. Answers: ${JSON.stringify(answers)}`,
        status: 'new',
      });
      setShowEmailCapture(false);
    } catch (err) {
      console.error('Failed to save lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setEmail('');
    setName('');
    setShowEmailCapture(false);
    onClose();
  };

  const handleViewResult = () => {
    setShowEmailCapture(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {result ? 'Your Recommendation' : 'Find Your Perfect Solution'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {result ? 'Based on your answers' : `Question ${currentStep + 1} of ${QUIZ_QUESTIONS.length}`}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {!result && (
              <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gray-900 dark:bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {showEmailCapture && result ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      We found your perfect match!
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Enter your email to see your personalized recommendation
                    </p>
                  </div>

                  <form onSubmit={handleSubmitLead} className="space-y-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Loading...' : 'See My Recommendation'}
                    </button>
                    <button
                      type="button"
                      onClick={handleViewResult}
                      className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Skip for now
                    </button>
                  </form>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4">
                      <Bot className="w-4 h-4" />
                      Best Match
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {result.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {result.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Close
                    </button>
                    <a
                      href={`/#${result.link}`}
                      onClick={handleClose}
                      className="flex-1 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 text-center flex items-center justify-center gap-2"
                    >
                      {result.cta}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          answers[currentQuestion.id] === option.value
                            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {option.icon && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                              {option.icon}
                            </div>
                          )}
                          <span className="text-gray-900 dark:text-white font-medium">
                            {option.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Floating quiz trigger button
export const QuizTriggerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2 }}
  >
    <Sparkles className="w-5 h-5" />
    <span className="font-medium text-sm">Find Your Solution</span>
  </motion.button>
);
