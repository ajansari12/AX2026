import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================
// Types
// ============================================

export interface Client {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: 'active' | 'inactive' | 'pending';
  notes: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  password_set?: boolean;
  invitation_token?: string | null;
  invitation_expires_at?: string | null;
  projects_count?: number;
  documents_count?: number;
  invoices_count?: number;
  outstanding_balance?: number;
}

export interface CreateClientData {
  email: string;
  password?: string;
  name?: string;
  company?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateClientData {
  name?: string;
  company?: string;
  phone?: string;
  notes?: string;
  status?: 'active' | 'inactive' | 'pending';
}

// ============================================
// Admin Clients Hook
// ============================================

export function useAdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch clients with counts
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select(`
          *,
          projects:projects(count),
          documents:client_documents(count),
          invoices:invoices(count)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Calculate outstanding balance for each client
      const clientsWithBalance = await Promise.all(
        (data || []).map(async (client) => {
          const { data: invoices } = await supabase
            .from('invoices')
            .select('total_amount, status')
            .eq('client_id', client.id)
            .in('status', ['sent', 'viewed', 'overdue']);

          const outstanding = invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0;

          return {
            ...client,
            projects_count: client.projects?.[0]?.count || 0,
            documents_count: client.documents?.[0]?.count || 0,
            invoices_count: client.invoices?.[0]?.count || 0,
            outstanding_balance: outstanding,
          };
        })
      );

      setClients(clientsWithBalance);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (data: CreateClientData) => {
    try {
      if (data.password) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          return { success: false, error: 'Admin session required' };
        }

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-client-with-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
              name: data.name,
              company: data.company,
              phone: data.phone,
              notes: data.notes,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          return { success: false, error: result.error || 'Failed to create client' };
        }

        setClients(prev => [
          {
            ...result.client,
            projects_count: 0,
            documents_count: 0,
            invoices_count: 0,
            outstanding_balance: 0,
          },
          ...prev,
        ]);

        return { success: true, data: result.client };
      }

      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert({
          email: data.email,
          name: data.name || data.email.split('@')[0],
          company: data.company || null,
          phone: data.phone || null,
          notes: data.notes || null,
          status: 'active',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setClients(prev => [
        {
          ...newClient,
          projects_count: 0,
          documents_count: 0,
          invoices_count: 0,
          outstanding_balance: 0,
        },
        ...prev,
      ]);

      return { success: true, data: newClient };
    } catch (err: any) {
      console.error('Error creating client:', err);
      if (err.code === '23505') {
        return { success: false, error: 'A client with this email already exists' };
      }
      return { success: false, error: 'Failed to create client' };
    }
  };

  // Update a client
  const updateClient = async (id: string, data: UpdateClientData) => {
    try {
      const { data: updatedClient, error: updateError } = await supabase
        .from('clients')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setClients(prev =>
        prev.map(client =>
          client.id === id ? { ...client, ...updatedClient } : client
        )
      );

      return { success: true, data: updatedClient };
    } catch (err) {
      console.error('Error updating client:', err);
      return { success: false, error: 'Failed to update client' };
    }
  };

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setClients(prev => prev.filter(client => client.id !== id));

      return { success: true };
    } catch (err) {
      console.error('Error deleting client:', err);
      return { success: false, error: 'Failed to delete client' };
    }
  };

  const sendPortalInvite = async (email: string): Promise<{ success: boolean; error?: string; inviteUrl?: string }> => {
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invitation_token');

      if (tokenError) throw tokenError;

      const token = tokenData as string;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: updateError } = await supabase
        .from('clients')
        .update({
          invitation_token: token,
          invitation_expires_at: expiresAt.toISOString(),
          password_set: false,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase());

      if (updateError) throw updateError;

      const inviteUrl = `${window.location.origin}/#/portal/set-password?token=${token}`;

      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: inviteUrl,
          data: {
            invitation_type: 'client_portal',
          },
        },
      });

      if (authError) throw authError;

      setClients(prev =>
        prev.map(client =>
          client.email.toLowerCase() === email.toLowerCase()
            ? { ...client, invitation_token: token, invitation_expires_at: expiresAt.toISOString(), password_set: false }
            : client
        )
      );

      return { success: true, inviteUrl };
    } catch (err) {
      console.error('Error sending portal invite:', err);
      return { success: false, error: 'Failed to send portal invite' };
    }
  };

  const resendInvite = async (email: string) => {
    return sendPortalInvite(email);
  };

  // Get a single client by ID
  const getClient = useCallback((id: string) => {
    return clients.find(c => c.id === id) || null;
  }, [clients]);

  // Filter helpers
  const activeClients = clients.filter(c => c.status === 'active');
  const inactiveClients = clients.filter(c => c.status === 'inactive');
  const pendingClients = clients.filter(c => c.status === 'pending');

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
    sendPortalInvite,
    resendInvite,
    getClient,
    activeClients,
    inactiveClients,
    pendingClients,
    totalOutstanding: clients.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0),
  };
}
