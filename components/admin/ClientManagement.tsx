import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Upload,
  Send,
  Receipt,
  FolderKanban,
  FileText,
  MessageSquare,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Eye,
  Download,
  ExternalLink,
  Target,
  Edit2,
  Trash2,
  CreditCard,
  Banknote,
  FileCheck,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Client } from '../../hooks/useAdminClients';

interface ClientManagementProps {
  client: Client;
  onClose: () => void;
  onRefresh: () => void;
}

type TabType = 'overview' | 'projects' | 'documents' | 'invoices' | 'messages' | 'activity';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  service_type: string | null;
  start_date: string | null;
  estimated_end_date: string | null;
  total_value: number | null;
  currency: string;
  created_at: string;
  milestones?: { id: string; title: string; status: string }[];
}

interface Document {
  id: string;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  created_at: string;
  viewed_at: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  currency: string;
  due_date: string | null;
  paid_at: string | null;
  payment_method: string;
  created_at: string;
}

interface Message {
  id: string;
  sender_type: string;
  sender_name: string | null;
  subject: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({
  client,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);

  const fetchClientData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projectsRes, docsRes, invoicesRes, messagesRes, activityRes] = await Promise.all([
        supabase.from('projects').select('*, milestones:project_milestones(id, title, status)').eq('client_id', client.id).order('created_at', { ascending: false }),
        supabase.from('client_documents').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
        supabase.from('client_messages').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('client_activity').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(30),
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (docsRes.data) setDocuments(docsRes.data);
      if (invoicesRes.data) setInvoices(invoicesRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
      if (activityRes.data) setActivities(activityRes.data);
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [client.id]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={16} />, count: projects.length },
    { id: 'documents', label: 'Documents', icon: <FileText size={16} />, count: documents.length },
    { id: 'invoices', label: 'Invoices', icon: <Receipt size={16} />, count: invoices.length },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} />, count: messages.length },
    { id: 'activity', label: 'Activity', icon: <Clock size={16} /> },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      on_hold: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      viewed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative ml-auto w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col h-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {client.name || 'Unnamed Client'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(client.status)}`}>
            {client.status}
          </span>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Plus size={16} />
              Create Project
            </button>
            <button
              onClick={() => setShowUploadDocument(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload size={16} />
              Upload Document
            </button>
            <button
              onClick={() => setShowCreateInvoice(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Receipt size={16} />
              Create Invoice
            </button>
            <button
              onClick={() => setShowSendMessage(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewTab
                  client={client}
                  projects={projects}
                  invoices={invoices}
                  formatCurrency={formatCurrency}
                  getStatusColor={getStatusColor}
                />
              )}
              {activeTab === 'projects' && (
                <ProjectsTab
                  projects={projects}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  onCreateNew={() => setShowCreateProject(true)}
                />
              )}
              {activeTab === 'documents' && (
                <DocumentsTab
                  documents={documents}
                  formatDate={formatDate}
                  onUpload={() => setShowUploadDocument(true)}
                />
              )}
              {activeTab === 'invoices' && (
                <InvoicesTab
                  invoices={invoices}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  onCreateNew={() => setShowCreateInvoice(true)}
                  onRefresh={fetchClientData}
                />
              )}
              {activeTab === 'messages' && (
                <MessagesTab
                  messages={messages}
                  formatDate={formatDate}
                  onSendNew={() => setShowSendMessage(true)}
                />
              )}
              {activeTab === 'activity' && (
                <ActivityTab activities={activities} formatDate={formatDate} />
              )}
            </>
          )}
        </div>

        <CreateProjectModal
          isOpen={showCreateProject}
          clientId={client.id}
          onClose={() => setShowCreateProject(false)}
          onSuccess={() => {
            setShowCreateProject(false);
            fetchClientData();
            onRefresh();
          }}
        />

        <UploadDocumentModal
          isOpen={showUploadDocument}
          clientId={client.id}
          projects={projects}
          onClose={() => setShowUploadDocument(false)}
          onSuccess={() => {
            setShowUploadDocument(false);
            fetchClientData();
          }}
        />

        <CreateInvoiceModal
          isOpen={showCreateInvoice}
          clientId={client.id}
          projects={projects}
          onClose={() => setShowCreateInvoice(false)}
          onSuccess={() => {
            setShowCreateInvoice(false);
            fetchClientData();
            onRefresh();
          }}
        />

        <SendMessageModal
          isOpen={showSendMessage}
          clientId={client.id}
          clientEmail={client.email}
          projects={projects}
          onClose={() => setShowSendMessage(false)}
          onSuccess={() => {
            setShowSendMessage(false);
            fetchClientData();
          }}
        />
      </motion.div>
    </div>
  );
};

const OverviewTab: React.FC<{
  client: Client;
  projects: Project[];
  invoices: Invoice[];
  formatCurrency: (amount: number, currency?: string) => string;
  getStatusColor: (status: string) => string;
}> = ({ client, projects, invoices, formatCurrency, getStatusColor }) => {
  const activeProjects = projects.filter(p => ['planning', 'in_progress', 'review'].includes(p.status));
  const pendingInvoices = invoices.filter(i => ['sent', 'viewed', 'overdue'].includes(i.status));
  const totalOutstanding = pendingInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
            <FolderKanban size={14} />
            <span>Active Projects</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeProjects.length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
            <DollarSign size={14} />
            <span>Outstanding</span>
          </div>
          <p className={`text-2xl font-bold ${totalOutstanding > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
            {formatCurrency(totalOutstanding)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Mail size={16} />
            <span>{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Phone size={16} />
              <span>{client.phone}</span>
            </div>
          )}
          {client.company && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Building2 size={16} />
              <span>{client.company}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Calendar size={16} />
            <span>Client since {new Date(client.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span>Last login: {client.last_login_at ? new Date(client.last_login_at).toLocaleString() : 'Never'}</span>
          </div>
        </div>
      </div>

      {activeProjects.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Active Projects</h3>
          <div className="space-y-3">
            {activeProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
                  {project.service_type && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.service_type}</p>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {client.notes && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}
    </div>
  );
};

const ProjectsTab: React.FC<{
  projects: Project[];
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  onCreateNew: () => void;
}> = ({ projects, formatCurrency, formatDate, getStatusColor, onCreateNew }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderKanban className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Create the first project for this client.</p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const completedMilestones = project.milestones?.filter(m => m.status === 'completed').length || 0;
        const totalMilestones = project.milestones?.length || 0;

        return (
          <div key={project.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{project.name}</h4>
                {project.service_type && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.service_type}</p>
                )}
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>

            {project.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{project.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {project.start_date && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(project.start_date)}
                </span>
              )}
              {project.total_value && (
                <span className="flex items-center gap-1">
                  <DollarSign size={14} />
                  {formatCurrency(project.total_value, project.currency)}
                </span>
              )}
              {totalMilestones > 0 && (
                <span className="flex items-center gap-1">
                  <Target size={14} />
                  {completedMilestones}/{totalMilestones} milestones
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DocumentsTab: React.FC<{
  documents: Document[];
  formatDate: (date: string) => string;
  onUpload: () => void;
}> = ({ documents, formatDate, onUpload }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      proposal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      contract: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      invoice: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      asset: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      training: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      deliverable: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      general: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[category] || colors.general;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Upload the first document for this client.</p>
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Upload size={18} />
          Upload Document
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <FileText size={18} className="text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(doc.category)}`}>
                    {doc.category}
                  </span>
                  {doc.file_size && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(doc.file_size)}</span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(doc.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {doc.viewed_at && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye size={12} />
                  Viewed
                </span>
              )}
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InvoicesTab: React.FC<{
  invoices: Invoice[];
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  onCreateNew: () => void;
  onRefresh: () => void;
}> = ({ invoices, formatCurrency, formatDate, getStatusColor, onCreateNew, onRefresh }) => {
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  const handleMarkAsPaid = async (invoiceId: string) => {
    setMarkingPaid(invoiceId);
    try {
      await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          manual_payment_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .eq('id', invoiceId);
      onRefresh();
    } catch (err) {
      console.error('Error marking invoice as paid:', err);
    } finally {
      setMarkingPaid(null);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard size={14} />;
      case 'bank_transfer':
        return <Banknote size={14} />;
      case 'check':
        return <FileCheck size={14} />;
      default:
        return <DollarSign size={14} />;
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Create the first invoice for this client.</p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Receipt size={18} className="text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    {getPaymentMethodIcon(invoice.payment_method)}
                    {invoice.payment_method.replace('_', ' ')}
                  </span>
                  {invoice.due_date && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {formatDate(invoice.due_date)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(invoice.total_amount, invoice.currency)}
              </span>
              {['sent', 'viewed', 'overdue'].includes(invoice.status) && (
                <button
                  onClick={() => handleMarkAsPaid(invoice.id)}
                  disabled={markingPaid === invoice.id}
                  className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
                >
                  {markingPaid === invoice.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    'Mark Paid'
                  )}
                </button>
              )}
            </div>
          </div>
          {invoice.paid_at && (
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} />
              Paid on {formatDate(invoice.paid_at)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const MessagesTab: React.FC<{
  messages: Message[];
  formatDate: (date: string) => string;
  onSendNew: () => void;
}> = ({ messages, formatDate, onSendNew }) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Start a conversation with this client.</p>
        <button
          onClick={onSendNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Send size={18} />
          Send Message
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-xl ${
            message.sender_type === 'admin'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 ml-8'
              : 'bg-gray-100 dark:bg-gray-800 mr-8'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              message.sender_type === 'admin'
                ? 'text-gray-300 dark:text-gray-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {message.sender_type === 'admin' ? 'You' : message.sender_name || 'Client'}
            </span>
            <span className={`text-xs ${
              message.sender_type === 'admin'
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formatDate(message.created_at)}
            </span>
          </div>
          {message.subject && (
            <p className={`text-sm font-medium mb-1 ${
              message.sender_type === 'admin'
                ? 'text-white dark:text-gray-900'
                : 'text-gray-900 dark:text-white'
            }`}>
              {message.subject}
            </p>
          )}
          <p className={`text-sm ${
            message.sender_type === 'admin'
              ? 'text-gray-200 dark:text-gray-700'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
};

const ActivityTab: React.FC<{
  activities: Activity[];
  formatDate: (date: string) => string;
}> = ({ activities, formatDate }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <User size={16} className="text-blue-500" />;
      case 'document_view':
        return <Eye size={16} className="text-purple-500" />;
      case 'document_download':
        return <Download size={16} className="text-emerald-500" />;
      case 'message_sent':
        return <Send size={16} className="text-cyan-500" />;
      case 'invoice_viewed':
        return <Receipt size={16} className="text-amber-500" />;
      case 'invoice_paid':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activity yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Activity will appear here once the client starts using the portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            {getActivityIcon(activity.activity_type)}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(activity.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const CreateProjectModal: React.FC<{
  isOpen: boolean;
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, clientId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    service_type: '',
    start_date: '',
    estimated_end_date: '',
    total_value: '',
    currency: 'USD',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        service_type: '',
        start_date: '',
        estimated_end_date: '',
        total_value: '',
        currency: 'USD',
      });
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('projects').insert({
        client_id: clientId,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        service_type: formData.service_type || null,
        start_date: formData.start_date || null,
        estimated_end_date: formData.estimated_end_date || null,
        total_value: formData.total_value ? parseFloat(formData.total_value) : null,
        currency: formData.currency,
        status: 'planning',
      });

      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Project</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              placeholder="Website Redesign"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Service Type
            </label>
            <select
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            >
              <option value="">Select service type</option>
              <option value="AI Assistant">AI Assistant</option>
              <option value="Automation">Automation</option>
              <option value="Website">Website</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none"
              placeholder="Project description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Est. End Date
              </label>
              <input
                type="date"
                value={formData.estimated_end_date}
                onChange={(e) => setFormData({ ...formData, estimated_end_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Value
              </label>
              <input
                type="number"
                value={formData.total_value}
                onChange={(e) => setFormData({ ...formData, total_value: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const UploadDocumentModal: React.FC<{
  isOpen: boolean;
  clientId: string;
  projects: Project[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, clientId, projects, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file_url: '',
    category: 'general',
    project_id: '',
    requires_signature: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        file_url: '',
        category: 'general',
        project_id: '',
        requires_signature: false,
      });
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.file_url.trim()) {
      setError('Document name and URL are required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('client_documents').insert({
        client_id: clientId,
        project_id: formData.project_id || null,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        file_url: formData.file_url.trim(),
        category: formData.category,
        requires_signature: formData.requires_signature,
        uploaded_by: 'admin',
      });

      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Document</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              placeholder="Project Proposal.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              placeholder="https://storage.example.com/document.pdf"
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Upload to your storage provider and paste the URL here
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              >
                <option value="general">General</option>
                <option value="proposal">Proposal</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="deliverable">Deliverable</option>
                <option value="asset">Asset</option>
                <option value="training">Training</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              >
                <option value="">No project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none"
              placeholder="Document description..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requires_signature"
              checked={formData.requires_signature}
              onChange={(e) => setFormData({ ...formData, requires_signature: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-gray-900 dark:focus:ring-white"
            />
            <label htmlFor="requires_signature" className="text-sm text-gray-700 dark:text-gray-300">
              Requires client signature
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              Upload Document
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CreateInvoiceModal: React.FC<{
  isOpen: boolean;
  clientId: string;
  projects: Project[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, clientId, projects, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    tax_amount: '',
    currency: 'USD',
    due_date: '',
    project_id: '',
    payment_method: 'stripe',
    payment_instructions: '',
    notes: '',
  });
  const [lineItems, setLineItems] = useState<{ description: string; quantity: number; unit_price: number }[]>([
    { description: '', quantity: 1, unit_price: 0 },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        description: '',
        amount: '',
        tax_amount: '',
        currency: 'USD',
        due_date: '',
        project_id: '',
        payment_method: 'stripe',
        payment_instructions: '',
        notes: '',
      });
      setLineItems([{ description: '', quantity: 1, unit_price: 0 }]);
      setError('');
    }
  }, [isOpen]);

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const tax = parseFloat(formData.tax_amount) || 0;
    return subtotal + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    if (total <= 0) {
      setError('Invoice must have a positive amount');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const tax = parseFloat(formData.tax_amount) || 0;

      const { error: insertError } = await supabase.from('invoices').insert({
        client_id: clientId,
        project_id: formData.project_id || null,
        description: formData.description.trim() || null,
        amount: subtotal,
        tax_amount: tax,
        total_amount: subtotal + tax,
        currency: formData.currency,
        due_date: formData.due_date || null,
        line_items: lineItems.filter(item => item.description.trim()),
        payment_method: formData.payment_method,
        payment_instructions: formData.payment_instructions.trim() || null,
        notes: formData.notes.trim() || null,
        status: 'draft',
      });

      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice');
    } finally {
      setIsSaving(false);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Invoice</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Line Items
            </label>
            <div className="space-y-2">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="Qty"
                    min="1"
                  />
                  <input
                    type="number"
                    value={item.unit_price || ''}
                    onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    className="w-28 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="Price"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
            >
              <Plus size={14} />
              Add line item
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tax Amount
              </label>
              <input
                type="number"
                value={formData.tax_amount}
                onChange={(e) => setFormData({ ...formData, tax_amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-700 dark:text-gray-300">Total:</span>
              <span className="text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: formData.currency }).format(calculateTotal())}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="stripe">Credit Card (Stripe)</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {formData.payment_method !== 'stripe' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Instructions
              </label>
              <textarea
                value={formData.payment_instructions}
                onChange={(e) => setFormData({ ...formData, payment_instructions: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                placeholder={formData.payment_method === 'bank_transfer'
                  ? "Bank: Example Bank\nAccount: 123456789\nRouting: 987654321"
                  : formData.payment_method === 'check'
                  ? "Make check payable to: Company Name\nMail to: 123 Main St..."
                  : "Payment instructions..."}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project (optional)
            </label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              placeholder="Additional notes for the client..."
            />
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Create Invoice
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SendMessageModal: React.FC<{
  isOpen: boolean;
  clientId: string;
  clientEmail: string;
  projects: Project[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, clientId, clientEmail, projects, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    project_id: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({ subject: '', content: '', project_id: '' });
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError('Message content is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const { data: session } = await supabase.auth.getSession();
      const adminEmail = session.session?.user?.email || 'admin@axrategy.com';

      const { error: insertError } = await supabase.from('client_messages').insert({
        client_id: clientId,
        project_id: formData.project_id || null,
        sender_type: 'admin',
        sender_email: adminEmail,
        sender_name: 'Axrategy Team',
        subject: formData.subject.trim() || null,
        content: formData.content.trim(),
      });

      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Message</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Mail size={14} />
            <span>To: {clientEmail}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Message subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              placeholder="Type your message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Related Project
            </label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">General message</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              <Send size={16} />
              Send Message
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ClientManagement;
