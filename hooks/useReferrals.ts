import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Referral {
  id: string;
  referrer_client_id: string;
  referred_name: string;
  referred_email: string;
  referred_phone: string | null;
  status: string;
  reward_type: string | null;
  reward_amount: number | null;
  notes: string | null;
  created_at: string;
  converted_at: string | null;
}

interface ReferralStats {
  total: number;
  pending: number;
  converted: number;
  totalRewards: number;
}

export function useReferrals(clientId: string | undefined) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReferrals = useCallback(async () => {
    if (!clientId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (err) {
      console.error('Error fetching referrals:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const createReferral = async (data: {
    referred_name: string;
    referred_email: string;
    referred_phone?: string;
    notes?: string;
  }) => {
    if (!clientId) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase.from('referrals').insert({
        referrer_client_id: clientId,
        referred_name: data.referred_name,
        referred_email: data.referred_email,
        referred_phone: data.referred_phone || null,
        notes: data.notes || null,
        status: 'pending',
      });

      if (error) throw error;
      await fetchReferrals();
      return { success: true };
    } catch (err: any) {
      console.error('Error creating referral:', err);
      return { success: false, error: err.message };
    }
  };

  const stats: ReferralStats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    converted: referrals.filter(r => r.status === 'converted').length,
    totalRewards: referrals
      .filter(r => r.reward_amount)
      .reduce((sum, r) => sum + (r.reward_amount || 0), 0),
  };

  return { referrals, isLoading, stats, createReferral, refetch: fetchReferrals };
}
