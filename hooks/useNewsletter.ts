import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseNewsletterReturn {
  subscribe: (email: string, source: string) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscribe = async (email: string, source: string) => {
    setIsSubmitting(true);

    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const utmSource = params?.get('utm_source') || sessionStorage.getItem('ax-utm-source') || null;
      const utmMedium = params?.get('utm_medium') || sessionStorage.getItem('ax-utm-medium') || null;
      const utmCampaign = params?.get('utm_campaign') || sessionStorage.getItem('ax-utm-campaign') || null;

      const { error } = await supabase.from('newsletter_subscribers').upsert(
        {
          email,
          source,
          is_active: true,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      );

      if (error) {
        console.error('Error subscribing:', error);
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

  return { subscribe, isSubmitting };
}
