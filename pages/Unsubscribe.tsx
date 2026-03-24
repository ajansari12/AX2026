import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Loader as Loader2, MailX } from 'lucide-react';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';

type Status = 'loading' | 'success' | 'not_found' | 'error';

export const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState<Status>(email ? 'loading' : 'error');

  useEffect(() => {
    if (!email) return;

    const unsubscribe = async () => {
      const { error, count } = await supabase
        .from('lead_sequences')
        .update({ status: 'unsubscribed' })
        .ilike('email', email)
        .neq('status', 'unsubscribed')
        .select('id', { count: 'exact', head: true });

      if (error) {
        setStatus('error');
        return;
      }

      setStatus(count === 0 ? 'not_found' : 'success');
    };

    unsubscribe();
  }, [email]);

  return (
    <>
      <SEO
        title="Unsubscribe"
        description="Manage your email preferences."
      />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
                <Loader2 className="w-8 h-8 text-gray-500 dark:text-gray-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing…</h1>
              <p className="text-gray-500 dark:text-gray-400">Updating your preferences.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">You've been unsubscribed</h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                You won't receive any further emails from us
                {email ? <> at <span className="font-medium text-gray-900 dark:text-white">{email}</span></> : ''}.
              </p>
              <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
                Changed your mind? Reply to any of our emails to re-subscribe.
              </p>
            </>
          )}

          {status === 'not_found' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
                <MailX className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No active subscriptions found</h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We couldn't find any active email sequences associated with{' '}
                {email ? <span className="font-medium text-gray-900 dark:text-white">{email}</span> : 'that address'}.
                You may have already been unsubscribed.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 mb-6">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {!email
                  ? 'No email address was provided. Please use the unsubscribe link from one of our emails.'
                  : 'We were unable to process your request. Please try again or reply directly to any of our emails.'}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};
