import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================
// Types
// ============================================

export interface Project {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
  service_type: string | null;
  start_date: string | null;
  estimated_end_date: string | null;
  actual_end_date: string | null;
  total_value: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  milestones?: Milestone[];
  completed_milestones?: number;
  total_milestones?: number;
  next_milestone?: Milestone | null;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  due_date: string | null;
  completed_at: string | null;
  order_index: number;
  created_at: string;
}

export interface ClientDocument {
  id: string;
  client_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: 'proposal' | 'contract' | 'invoice' | 'asset' | 'training' | 'deliverable' | 'general';
  uploaded_by: string | null;
  is_signed: boolean;
  requires_signature: boolean;
  viewed_at: string | null;
  downloaded_at: string | null;
  created_at: string;
  // Relations
  project?: { name: string } | null;
}

export interface ClientMessage {
  id: string;
  client_id: string;
  project_id: string | null;
  sender_type: 'client' | 'admin';
  sender_email: string;
  sender_name: string | null;
  subject: string | null;
  content: string;
  attachments: any[];
  is_read: boolean;
  read_at: string | null;
  parent_id: string | null;
  created_at: string;
  // Relations
  project?: { name: string } | null;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id: string | null;
  invoice_number: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  description: string | null;
  line_items: any[];
  notes: string | null;
  due_date: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  stripe_payment_url: string | null;
  payment_method: 'stripe' | 'bank_transfer' | 'check' | 'cash' | 'other';
  payment_instructions: string | null;
  manual_payment_date: string | null;
  manual_payment_reference: string | null;
  payment_notes: string | null;
  created_at: string;
  // Relations
  project?: { name: string } | null;
}

export interface ClientActivity {
  id: string;
  client_id: string;
  project_id: string | null;
  activity_type: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
}

// ============================================
// Projects Hook
// ============================================

export function useClientProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          milestones:project_milestones(*)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Enhance projects with computed fields
      const enhancedProjects = (data || []).map(project => {
        const milestones = project.milestones || [];
        const completedMilestones = milestones.filter((m: Milestone) => m.status === 'completed').length;
        const sortedMilestones = [...milestones].sort((a: Milestone, b: Milestone) => a.order_index - b.order_index);
        const nextMilestone = sortedMilestones.find((m: Milestone) => m.status !== 'completed') || null;

        return {
          ...project,
          milestones: sortedMilestones,
          completed_milestones: completedMilestones,
          total_milestones: milestones.length,
          next_milestone: nextMilestone,
        };
      });

      setProjects(enhancedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getProject = useCallback((id: string) => {
    return projects.find(p => p.id === id) || null;
  }, [projects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
    getProject,
    activeProjects: projects.filter(p => p.status === 'in_progress'),
    completedProjects: projects.filter(p => p.status === 'completed'),
  };
}

// ============================================
// Documents Hook
// ============================================

export function useClientDocuments(projectId?: string) {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('client_documents')
        .select(`
          *,
          project:projects(name)
        `)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const markAsViewed = async (documentId: string) => {
    try {
      await supabase
        .from('client_documents')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', documentId);

      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId ? { ...doc, viewed_at: new Date().toISOString() } : doc
        )
      );
    } catch (err) {
      console.error('Error marking document as viewed:', err);
    }
  };

  const markAsDownloaded = async (documentId: string) => {
    try {
      await supabase
        .from('client_documents')
        .update({ downloaded_at: new Date().toISOString() })
        .eq('id', documentId);
    } catch (err) {
      console.error('Error marking document as downloaded:', err);
    }
  };

  return {
    documents,
    isLoading,
    error,
    refetch: fetchDocuments,
    markAsViewed,
    markAsDownloaded,
    byCategory: (category: string) => documents.filter(d => d.category === category),
  };
}

// ============================================
// Messages Hook
// ============================================

export function useClientMessages() {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('client_messages')
        .select(`
          *,
          project:projects(name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (content: string, subject?: string, projectId?: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user?.email;

      if (!email) {
        throw new Error('Not authenticated');
      }

      const normalizedEmail = email.toLowerCase();

      // Get client data
      const { data: client } = await supabase
        .from('clients')
        .select('id, name')
        .eq('email', normalizedEmail)
        .single();

      if (!client) {
        throw new Error('Client not found');
      }

      const { data, error: insertError } = await supabase
        .from('client_messages')
        .insert({
          client_id: client.id,
          project_id: projectId || null,
          sender_type: 'client',
          sender_email: normalizedEmail,
          sender_name: client.name,
          subject,
          content,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setMessages(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Error sending message:', err);
      return { success: false, error: 'Failed to send message' };
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('client_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, is_read: true, read_at: new Date().toISOString() } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read && m.sender_type === 'admin').length;

  return {
    messages,
    isLoading,
    error,
    refetch: fetchMessages,
    sendMessage,
    markAsRead,
    unreadCount,
    unreadMessages: messages.filter(m => !m.is_read && m.sender_type === 'admin'),
  };
}

// ============================================
// Invoices Hook
// ============================================

export function useClientInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('invoices')
        .select(`
          *,
          project:projects(name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setInvoices(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const markAsViewed = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(i => i.id === invoiceId);
      if (invoice && !invoice.viewed_at) {
        await supabase
          .from('invoices')
          .update({ viewed_at: new Date().toISOString(), status: 'viewed' })
          .eq('id', invoiceId);

        setInvoices(prev =>
          prev.map(inv =>
            inv.id === invoiceId
              ? { ...inv, viewed_at: new Date().toISOString(), status: 'viewed' as const }
              : inv
          )
        );
      }
    } catch (err) {
      console.error('Error marking invoice as viewed:', err);
    }
  };

  const pendingInvoices = invoices.filter(i => ['sent', 'viewed', 'overdue'].includes(i.status));
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const totalOutstanding = pendingInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

  return {
    invoices,
    isLoading,
    error,
    refetch: fetchInvoices,
    markAsViewed,
    pendingInvoices,
    paidInvoices,
    totalOutstanding,
    totalPaid,
  };
}

// ============================================
// Activity Hook
// ============================================

export function useClientActivity(limit = 20) {
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('client_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    refetch: fetchActivities,
  };
}

// ============================================
// Training Types
// ============================================

export interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
  category: 'getting-started' | 'guides' | 'videos' | 'documentation';
  type: 'video' | 'article' | 'document';
  content_url: string | null;
  content_body: string | null;
  duration: string | null;
  read_time: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface TrainingProgress {
  id: string;
  client_id: string;
  module_id: string;
  started_at: string | null;
  completed_at: string | null;
  progress_percent: number;
}

// ============================================
// Training Hook
// ============================================

export function useClientTraining() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraining = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user?.email?.toLowerCase();

      if (!email) {
        setModules([]);
        setProgress([]);
        setIsLoading(false);
        return;
      }

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (!client) {
        const { data: allModules } = await supabase
          .from('training_modules')
          .select('*')
          .eq('is_active', true)
          .order('order_index');

        setModules(allModules || []);
        setProgress([]);
        setIsLoading(false);
        return;
      }

      const { data: assignments } = await supabase
        .from('client_training_assignments')
        .select('module_id')
        .eq('client_id', client.id);

      const assignedModuleIds = assignments?.map(a => a.module_id) || [];

      let modulesQuery = supabase
        .from('training_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (assignedModuleIds.length > 0) {
        modulesQuery = modulesQuery.in('id', assignedModuleIds);
      }

      const { data: modulesData, error: modulesError } = await modulesQuery;
      if (modulesError) throw modulesError;

      const { data: progressData, error: progressError } = await supabase
        .from('client_training_progress')
        .select('*')
        .eq('client_id', client.id);
      if (progressError) throw progressError;

      setModules(modulesData || []);
      setProgress(progressData || []);
    } catch (err) {
      console.error('Error fetching training:', err);
      setError('Failed to load training content');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  const markAsStarted = async (moduleId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user?.email?.toLowerCase();
      if (!email) return;

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (!client) return;

      const existingProgress = progress.find(p => p.module_id === moduleId);

      if (existingProgress) {
        return;
      }

      const { data, error } = await supabase
        .from('client_training_progress')
        .upsert({
          client_id: client.id,
          module_id: moduleId,
          started_at: new Date().toISOString(),
          progress_percent: 10,
        }, { onConflict: 'client_id,module_id' })
        .select()
        .single();

      if (error) throw error;

      setProgress(prev => [...prev.filter(p => p.module_id !== moduleId), data]);
    } catch (err) {
      console.error('Error marking as started:', err);
    }
  };

  const markAsCompleted = async (moduleId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user?.email?.toLowerCase();
      if (!email) return;

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (!client) return;

      const { data, error } = await supabase
        .from('client_training_progress')
        .upsert({
          client_id: client.id,
          module_id: moduleId,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          progress_percent: 100,
        }, { onConflict: 'client_id,module_id' })
        .select()
        .single();

      if (error) throw error;

      setProgress(prev => [...prev.filter(p => p.module_id !== moduleId), data]);
    } catch (err) {
      console.error('Error marking as completed:', err);
    }
  };

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.module_id === moduleId);
  };

  const isModuleCompleted = (moduleId: string) => {
    const moduleProgress = getModuleProgress(moduleId);
    return moduleProgress?.completed_at !== null && moduleProgress?.completed_at !== undefined;
  };

  const modulesByCategory = {
    'getting-started': modules.filter(m => m.category === 'getting-started'),
    'guides': modules.filter(m => m.category === 'guides'),
    'videos': modules.filter(m => m.category === 'videos'),
    'documentation': modules.filter(m => m.category === 'documentation'),
  };

  const completedCount = progress.filter(p => p.completed_at).length;
  const totalModules = modules.length;
  const overallProgress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return {
    modules,
    progress,
    isLoading,
    error,
    refetch: fetchTraining,
    markAsStarted,
    markAsCompleted,
    getModuleProgress,
    isModuleCompleted,
    modulesByCategory,
    completedCount,
    totalModules,
    overallProgress,
  };
}
