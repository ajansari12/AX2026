import React, { useState } from 'react';
import { Section, Container, Button } from '../components/UI';
import { SEO } from '../components/SEO';
import {
  useAdminTeardowns,
  useAdminDownloads,
  useAdminSubscribers,
  useAdminStats,
  useAdminConversations,
  useConversationMessages,
  useAdminBookings,
} from '../hooks/useAdmin';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminSearch } from '../hooks/useAdminSearch';
import { AdminSearchFilters, Pagination } from '../components/AdminSearchFilters';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AdminClients } from '../components/AdminClients';
import {
  Users,
  UserCircle,
  Mail,
  Download,
  Globe,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  BarChart3,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  User,
  Bot,
  Calendar,
  Lock,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type TabType = 'overview' | 'leads' | 'clients' | 'conversations' | 'bookings' | 'teardowns' | 'downloads' | 'subscribers';

const AdminLoginForm: React.FC<{
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await onLogin(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <SEO title="Admin Login" description="Login to access the admin dashboard." />
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center">
              <Lock className="w-8 h-8 text-white dark:text-gray-900" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Admin Access
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
            Sign in to access the dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                placeholder="admin@axrategy.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    contacted: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    qualified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    converted: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    closed: 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
    pending: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    completed: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || styles.new}`}>
      {status}
    </span>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; trend?: string }> = ({
  label,
  value,
  icon,
  trend,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400">
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

interface OverviewTabProps {
  onNavigate: (tab: TabType) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate }) => {
  return <AnalyticsDashboard onNavigate={onNavigate} />;
};

interface Lead {
  id: string;
  name: string;
  email: string;
  service_interest: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
}

const LEAD_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

const LEAD_SOURCE_OPTIONS = [
  { value: 'contact_form', label: 'Contact Form' },
  { value: 'chat', label: 'Chat' },
  { value: 'booking', label: 'Booking' },
  { value: 'teardown', label: 'Teardown' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'referral', label: 'Referral' },
];

const LeadsTab: React.FC = () => {
  const {
    results: leads,
    isLoading,
    filters,
    setFilters,
    resetFilters,
    totalCount,
    page,
    setPage,
    totalPages,
    hasActiveFilters,
  } = useAdminSearch<Lead>('leads', 25);

  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      // Refresh the search results
      setFilters({});
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <AdminSearchFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        statusOptions={LEAD_STATUS_OPTIONS}
        sourceOptions={LEAD_SOURCE_OPTIONS}
        totalCount={totalCount}
        tableName="leads"
        showExport={true}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Interest</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Source</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{lead.email}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {lead.service_interest || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {lead.source.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        {updating === lead.id ? (
                          <Loader2 className="animate-spin text-gray-400" size={16} />
                        ) : (
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="text-xs font-bold uppercase bg-transparent border-none cursor-pointer focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                <p className="text-gray-500 dark:text-gray-400">
                  {hasActiveFilters ? 'No leads match your filters' : 'No leads yet'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

const TeardownsTab: React.FC = () => {
  const { teardowns, isLoading } = useAdminTeardowns();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Website</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {teardowns.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{req.email}</td>
                <td className="px-6 py-4">
                  <a
                    href={req.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Globe size={14} />
                    {req.website_url.replace(/^https?:\/\//, '').slice(0, 30)}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(req.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teardowns.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No teardown requests yet</p>
        </div>
      )}
    </div>
  );
};

const DownloadsTab: React.FC = () => {
  const { downloads, isLoading } = useAdminDownloads();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Resource</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {downloads.map((dl) => (
              <tr key={dl.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{dl.email}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{dl.resource_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(dl.downloaded_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {downloads.length === 0 && (
        <div className="text-center py-12">
          <Download className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No downloads yet</p>
        </div>
      )}
    </div>
  );
};

const SubscribersTab: React.FC = () => {
  const { subscribers, isLoading } = useAdminSubscribers();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Source</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{sub.email}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {sub.source.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {sub.is_active ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                      <XCircle size={14} /> Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(sub.subscribed_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {subscribers.length === 0 && (
        <div className="text-center py-12">
          <Mail className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No subscribers yet</p>
        </div>
      )}
    </div>
  );
};

const ConversationDetail: React.FC<{
  conversationId: string;
  email: string | null;
  onBack: () => void;
}> = ({ conversationId, email, onBack }) => {
  const { messages, isLoading } = useConversationMessages(conversationId);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Conversation</h3>
          {email && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{email}</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 max-h-[600px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Bot size={16} className="text-gray-600 dark:text-gray-400" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user'
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-400'
              }`}>
                {formatTime(message.created_at)}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <User size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No messages in this conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingsTab: React.FC = () => {
  const { bookings, isLoading, refetch, updateBookingStatus } = useAdminBookings();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    await updateBookingStatus(id, status as 'scheduled' | 'completed' | 'cancelled' | 'no_show');
    setUpdating(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === 'scheduled' && isUpcoming(b.scheduled_time));
  const pastBookings = bookings.filter(b => b.status !== 'scheduled' || !isUpcoming(b.scheduled_time));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{bookings.length} bookings total</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw size={14} className="mr-2" /> Refresh
        </Button>
      </div>

      {upcomingBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
            Upcoming ({upcomingBookings.length})
          </h3>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-emerald-100 dark:border-emerald-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Name</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Scheduled</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Notes</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/20">
                  {upcomingBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{booking.name}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{booking.email}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(booking.scheduled_time)}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                        {booking.notes || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {updating === booking.id ? (
                          <Loader2 className="animate-spin text-gray-400" size={16} />
                        ) : (
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className="text-xs font-bold uppercase bg-transparent border-none cursor-pointer focus:outline-none"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock size={20} className="text-gray-400" />
          Past Bookings ({pastBookings.length})
        </h3>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {pastBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{booking.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{booking.email}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{formatDate(booking.scheduled_time)}</td>
                    <td className="px-6 py-4">
                      {updating === booking.id ? (
                        <Loader2 className="animate-spin text-gray-400" size={16} />
                      ) : (
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-xs font-bold uppercase bg-transparent border-none cursor-pointer focus:outline-none"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no_show">No Show</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pastBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
              <p className="text-gray-500 dark:text-gray-400">No past bookings yet</p>
            </div>
          )}
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <Calendar className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No bookings yet</p>
        </div>
      )}
    </div>
  );
};

const ConversationsTab: React.FC = () => {
  const { conversations, isLoading, refetch } = useAdminConversations();
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    email: string | null;
  } | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (selectedConversation) {
    return (
      <ConversationDetail
        conversationId={selectedConversation.id}
        email={selectedConversation.email}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{conversations.length} conversations</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw size={14} className="mr-2" /> Refresh
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation({ id: conv.id, email: conv.email })}
              className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  conv.email
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <MessageCircle size={20} className={
                    conv.email
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-400'
                  } />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {conv.email || `Visitor ${conv.visitor_id.slice(0, 8)}`}
                    </p>
                    {conv.email && (
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                        Lead
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conv.message_count} messages - {formatDate(conv.updated_at)}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { isLoading, isAuthenticated, signIn, signOut, session } = useAdminAuth();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={18} /> },
    { id: 'clients', label: 'Clients', icon: <UserCircle size={18} /> },
    { id: 'conversations', label: 'Chats', icon: <MessageCircle size={18} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
    { id: 'teardowns', label: 'Teardowns', icon: <Globe size={18} /> },
    { id: 'downloads', label: 'Downloads', icon: <Download size={18} /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Mail size={18} /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLogin={signIn} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEO
        title="Admin Dashboard"
        description="Manage leads, subscribers, and content for Axrategy."
      />

      <Section className="pt-28 pb-8">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your leads and content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock size={16} />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={session?.user?.email || 'Sign out'}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
          {activeTab === 'leads' && <LeadsTab />}
          {activeTab === 'clients' && <AdminClients />}
          {activeTab === 'conversations' && <ConversationsTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'teardowns' && <TeardownsTab />}
          {activeTab === 'downloads' && <DownloadsTab />}
          {activeTab === 'subscribers' && <SubscribersTab />}
        </Container>
      </Section>
    </div>
  );
};
