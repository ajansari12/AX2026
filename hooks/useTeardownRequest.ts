import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface TeardownData {
  email: string;
  website_url: string;
}

interface UseTeardownRequestReturn {
  submitRequest: (data: TeardownData) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function useTeardownRequest(): UseTeardownRequestReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRequest = async (data: TeardownData) => {
    setIsSubmitting(true);

    try {
      const { error: teardownError } = await supabase.from('teardown_requests').insert({
        email: data.email,
        website_url: data.website_url,
        status: 'pending',
      });

      if (teardownError) {
        console.error('Error submitting teardown request:', teardownError);
        return { success: false, error: teardownError.message };
      }

      await supabase.from('newsletter_subscribers').upsert(
        {
          email: data.email,
          source: 'exit_modal_teardown',
          is_active: true,
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      );

      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitRequest, isSubmitting };
}
