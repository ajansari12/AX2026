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
        console.log('Auth callback URL:', window.location.href);

        const queryParams = new URLSearchParams(window.location.search);
        let code = queryParams.get('code');
        const tokenHash = queryParams.get('token_hash');
        let type = queryParams.get('type');

        const hash = window.location.hash;
        const hashQueryIndex = hash.indexOf('?');
        if (hashQueryIndex !== -1) {
          const hashQueryString = hash.substring(hashQueryIndex + 1);
          const hashParams = new URLSearchParams(hashQueryString);
          if (!type) {
            type = hashParams.get('type');
          }
          if (!code) {
            code = hashParams.get('code');
          }
        }

        const isRecoveryFlow = type === 'recovery' || localStorage.getItem('password_reset_pending') === 'true';

        console.log('Auth params - code:', !!code, 'type:', type, 'isRecovery:', isRecoveryFlow);

        if (code) {
          console.log('Exchanging code for session...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            localStorage.removeItem('password_reset_pending');
            setError('Failed to verify your login link. Please try again.');
            setTimeout(() => navigate('/portal/login', { replace: true }), 3000);
            return;
          }

          if (data.session) {
            console.log('Session established');

            if (isRecoveryFlow) {
              console.log('Recovery flow detected, redirecting to reset password...');
              localStorage.removeItem('password_reset_pending');
              navigate('/portal/reset-password', { replace: true });
            } else {
              console.log('Regular login flow, redirecting to portal...');
              navigate('/portal', { replace: true });
            }
            return;
          }
        }

        if (tokenHash && type) {
          console.log('Token hash detected, checking for session...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log('Session found');

          if (isRecoveryFlow) {
            console.log('Recovery flow detected, redirecting to reset password...');
            localStorage.removeItem('password_reset_pending');
            navigate('/portal/reset-password', { replace: true });
          } else {
            console.log('Regular login flow, redirecting to portal...');
            navigate('/portal', { replace: true });
          }
        } else {
          console.log('No session found');
          localStorage.removeItem('password_reset_pending');
          setError('No authentication code found. Please request a new login link.');
          setTimeout(() => navigate('/portal/login', { replace: true }), 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        localStorage.removeItem('password_reset_pending');
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
