import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface Client {
  id: string;
  lead_id: string | null;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: 'active' | 'inactive' | 'pending';
  notes: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  password_set?: boolean;
}

interface UseClientAuthReturn {
  session: Session | null;
  client: Client | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Pick<Client, 'name' | 'company' | 'phone'>>) => Promise<{ success: boolean; error?: string }>;
  refetchClient: () => Promise<void>;
}

export function useClientAuth(): UseClientAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientData = useCallback(async (email: string) => {
    const normalizedEmail = email.toLowerCase();
    try {
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        setClient(null);
        setError('No client account found. Please contact support.');
        return;
      }

      setClient(data);
      setError(null);

      await supabase
        .from('clients')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.id);
    } catch (err) {
      console.error('Error fetching client data:', err);
      setError('Failed to load client data');
    }
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user?.email) {
        await fetchClientData(currentSession.user.email);
      }
      setIsLoading(false);
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user?.email) {
          (async () => {
            await fetchClientData(newSession.user.email);
            setIsLoading(false);
          })();
        } else {
          setClient(null);
          setError(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchClientData]);

  const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: clientExists, error: checkError } = await supabase
        .rpc('check_client_exists', { client_email: email.toLowerCase() });

      if (checkError) {
        throw checkError;
      }

      if (!clientExists) {
        return {
          success: false,
          error: 'No account found with this email. Please contact us to get started.',
        };
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/#/auth/callback`,
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

  const signInWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: clientExists, error: checkError } = await supabase
        .rpc('check_client_exists', { client_email: email.toLowerCase() });

      if (checkError) {
        throw checkError;
      }

      if (!clientExists) {
        return {
          success: false,
          error: 'No account found with this email. Please contact us to get started.',
        };
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please try again.' };
        }
        return { success: false, error: signInError.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Password sign in error:', err);
      return { success: false, error: 'Failed to sign in. Please try again.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: clientExists, error: checkError } = await supabase
        .rpc('check_client_exists', { client_email: email.toLowerCase() });

      if (checkError) {
        throw checkError;
      }

      if (!clientExists) {
        return {
          success: false,
          error: 'No account found with this email. Please contact us to get started.',
        };
      }

      localStorage.setItem('password_reset_pending', 'true');

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase(),
        {
          redirectTo: `${window.location.origin}/#/auth/callback?type=recovery`,
        }
      );

      if (resetError) {
        localStorage.removeItem('password_reset_pending');
        return { success: false, error: resetError.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Password reset error:', err);
      localStorage.removeItem('password_reset_pending');
      return { success: false, error: 'Failed to send reset link. Please try again.' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      if (session?.user?.email) {
        await supabase.rpc('mark_password_set', {
          client_email: session.user.email.toLowerCase(),
        });
      }

      return { success: true };
    } catch (err) {
      console.error('Password update error:', err);
      return { success: false, error: 'Failed to update password. Please try again.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setClient(null);
    setError(null);
  };

  const updateProfile = async (
    data: Partial<Pick<Client, 'name' | 'company' | 'phone'>>
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
    signInWithPassword,
    resetPassword,
    updatePassword,
    signOut,
    updateProfile,
    refetchClient,
  };
}
