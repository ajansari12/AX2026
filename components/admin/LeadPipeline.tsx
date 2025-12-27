import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, DollarSign, TrendingUp,
  MoreVertical, ChevronRight, Star, Filter, RefreshCw,
  Plus, Eye, Edit2, Trash2, Clock, Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service_interest: string;
  pricing_preference?: string;
  message?: string;
  source?: string;
  status: string;
  pipeline_stage: string;
  score: number;
  expected_value?: number;
  probability: number;
  created_at: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  leads: Lead[];
}

const PIPELINE_STAGES: Omit<PipelineStage, 'leads'>[] = [
  { id: 'new', name: 'New', color: 'bg-gray-500' },
  { id: 'contacted', name: 'Contacted', color: 'bg-blue-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
  { id: 'won', name: 'Won', color: 'bg-green-500' },
  { id: 'lost', name: 'Lost', color: 'bg-red-500' },
];

export const LeadPipeline: React.FC = () => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [filterScore, setFilterScore] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('score', { ascending: false });

      if (filterScore !== null) {
        query = query.gte('score', filterScore);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Group leads by pipeline stage
      const groupedStages = PIPELINE_STAGES.map((stage) => ({
        ...stage,
        leads: (data || []).filter(
          (lead) => (lead.pipeline_stage || 'new') === stage.id
        ),
      }));

      setStages(groupedStages);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterScore]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: string) => {
    if (!draggedLead || draggedLead.pipeline_stage === stageId) {
      setDraggedLead(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .update({ pipeline_stage: stageId })
        .eq('id', draggedLead.id);

      if (error) throw error;
      fetchLeads();
    } catch (err) {
      console.error('Error moving lead:', err);
    } finally {
      setDraggedLead(null);
    }
  };

  const handleRecalculateScores = async () => {
    try {
      await supabase.rpc('recalculate_all_lead_scores');
      fetchLeads();
    } catch (err) {
      console.error('Error recalculating scores:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
  };

  const calculatePipelineValue = () => {
    return stages.reduce((total, stage) => {
      return (
        total +
        stage.leads.reduce((stageTotal, lead) => {
          const value = lead.expected_value || 0;
          const probability = lead.probability || 0;
          return stageTotal + value * (probability / 100);
        }, 0)
      );
    }, 0);
  };

  const calculateConversionRate = () => {
    const totalLeads = stages.reduce((sum, s) => sum + s.leads.length, 0);
    const wonLeads = stages.find((s) => s.id === 'won')?.leads.length || 0;
    return totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Lead Pipeline
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Drag and drop leads between stages
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRecalculateScores}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Recalculate all scores"
            >
              <RefreshCw className="w-4 h-4" />
              Recalculate Scores
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stages.reduce((sum, s) => sum + s.leads.length, 0)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pipeline Value</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${calculatePipelineValue().toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {calculateConversionRate()}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Score</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stages.reduce((sum, s) => sum + s.leads.length, 0) > 0
                ? Math.round(
                    stages
                      .flatMap((s) => s.leads)
                      .reduce((sum, l) => sum + (l.score || 0), 0) /
                      stages.reduce((sum, s) => sum + s.leads.length, 0)
                  )
                : 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Min Score:</span>
            <select
              value={filterScore || ''}
              onChange={(e) =>
                setFilterScore(e.target.value ? parseInt(e.target.value) : null)
              }
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All</option>
              <option value="70">Hot (70+)</option>
              <option value="40">Warm (40+)</option>
              <option value="20">Cold (20+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-x-auto p-6 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="flex gap-4 h-full min-w-max">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0 flex flex-col bg-gray-100 dark:bg-gray-800 rounded-xl"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stage.name}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {stage.leads.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lead Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {stage.leads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadModal(true);
                      }}
                      className={`bg-white dark:bg-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                        draggedLead?.id === lead.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {lead.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {lead.email}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getScoreColor(
                            lead.score || 0
                          )}`}
                        >
                          {lead.score || 0}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.service_interest && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                            {lead.service_interest}
                          </span>
                        )}
                        {lead.pricing_preference && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                            {lead.pricing_preference}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                        {lead.expected_value && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {lead.expected_value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {stage.leads.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {showLeadModal && selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => {
              setShowLeadModal(false);
              setSelectedLead(null);
            }}
            onUpdate={fetchLeads}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Lead Detail Modal
const LeadDetailModal: React.FC<{
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ lead, onClose, onUpdate }) => {
  const [expectedValue, setExpectedValue] = useState(lead.expected_value || 0);
  const [probability, setProbability] = useState(lead.probability || 0);
  const [pipelineStage, setPipelineStage] = useState(lead.pipeline_stage || 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<Record<string, number>>({});
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchScoreBreakdown();
    fetchActivities();
  }, [lead.id]);

  const fetchScoreBreakdown = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('score_breakdown')
        .eq('id', lead.id)
        .single();

      if (data?.score_breakdown) {
        setScoreBreakdown(data.score_breakdown);
      }
    } catch (err) {
      console.error('Error fetching score breakdown:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data } = await supabase
        .from('lead_activity')
        .select('*')
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          expected_value: expectedValue,
          probability,
          pipeline_stage: pipelineStage,
        })
        .eq('id', lead.id);

      if (error) throw error;
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating lead:', err);
    } finally {
      setIsSaving(false);
    }
  };

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
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lead.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{lead.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-lg font-bold rounded-lg ${
                  lead.score >= 70
                    ? 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                    : lead.score >= 40
                    ? 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Score: {lead.score || 0}
              </span>
            </div>
          </div>

          {/* Lead Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Service Interest</label>
              <p className="font-medium text-gray-900 dark:text-white">
                {lead.service_interest || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Pricing Preference</label>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {lead.pricing_preference || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Source</label>
              <p className="font-medium text-gray-900 dark:text-white">
                {lead.source || 'Unknown'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Created</label>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(lead.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="mb-6">
              <label className="text-sm text-gray-500 dark:text-gray-400">Message</label>
              <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                {lead.message}
              </p>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Score Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(scoreBreakdown).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {key.replace(/_/g, ' ').replace(/engagement /g, '')}
                  </span>
                  <span className="font-medium text-green-600">+{value}</span>
                </div>
              ))}
              {Object.keys(scoreBreakdown).length === 0 && (
                <p className="text-gray-500 text-sm">No score breakdown available</p>
              )}
            </div>
          </div>

          {/* Pipeline Settings */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Pipeline Stage
              </label>
              <select
                value={pipelineStage}
                onChange={(e) => setPipelineStage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {PIPELINE_STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Expected Value ($)
              </label>
              <input
                type="number"
                value={expectedValue}
                onChange={(e) => setExpectedValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Probability (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Recent Activity</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <Activity className="w-4 h-4" />
                  <span>{activity.description}</span>
                  <span className="text-gray-400">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
