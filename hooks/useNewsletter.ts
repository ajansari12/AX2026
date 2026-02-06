import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useFormProtection } from './useFormProtection';

interface UseNewsletterReturn {
  subscribe: (email: string, source?: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  reset: () => void;
  isSubmitting: boolean;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const protection = useFormProtection();

  const subscribe = useCallback(async (email: string, source = 'footer') => {
    setIsSubmitting(true);
    setError(null);

    try {
      const spamCheck = protection.validate(email);
      if (spamCheck.isSpam) {
        setError(spamCheck.reason || 'Submission blocked');
        return { success: false, error: spamCheck.reason || 'Submission blocked' };
      }

      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const utmSource = params?.get('utm_source') || sessionStorage.getItem('ax-utm-source') || null;
      const utmMedium = params?.get('utm_medium') || sessionStorage.getItem('ax-utm-medium') || null;
      const utmCampaign = params?.get('utm_campaign') || sessionStorage.getItem('ax-utm-campaign') || null;

      const { error: dbError } = await supabase.from('newsletter_subscribers').upsert(
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

      if (dbError) {
        console.error('Error subscribing:', dbError);
        setError(dbError.message);
        return { success: false, error: dbError.message };
      }

      protection.recordSubmission();
      setIsSuccess(true);
      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      const msg = 'An unexpected error occurred';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, [protection]);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  return {
    subscribe,
    isLoading: isSubmitting,
    isSuccess,
    error,
    reset,
    isSubmitting,
  };
}
