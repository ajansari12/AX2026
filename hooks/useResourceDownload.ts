import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseResourceDownloadReturn {
  requestDownload: (email: string, resourceTitle: string, resourceFilename: string) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function useResourceDownload(): UseResourceDownloadReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestDownload = async (email: string, resourceTitle: string, resourceFilename: string) => {
    setIsSubmitting(true);

    try {
      const { error: downloadError } = await supabase.from('resource_downloads').insert({
        email,
        resource_name: resourceTitle,
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

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              type: 'resource_download',
              resource: {
                email,
                resourceName: resourceFilename,
                resourceTitle,
                downloadUrl: resourceFilename,
              },
            }),
          }
        );

        if (!response.ok) {
          console.error('Failed to send resource email');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }

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
