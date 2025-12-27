import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface Client {
  id: string;
  lead_id: string | null;
  email: string;
  name: string;
  company_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

interface UseClientAuthReturn {
  session: Session | null;
  client: Client | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Pick<Client, 'name' | 'company_name' | 'phone'>>) => Promise<{ success: boolean; error?: string }>;
  refetchClient: () => Promise<void>;
}

export function useClientAuth(): UseClientAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientData = useCallback(async (email: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No client found with this email
          setClient(null);
          setError('No client account found. Please contact support.');
        } else {
          throw fetchError;
        }
        return;
      }

      if (data) {
        setClient(data);
        setError(null);

        // Update last login timestamp
        await supabase
          .from('clients')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.id);
      }
    } catch (err) {
      console.error('Error fetching client data:', err);
      setError('Failed to load client data');
    }
  }, []);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user?.email) {
        fetchClientData(currentSession.user.email);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user?.email) {
          await fetchClientData(newSession.user.email);
        } else {
          setClient(null);
          setError(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchClientData]);

  const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // First check if a client exists with this email
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existingClient) {
        return {
          success: false,
          error: 'No account found with this email. Please contact us to get started.',
        };
      }

      // Send magic link
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/#/portal`,
        },
      });

      if (signInError) {
        return { success: false, error: signInError.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Magic link error:', err);
      return { success: false, error: 'Failed to send login link. Please try again.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setClient(null);
    setError(null);
  };

  const updateProfile = async (
    data: Partial<Pick<Client, 'name' | 'company_name' | 'phone'>>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!client) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update(data)
        .eq('id', client.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setClient(prev => prev ? { ...prev, ...data } : null);

      return { success: true };
    } catch (err) {
      console.error('Profile update error:', err);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const refetchClient = async () => {
    if (session?.user?.email) {
      await fetchClientData(session.user.email);
    }
  };

  return {
    session,
    client,
    isLoading,
    isAuthenticated: !!session && !!client,
    error,
    sendMagicLink,
    signOut,
    updateProfile,
    refetchClient,
  };
}
