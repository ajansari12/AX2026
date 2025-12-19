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
      const { error } = await supabase.from('newsletter_subscribers').upsert(
        {
          email,
          source,
          is_active: true,
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
