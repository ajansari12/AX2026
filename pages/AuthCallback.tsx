import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's a code in the hash (PKCE flow for magic links)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const code = hashParams.get('code');

        if (code) {
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            setError('Failed to verify your login link. Please try again.');
            setTimeout(() => navigate('/portal/login', { replace: true }), 3000);
            return;
          }

          if (data.session) {
            navigate('/portal', { replace: true });
            return;
          }
        }

        // Fallback: Check for existing session (in case user refreshed page)
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          navigate('/portal', { replace: true });
        } else {
          setError('No authentication code found. Please request a new login link.');
          setTimeout(() => navigate('/portal/login', { replace: true }), 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/portal/login', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-gray-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
};
