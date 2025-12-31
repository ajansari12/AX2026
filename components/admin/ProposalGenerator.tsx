import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  FileText, Plus, Edit2, Trash2, Send, Eye, Copy, Check,
  ExternalLink, Clock, DollarSign, Calendar, User, Building,
  GripVertical, ChevronDown, ChevronUp, Download, Link2, Upload
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: ProposalSection[];
}

interface ProposalSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'pricing' | 'timeline';
  content: string;
}

interface Proposal {
  id: string;
  lead_id: string | null;
  template_id: string | null;
  title: string;
  client_name: string;
  client_email: string;
  client_company: string | null;
  sections: ProposalSection[];
  summary: string | null;
  pricing: {
    items: { description: string; amount: number }[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  };
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  valid_until: string | null;
  share_token: string | null;
  view_count: number;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  service_interest: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-500',
};

export const ProposalGenerator: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propRes, tempRes, leadRes] = await Promise.all([
        supabase.from('proposals').select('*').order('created_at', { ascending: false }),
        supabase.from('proposal_templates').select('*').eq('is_active', true),
        supabase.from('leads').select('id, name, email, service_interest').limit(100),
      ]);

      setProposals(propRes.data || []);
      setTemplates(tempRes.data || []);
      setLeads(leadRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createFromTemplate = (template: ProposalTemplate, lead?: Lead) => {
    const newProposal: Proposal = {
      id: '',
      lead_id: lead?.id || null,
      template_id: template.id,
      title: `Proposal for ${lead?.name || 'New Client'}`,
      client_name: lead?.name || '',
      client_email: lead?.email || '',
      client_company: null,
      sections: template.sections,
      summary: null,
      pricing: {
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
      status: 'draft',
      valid_until: null,
      share_token: null,
      view_count: 0,
      created_at: new Date().toISOString(),
    };
    setEditingProposal(newProposal);
    setShowTemplateSelect(false);
    setShowEditor(true);
  };

  const saveProposal = async (proposal: Proposal) => {
    try {
      const data = {
        lead_id: proposal.lead_id,
        template_id: proposal.template_id,
        title: proposal.title,
        client_name: proposal.client_name,
        client_email: proposal.client_email,
        client_company: proposal.client_company,
        sections: proposal.sections,
        summary: proposal.summary,
        pricing: proposal.pricing,
        status: proposal.status,
        valid_until: proposal.valid_until,
        updated_at: new Date().toISOString(),
      };

      if (proposal.id) {
        const { error } = await supabase
          .from('proposals')
          .update(data)
          .eq('id', proposal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('proposals').insert({
          ...data,
          share_token: crypto.randomUUID().replace(/-/g, ''),
        });
        if (error) throw error;
      }

      setShowEditor(false);
      setEditingProposal(null);
      fetchData();
    } catch (err) {
      console.error('Error saving proposal:', err);
    }
  };

  const sendProposal = async (proposal: Proposal) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', proposal.id);

      if (error) throw error;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const emailResult = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'proposal',
          proposal: {
            title: proposal.title,
            client_name: proposal.client_name,
            client_email: proposal.client_email,
            share_token: proposal.share_token,
            total: proposal.pricing?.total || 0,
            valid_until: proposal.valid_until,
          },
        }),
      });

      if (!emailResult.ok) {
        console.error('Failed to send email');
      }

      alert(`Proposal sent to ${proposal.client_email}`);
      fetchData();
    } catch (err) {
      console.error('Error sending proposal:', err);
    }
  };

  const duplicateProposal = async (proposal: Proposal) => {
    try {
      const { error } = await supabase.from('proposals').insert({
        ...proposal,
        id: undefined,
        title: `${proposal.title} (Copy)`,
        status: 'draft',
        share_token: crypto.randomUUID().replace(/-/g, ''),
        sent_at: null,
        viewed_at: null,
        view_count: 0,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error duplicating proposal:', err);
    }
  };

  const deleteProposal = async (id: string) => {
    if (!confirm('Delete this proposal?')) return;
    try {
      const { error } = await supabase.from('proposals').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting proposal:', err);
    }
  };

  const copyShareLink = (proposal: Proposal) => {
    const url = `${window.location.origin}/proposal/${proposal.share_token}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const sendToPortal = async (proposal: Proposal) => {
    try {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id, name')
        .ilike('email', proposal.client_email)
        .maybeSingle();

      if (clientError) throw clientError;

      if (!client) {
        alert(`No client found with email: ${proposal.client_email}. Create a client first to send proposals to their portal.`);
        return;
      }

      const proposalUrl = `${window.location.origin}/proposal/${proposal.share_token}`;

      const { error: docError } = await supabase
        .from('client_documents')
        .insert({
          client_id: client.id,
          name: proposal.title,
          description: `Proposal - ${proposal.summary || `$${proposal.pricing?.total?.toLocaleString() || 0}`}`,
          category: 'proposal',
          file_url: proposalUrl,
          uploaded_at: new Date().toISOString(),
        });

      if (docError) throw docError;

      alert(`Proposal sent to ${client.name}'s portal successfully!`);
    } catch (err) {
      console.error('Error sending to portal:', err);
      alert('Failed to send proposal to portal');
    }
  };

  if (showEditor && editingProposal) {
    return (
      <ProposalEditor
        proposal={editingProposal}
        leads={leads}
        onSave={saveProposal}
        onCancel={() => {
          setShowEditor(false);
          setEditingProposal(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Proposals</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create and manage client proposals
          </p>
        </div>
        <button
          onClick={() => setShowTemplateSelect(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: proposals.length, color: 'blue' },
          { label: 'Sent', value: proposals.filter((p) => p.status === 'sent').length, color: 'yellow' },
          { label: 'Viewed', value: proposals.filter((p) => p.status === 'viewed').length, color: 'purple' },
          { label: 'Accepted', value: proposals.filter((p) => p.status === 'accepted').length, color: 'green' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Proposals List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : proposals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No proposals yet</p>
            <button
              onClick={() => setShowTemplateSelect(true)}
              className="mt-2 text-blue-600 hover:underline"
            >
              Create your first proposal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {proposal.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[proposal.status]}`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {proposal.client_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${proposal.pricing?.total?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {proposal.view_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(proposal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {proposal.status === 'draft' && (
                      <button
                        onClick={() => sendProposal(proposal)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    )}
                    {(proposal.status === 'sent' || proposal.status === 'viewed' || proposal.status === 'accepted') && (
                      <button
                        onClick={() => sendToPortal(proposal)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        title="Send to client portal"
                      >
                        <Upload className="w-4 h-4" />
                        Portal
                      </button>
                    )}
                    <button
                      onClick={() => copyShareLink(proposal)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Copy link"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingProposal(proposal);
                        setShowEditor(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicateProposal(proposal)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProposal(proposal.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {showTemplateSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowTemplateSelect(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select a Template
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => createFromTemplate(template)}
                      className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {template.sections?.length || 0} sections
                      </p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowTemplateSelect(false)}
                  className="mt-4 w-full py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Proposal Editor Component
const ProposalEditor: React.FC<{
  proposal: Proposal;
  leads: Lead[];
  onSave: (proposal: Proposal) => void;
  onCancel: () => void;
}> = ({ proposal, leads, onSave, onCancel }) => {
  const [formData, setFormData] = useState(proposal);
  const [sections, setSections] = useState<ProposalSection[]>(proposal.sections || []);
  const [pricingItems, setPricingItems] = useState(proposal.pricing?.items || []);

  const updateSection = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
  };

  const addPricingItem = () => {
    setPricingItems((prev) => [...prev, { description: '', amount: 0 }]);
  };

  const updatePricingItem = (index: number, field: 'description' | 'amount', value: string | number) => {
    setPricingItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removePricingItem = (index: number) => {
    setPricingItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = pricingItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = formData.pricing?.tax || 0;
    const discount = formData.pricing?.discount || 0;
    return subtotal + tax - discount;
  };

  const handleSave = () => {
    onSave({
      ...formData,
      sections,
      pricing: {
        items: pricingItems,
        subtotal: pricingItems.reduce((sum, item) => sum + (item.amount || 0), 0),
        tax: formData.pricing?.tax || 0,
        discount: formData.pricing?.discount || 0,
        total: calculateTotal(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600">
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-lg font-semibold bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white"
              placeholder="Proposal Title"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Client Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Client Name</label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Company</label>
              <input
                type="text"
                value={formData.client_company || ''}
                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-500 mb-1">Link to Lead</label>
            <select
              value={formData.lead_id || ''}
              onChange={(e) => setFormData({ ...formData, lead_id: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">No linked lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} ({lead.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 mb-6">
          <Reorder.Group values={sections} onReorder={setSections}>
            {sections.map((section) => (
              <Reorder.Item key={section.id} value={section}>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {section.title}
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">
                      {section.type}
                    </span>
                  </div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder={`Enter ${section.title.toLowerCase()} content...`}
                  />
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Pricing</h3>
            <button
              onClick={addPricingItem}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {pricingItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updatePricingItem(index, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Description"
                />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updatePricingItem(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-32 pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <button
                  onClick={() => removePricingItem(index)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Valid Until */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Validity</h3>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Valid Until</label>
            <input
              type="date"
              value={formData.valid_until || ''}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
