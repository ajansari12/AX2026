import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useClientAuth } from '../hooks/useClientAuth';
import { SEO } from '../components/SEO';

export const PortalLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendMagicLink } = useClientAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await sendMagicLink(email);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Failed to send login link');
    }
    setIsLoading(false);
  };

  if (sent) {
    return (
      <>
        <SEO title="Check Your Email | Client Portal" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Check your email
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We sent a magic link to <strong className="text-gray-900 dark:text-white">{email}</strong>.
              Click the link to sign in to your client portal.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              The link will expire in 1 hour. Check your spam folder if you don't see it.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Use a different email
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Client Portal | Sign In"
        description="Access your projects, documents, invoices, and messages in one place."
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Back to home */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to website</span>
          </Link>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white dark:text-gray-900">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Client Portal
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Sign in to view your projects and documents
              </p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoFocus
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:bg-white dark:focus:bg-gray-800 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Help text */}
            <p className="text-center text-sm text-gray-400 mt-6">
              We'll send you a magic link to sign in. No password needed.
            </p>

            {/* Contact link */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/contact"
                  className="text-gray-900 dark:text-white font-medium hover:underline"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </div>

          {/* Security note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Your connection is secure and encrypted.
          </p>
        </motion.div>
      </div>
    </>
  );
};
