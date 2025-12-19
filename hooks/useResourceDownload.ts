import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseResourceDownloadReturn {
  requestDownload: (email: string, resourceName: string) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function useResourceDownload(): UseResourceDownloadReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestDownload = async (email: string, resourceName: string) => {
    setIsSubmitting(true);

    try {
      const { error: downloadError } = await supabase.from('resource_downloads').insert({
        email,
        resource_name: resourceName,
      });

      if (downloadError) {
        console.error('Error logging download:', downloadError);
        return { success: false, error: downloadError.message };
      }

      await supabase.from('newsletter_subscribers').upsert(
        {
          email,
          source: 'resource_download',
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

  return { requestDownload, isSubmitting };
}
