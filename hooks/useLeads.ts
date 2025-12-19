import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { LeadSource } from '../lib/database.types';

interface LeadData {
  name: string;
  email: string;
  service_interest?: string;
  message?: string;
  source: LeadSource;
}

interface UseLeadsReturn {
  submitLead: (data: LeadData) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function useLeads(): UseLeadsReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUTMParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    };
  };

  const submitLead = async (data: LeadData) => {
    setIsSubmitting(true);

    try {
      const utmParams = getUTMParams();

      const { error } = await supabase.from('leads').insert({
        name: data.name,
        email: data.email,
        service_interest: data.service_interest || null,
        message: data.message || null,
        source: data.source,
        status: 'new',
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
      });

      if (error) {
        console.error('Error submitting lead:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitLead, isSubmitting };
}
