import React, { useState, useEffect, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { LayoutDashboard, Users, Calendar, MessageCircle, Settings, Lock, LogOut, RefreshCw, Mail, Phone, DollarSign, TrendingUp, Clock, ChevronRight, ListFilter as Filter, Loader as Loader2, CircleAlert as AlertCircle, Trash2, Send, FileText, ExternalLink, ChartBar as BarChart3, Search, X, Plus } from 'lucide-react';

type AdminTab = 'dashboard' | 'leads' | 'operations' | 'settings';

const AdminLoginForm: React.FC<{
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  error?: string | null;
}> = ({ onLogin, error: authError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await onLogin(email, password);
    if (!result.success) setError(result.error || 'Login failed');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <SEO title="Admin Login" description="Axrategy Admin Panel" />
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center">
              <Lock className="w-8 h-8 text-white dark:text-gray-900" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">Admin Access</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Sign in to access the dashboard</p>
          {(error || authError) && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm">{error || authError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="hello@axrategy.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const DashboardTab: React.FC<{ onNavigate: (tab: AdminTab) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    newLeadsThisWeek: 0,
    totalLeads: 0,
    bookingsThisMonth: 0,
    chatConversationsToday: 0,
    pipelineValue: 0,
    conversionRate: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [leadsResult, allLeadsResult, bookingsResult, chatsResult, recentLeadsResult] = await Promise.all([
          supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
          supabase.from('leads').select('id, expected_value, status', { count: 'exact' }),
          supabase.from('bookings').select('id', { count: 'exact' }).gte('created_at', monthAgo.toISOString()),
          supabase.from('chat_conversations').select('id', { count: 'exact' }).gte('created_at', today.toISOString()),
          supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        ]);

        const totalLeads = allLeadsResult.count || 0;
        const convertedLeads = allLeadsResult.data?.filter(l => l.status === 'converted' || l.status === 'won').length || 0;

        setStats({
          newLeadsThisWeek: leadsResult.count || 0,
          totalLeads,
          bookingsThisMonth: bookingsResult.count || 0,
          chatConversationsToday: chatsResult.count || 0,
          pipelineValue: allLeadsResult.data?.reduce((sum, l) => sum + (l.expected_value || 0), 0) || 0,
          conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
        });

        setRecentLeads(recentLeadsResult.data || []);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    contacted: 'bg-yellow-50 text-yellow-700',
    qualified: 'bg-emerald-50 text-emerald-700',
    proposal: 'bg-orange-50 text-orange-700',
    negotiation: 'bg-amber-50 text-amber-700',
    won: 'bg-emerald-50 text-emerald-700',
    converted: 'bg-green-50 text-green-700',
    lost: 'bg-red-50 text-red-700',
    closed: 'bg-gray-50 text-gray-600',
  };

  const statCards = [
    { label: 'New Leads This Week', value: stats.newLeadsThisWeek, icon: TrendingUp, colorClass: 'bg-emerald-50 dark:bg-emerald-900/20', iconColorClass: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Bookings This Month', value: stats.bookingsThisMonth, icon: Calendar, colorClass: 'bg-blue-50 dark:bg-blue-900/20', iconColorClass: 'text-blue-600 dark:text-blue-400' },
    { label: 'Chats Today', value: stats.chatConversationsToday, icon: MessageCircle, colorClass: 'bg-sky-50 dark:bg-sky-900/20', iconColorClass: 'text-sky-600 dark:text-sky-400' },
    { label: 'Pipeline Value', value: `$${stats.pipelineValue.toLocaleString()}`, icon: DollarSign, colorClass: 'bg-orange-50 dark:bg-orange-900/20', iconColorClass: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <a
          href="https://cal.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <Calendar size={16} />
          View Calendar
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, colorClass, iconColorClass }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
              <Icon className={iconColorClass} size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Leads</h2>
          <button
            onClick={() => onNavigate('leads')}
            className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No leads yet</div>
          ) : recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{lead.name?.[0] || '?'}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email} · {lead.source || 'direct'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                  {lead.status}
                </span>
                <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <a
          href="mailto:hello@axrategy.com"
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-center"
        >
          <Mail className="mx-auto mb-3 text-gray-500" size={24} />
          <p className="font-semibold text-gray-900 dark:text-white text-sm">Send Email</p>
          <p className="text-xs text-gray-400 mt-1">hello@axrategy.com</p>
        </a>
        <a
          href="https://cal.com/axrategy/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-center"
        >
          <Calendar className="mx-auto mb-3 text-gray-500" size={24} />
          <p className="font-semibold text-gray-900 dark:text-white text-sm">Schedule Call</p>
          <p className="text-xs text-gray-400 mt-1">cal.com/axrategy</p>
        </a>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-center"
        >
          <BarChart3 className="mx-auto mb-3 text-gray-500" size={24} />
          <p className="font-semibold text-gray-900 dark:text-white text-sm">Supabase DB</p>
          <p className="text-xs text-gray-400 mt-1">View raw data</p>
        </a>
      </div>
    </div>
  );
};

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  contacted: 'bg-yellow-50 text-yellow-700',
  qualified: 'bg-emerald-50 text-emerald-700',
  proposal: 'bg-orange-50 text-orange-700',
  negotiation: 'bg-amber-50 text-amber-700',
  won: 'bg-green-50 text-green-700',
  lost: 'bg-red-50 text-red-700',
  converted: 'bg-green-50 text-green-700',
  closed: 'bg-gray-50 text-gray-600',
};

const LeadsTab: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data } = await query;
      const filtered = searchQuery
        ? (data || []).filter(l =>
            l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.email?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : (data || []);
      setLeads(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setIsUpdating(true);
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === leadId) setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
    setIsUpdating(false);
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    await supabase.from('leads').delete().eq('id', leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads & Pipeline</h1>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`grid gap-6 ${selectedLead ? 'grid-cols-5' : 'grid-cols-1'}`}>
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden ${selectedLead ? 'col-span-3' : 'col-span-1'}`}>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto mb-4 text-gray-300" size={40} />
              <p className="text-gray-500">No leads found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {leads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    selectedLead?.id === lead.id ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{lead.name?.[0] || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                      {lead.status}
                    </span>
                    <span className="text-xs text-gray-400 hidden md:block">
                      {new Date(lead.created_at).toLocaleDateString('en-CA')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedLead && (
          <div className="col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden self-start">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white truncate pr-4">{selectedLead.name}</h3>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-emerald-600 hover:underline truncate">{selectedLead.email}</a>
                </div>
                {selectedLead.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${selectedLead.phone}`} className="text-sm text-gray-700 dark:text-gray-300">{selectedLead.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{new Date(selectedLead.created_at).toLocaleString('en-CA')}</span>
                </div>
              </div>

              {selectedLead.service_interest && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interested In</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedLead.service_interest}</p>
                </div>
              )}

              {selectedLead.pricing_preference && selectedLead.pricing_preference !== 'undecided' && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pricing Preference</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{selectedLead.pricing_preference.replace('_', ' ')}</p>
                </div>
              )}

              {selectedLead.message && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl p-3">{selectedLead.message}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Source</p>
                <span className="px-2 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">{selectedLead.source || 'direct'}</span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pipeline Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status}
                      onClick={() => updateLeadStatus(selectedLead.id, status)}
                      disabled={isUpdating}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedLead.status === status
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${selectedLead.email}?subject=Re: Your Axrategy Inquiry&body=Hi ${selectedLead.name?.split(' ')[0]},`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                >
                  <Send size={14} />
                  Reply
                </a>
                <button
                  onClick={() => deleteLead(selectedLead.id)}
                  className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OperationsTab: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'bookings' | 'conversations' | 'proposals'>('bookings');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsResult, convsResult] = await Promise.all([
          supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('chat_conversations').select('*').order('updated_at', { ascending: false }).limit(20),
        ]);
        setBookings(bookingsResult.data || []);
        setConversations(convsResult.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operations</h1>

      <div className="flex gap-2">
        {(['bookings', 'conversations', 'proposals'] as const).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeSection === section
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : (
        <>
          {activeSection === 'bookings' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {bookings.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">No bookings yet</div>
                ) : bookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{booking.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{booking.email} · {booking.service_type || 'General'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {booking.scheduled_at
                          ? new Date(booking.scheduled_at).toLocaleDateString('en-CA')
                          : booking.scheduled_time
                            ? new Date(booking.scheduled_time).toLocaleDateString('en-CA')
                            : new Date(booking.created_at).toLocaleDateString('en-CA')}
                      </p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        booking.status === 'confirmed' || booking.status === 'scheduled' ? 'bg-emerald-50 text-emerald-700' :
                        booking.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                        booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>{booking.status || 'pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'conversations' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="font-bold text-gray-900 dark:text-white">Recent Chat Conversations</h2>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {conversations.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">No conversations yet</div>
                ) : conversations.map(conv => (
                  <div key={conv.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{conv.email || 'Anonymous visitor'}</p>
                      <p className="text-xs text-gray-500">{conv.source || 'website'} · {new Date(conv.created_at).toLocaleDateString('en-CA')}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      conv.source === 'product_demo' ? 'bg-sky-50 text-sky-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {conv.source === 'product_demo' ? 'Demo' : 'Chat'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'proposals' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
              <FileText className="mx-auto mb-4 text-gray-300" size={40} />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Proposal Generator</h3>
              <p className="text-gray-500 text-sm mb-6">Create and send client proposals with one click.</p>
              <a
                href="/admin/proposals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
              >
                <Plus size={16} />
                Create Proposal
              </a>
              <p className="text-xs text-gray-400 mt-4">Coming soon — use Supabase dashboard for now</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Email Configuration</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Admin notifications</span>
              <span className="font-medium text-gray-900 dark:text-white">hello@axrategy.com</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400">From address</span>
              <span className="font-medium text-gray-900 dark:text-white">hello@axrategy.com</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Email provider</span>
              <span className="font-medium text-gray-900 dark:text-white">Resend</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Connected Services</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Cal.com', desc: 'Booking calendar', url: 'https://cal.com/dashboard', status: 'connected' },
              { name: 'Stripe', desc: 'Payments', url: 'https://dashboard.stripe.com', status: 'connected' },
              { name: 'Supabase', desc: 'Database & auth', url: 'https://supabase.com/dashboard', status: 'connected' },
              { name: 'Resend', desc: 'Email delivery', url: 'https://resend.com/dashboard', status: 'connected' },
              { name: 'Vapi.ai', desc: 'Phone AI (phase 2)', url: 'https://vapi.ai', status: 'not_connected' },
              { name: 'Zapier', desc: 'Workflow automation', url: 'https://zapier.com', status: 'pending' },
            ].map(service => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{service.name}</p>
                  <p className="text-xs text-gray-400">{service.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    service.status === 'connected' ? 'bg-emerald-500' :
                    service.status === 'pending' ? 'bg-yellow-500' :
                    'bg-gray-300'
                  }`} />
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-gray-600" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">Action Required: Register Cal.com Webhook</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your booking confirmation function exists but isn't registered in Cal.com. New bookings won't appear in your admin until you do this.
          </p>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-700 dark:text-gray-300 mb-4 break-all">
            {`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/booking-confirmation`}
          </div>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
            <li>Go to Cal.com Dashboard &rarr; Developer &rarr; Webhooks</li>
            <li>Click "New Webhook"</li>
            <li>Paste the URL above</li>
            <li>Select events: BOOKING_CREATED, BOOKING_CANCELLED</li>
            <li>Save</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export const Admin: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, isAdmin, signIn: login, signOut: logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLogin={login} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <SEO title="Access Denied" description="You do not have permission to access this page." />
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You are not authorized to access the admin panel.</p>
          <button
            onClick={logout}
            className="w-full py-3 px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:bg-gray-800 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <SEO title="Admin Dashboard" description="Manage leads, bookings, and operations for Axrategy." />

      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-gray-900 font-bold text-xs">Ax</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">Axrategy</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'leads', label: 'Leads & Pipeline', icon: Users },
            { id: 'operations', label: 'Operations', icon: Calendar },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'operations' && <OperationsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
