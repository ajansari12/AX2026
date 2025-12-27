import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Plus, Edit2, Trash2, Play, Pause, ChevronRight,
  Users, Send, Eye, MousePointer, Clock, CheckCircle,
  AlertCircle, Settings, Zap, Calendar, BarChart3
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
  steps?: EmailSequenceStep[];
  subscriber_count?: number;
}

interface EmailSequenceStep {
  id: string;
  sequence_id: string;
  step_order: number;
  subject: string;
  body_html: string;
  delay_days: number;
  delay_hours: number;
  is_active: boolean;
}

interface EmailStats {
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  open_rate: number;
  click_rate: number;
}

const TRIGGER_LABELS: Record<string, string> = {
  newsletter_signup: 'Newsletter Signup',
  lead_created: 'New Lead',
  quiz_completed: 'Quiz Completed',
  booking_created: 'New Booking',
  manual: 'Manual Trigger',
};

export const EmailMarketing: React.FC = () => {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null);
  const [editingStep, setEditingStep] = useState<EmailSequenceStep | null>(null);

  useEffect(() => {
    fetchSequences();
    fetchStats();
  }, []);

  const fetchSequences = async () => {
    setIsLoading(true);
    try {
      const { data: seqs, error } = await supabase
        .from('email_sequences')
        .select(`
          *,
          email_sequence_steps(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get subscriber counts
      const sequencesWithCounts = await Promise.all(
        (seqs || []).map(async (seq) => {
          const { count } = await supabase
            .from('subscriber_sequences')
            .select('*', { count: 'exact', head: true })
            .eq('sequence_id', seq.id)
            .eq('status', 'active');

          return {
            ...seq,
            steps: seq.email_sequence_steps?.sort(
              (a: EmailSequenceStep, b: EmailSequenceStep) => a.step_order - b.step_order
            ),
            subscriber_count: count || 0,
          };
        })
      );

      setSequences(sequencesWithCounts);
    } catch (err) {
      console.error('Error fetching sequences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('email_sends')
        .select('status');

      if (error) throw error;

      const total = data?.length || 0;
      const opened = data?.filter((e) => e.status === 'opened' || e.status === 'clicked').length || 0;
      const clicked = data?.filter((e) => e.status === 'clicked').length || 0;

      setStats({
        total_sent: total,
        total_opened: opened,
        total_clicked: clicked,
        open_rate: total > 0 ? (opened / total) * 100 : 0,
        click_rate: total > 0 ? (clicked / total) * 100 : 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const toggleSequenceActive = async (sequence: EmailSequence) => {
    try {
      const { error } = await supabase
        .from('email_sequences')
        .update({ is_active: !sequence.is_active })
        .eq('id', sequence.id);

      if (error) throw error;
      fetchSequences();
    } catch (err) {
      console.error('Error toggling sequence:', err);
    }
  };

  const deleteSequence = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sequence?')) return;

    try {
      const { error } = await supabase.from('email_sequences').delete().eq('id', id);
      if (error) throw error;
      fetchSequences();
      if (selectedSequence?.id === id) setSelectedSequence(null);
    } catch (err) {
      console.error('Error deleting sequence:', err);
    }
  };

  const saveSequence = async (data: Partial<EmailSequence>) => {
    try {
      if (editingSequence?.id) {
        const { error } = await supabase
          .from('email_sequences')
          .update(data)
          .eq('id', editingSequence.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('email_sequences').insert(data);
        if (error) throw error;
      }
      setShowSequenceModal(false);
      setEditingSequence(null);
      fetchSequences();
    } catch (err) {
      console.error('Error saving sequence:', err);
    }
  };

  const saveStep = async (data: Partial<EmailSequenceStep>) => {
    try {
      if (editingStep?.id) {
        const { error } = await supabase
          .from('email_sequence_steps')
          .update(data)
          .eq('id', editingStep.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('email_sequence_steps').insert({
          ...data,
          sequence_id: selectedSequence?.id,
        });
        if (error) throw error;
      }
      setShowStepModal(false);
      setEditingStep(null);
      fetchSequences();
    } catch (err) {
      console.error('Error saving step:', err);
    }
  };

  const deleteStep = async (id: string) => {
    if (!confirm('Are you sure you want to delete this step?')) return;

    try {
      const { error } = await supabase.from('email_sequence_steps').delete().eq('id', id);
      if (error) throw error;
      fetchSequences();
    } catch (err) {
      console.error('Error deleting step:', err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Marketing</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage automated email sequences and campaigns
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSequence(null);
            setShowSequenceModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Sequence
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sent</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats?.total_sent || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats?.open_rate.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MousePointer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats?.click_rate.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscribers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {sequences.reduce((sum, s) => sum + (s.subscriber_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sequences List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Sequences</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : sequences.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No sequences yet</p>
                <button
                  onClick={() => setShowSequenceModal(true)}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Create your first sequence
                </button>
              </div>
            ) : (
              sequences.map((sequence) => (
                <button
                  key={sequence.id}
                  onClick={() => setSelectedSequence(sequence)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedSequence?.id === sequence.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {sequence.name}
                        </span>
                        {sequence.is_active ? (
                          <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                            Paused
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {TRIGGER_LABELS[sequence.trigger_type] || sequence.trigger_type}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {sequence.steps?.length || 0} steps · {sequence.subscriber_count} active
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Sequence Details */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {selectedSequence ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {selectedSequence.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedSequence.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSequenceActive(selectedSequence)}
                      className={`p-2 rounded-lg ${
                        selectedSequence.is_active
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}
                      title={selectedSequence.is_active ? 'Pause sequence' : 'Activate sequence'}
                    >
                      {selectedSequence.is_active ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingSequence(selectedSequence);
                        setShowSequenceModal(true);
                      }}
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSequence(selectedSequence.id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Email Steps</h3>
                  <button
                    onClick={() => {
                      setEditingStep(null);
                      setShowStepModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedSequence.steps?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No steps in this sequence yet</p>
                    </div>
                  ) : (
                    selectedSequence.steps?.map((step, index) => (
                      <div
                        key={step.id}
                        className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                      >
                        {index > 0 && (
                          <div className="absolute -top-4 left-6 w-0.5 h-4 bg-gray-300 dark:bg-gray-600" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {step.step_order}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {step.subject}
                              </span>
                              {!step.is_active && (
                                <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full">
                                  Disabled
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {step.delay_days > 0 && `${step.delay_days}d`}
                                {step.delay_hours > 0 && ` ${step.delay_hours}h`}
                                {step.delay_days === 0 && step.delay_hours === 0 && 'Immediate'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingStep(step);
                                setShowStepModal(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteStep(step.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
              <Mail className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Select a sequence to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Sequence Modal */}
      <AnimatePresence>
        {showSequenceModal && (
          <SequenceModal
            sequence={editingSequence}
            onClose={() => {
              setShowSequenceModal(false);
              setEditingSequence(null);
            }}
            onSave={saveSequence}
          />
        )}
      </AnimatePresence>

      {/* Step Modal */}
      <AnimatePresence>
        {showStepModal && (
          <StepModal
            step={editingStep}
            stepOrder={(selectedSequence?.steps?.length || 0) + 1}
            onClose={() => {
              setShowStepModal(false);
              setEditingStep(null);
            }}
            onSave={saveStep}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Sequence Modal Component
const SequenceModal: React.FC<{
  sequence: EmailSequence | null;
  onClose: () => void;
  onSave: (data: Partial<EmailSequence>) => void;
}> = ({ sequence, onClose, onSave }) => {
  const [name, setName] = useState(sequence?.name || '');
  const [description, setDescription] = useState(sequence?.description || '');
  const [triggerType, setTriggerType] = useState(sequence?.trigger_type || 'newsletter_signup');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {sequence ? 'Edit Sequence' : 'New Sequence'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Welcome Sequence"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Automated welcome emails for new subscribers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trigger
              </label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(TRIGGER_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ name, description, trigger_type: triggerType })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!name.trim()}
            >
              {sequence ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Step Modal Component
const StepModal: React.FC<{
  step: EmailSequenceStep | null;
  stepOrder: number;
  onClose: () => void;
  onSave: (data: Partial<EmailSequenceStep>) => void;
}> = ({ step, stepOrder, onClose, onSave }) => {
  const [subject, setSubject] = useState(step?.subject || '');
  const [bodyHtml, setBodyHtml] = useState(step?.body_html || '');
  const [delayDays, setDelayDays] = useState(step?.delay_days || 0);
  const [delayHours, setDelayHours] = useState(step?.delay_hours || 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {step ? 'Edit Email Step' : `Add Email Step ${stepOrder}`}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Welcome to our newsletter!"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delay (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={delayDays}
                  onChange={(e) => setDelayDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delay (Hours)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={delayHours}
                  onChange={(e) => setDelayHours(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Body (HTML)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Use {'{{first_name}}'}, {'{{email}}'}, {'{{full_name}}'} for personalization
              </p>
              <textarea
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                rows={12}
                placeholder="<h1>Welcome!</h1><p>Thank you for subscribing...</p>"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onSave({
                  subject,
                  body_html: bodyHtml,
                  delay_days: delayDays,
                  delay_hours: delayHours,
                  step_order: step?.step_order || stepOrder,
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!subject.trim() || !bodyHtml.trim()}
            >
              {step ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
