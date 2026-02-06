import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, X, FolderKanban, FileText, MessageSquare, Receipt, GraduationCap, Gift } from 'lucide-react';

const STORAGE_KEY = 'ax-onboarding-state';

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const STEPS: OnboardingStep[] = [
  { id: 'projects', label: 'View your projects', description: 'See active projects and milestones', icon: <FolderKanban size={18} />, link: '/portal/projects' },
  { id: 'documents', label: 'Check your documents', description: 'Access shared files and deliverables', icon: <FileText size={18} />, link: '/portal/documents' },
  { id: 'messages', label: 'Send a message', description: 'Communicate with your team', icon: <MessageSquare size={18} />, link: '/portal/messages' },
  { id: 'invoices', label: 'Review invoices', description: 'Manage billing and payments', icon: <Receipt size={18} />, link: '/portal/invoices' },
  { id: 'training', label: 'Explore training', description: 'Learn how to use your tools', icon: <GraduationCap size={18} />, link: '/portal/training' },
  { id: 'referrals', label: 'Refer a friend', description: 'Earn rewards by referring clients', icon: <Gift size={18} />, link: '/portal/referrals' },
];

export const PortalOnboarding: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        setCompleted(state.completed || []);
        setDismissed(state.dismissed || false);
      }
    } catch (_) {}
  }, []);

  const save = (newCompleted: string[], newDismissed: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: newCompleted, dismissed: newDismissed }));
    } catch (_) {}
  };

  const toggleStep = (id: string) => {
    const next = completed.includes(id) ? completed.filter(c => c !== id) : [...completed, id];
    setCompleted(next);
    save(next, dismissed);
  };

  const dismiss = () => {
    setDismissed(true);
    save(completed, true);
  };

  if (dismissed || completed.length === STEPS.length) return null;

  const progress = Math.round((completed.length / STEPS.length) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Getting Started</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{completed.length} of {STEPS.length} completed</p>
          </div>
          <button onClick={dismiss} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="space-y-2">
          {STEPS.map(step => {
            const done = completed.includes(step.id);
            return (
              <div
                key={step.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <button onClick={() => toggleStep(step.id)} className="flex-shrink-0">
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  )}
                </button>
                <NavLink to={step.link} className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{step.description}</p>
                </NavLink>
                <span className="text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                  {step.icon}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
