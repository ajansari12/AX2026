import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AdminAuthReturn {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): AdminAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userEmail: string | undefined) => {
    if (!userEmail) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', userEmail)
        .eq('is_active', true)
        .maybeSingle();

      setIsAdmin(!error && !!data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdminStatus(session?.user?.email).then(() => {
        setIsLoading(false);
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdminStatus(session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const userEmail = data.session?.user?.email;

      if (!userEmail) {
        await supabase.auth.signOut();
        return { success: false, error: 'Failed to verify user email' };
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', userEmail)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        setSession(null);
        return { success: false, error: 'Access denied. You are not authorized to access the admin panel.' };
      }

      setSession(data.session);
      setIsAdmin(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    isAdmin,
    signIn,
    signOut,
  };
}
