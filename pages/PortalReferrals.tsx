import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Copy, CheckCircle2, Users, DollarSign, Clock, Plus, X, Send } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useClientAuth } from '../hooks/useClientAuth';
import { useReferrals } from '../hooks/useReferrals';

export const PortalReferrals: React.FC = () => {
  const { client } = useClientAuth();
  const { referrals, isLoading, stats, createReferral } = useReferrals(client?.id);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ referred_name: '', referred_email: '', referred_phone: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const referralLink = `https://axrategy.com?ref=${client?.id?.slice(0, 8) || 'unknown'}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    const result = await createReferral(formData);
    setIsSubmitting(false);
    if (result.success) {
      setShowForm(false);
      setFormData({ referred_name: '', referred_email: '', referred_phone: '', notes: '' });
    } else {
      setSubmitError(result.error || 'Failed to submit referral');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      contacted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      declined: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return styles[status] || styles.pending;
  };

  return (
    <>
      <SEO title="Referral Program | Client Portal" description="Earn rewards by referring new clients to Axrategy." />

      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10">
            <Gift className="w-10 h-10 mb-4 opacity-80" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Referral Program</h1>
            <p className="text-emerald-100 max-w-lg mb-6">
              Know someone who could benefit from our services? Refer them and earn rewards when they become a client.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <Plus size={18} /> Refer Someone
              </button>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5">
                <span className="text-sm font-mono truncate max-w-[200px]">{referralLink}</span>
                <button onClick={handleCopy} className="flex-shrink-0 hover:bg-white/20 p-1 rounded-lg transition-colors">
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Referrals', value: stats.total, icon: <Users size={20} />, color: 'bg-blue-500' },
            { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, color: 'bg-amber-500' },
            { label: 'Converted', value: stats.converted, icon: <CheckCircle2 size={20} />, color: 'bg-emerald-500' },
            { label: 'Rewards Earned', value: `$${stats.totalRewards}`, icon: <DollarSign size={20} />, color: 'bg-teal-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Referrals</h2>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              + Add Referral
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-12 text-center">
              <Gift className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No referrals yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Refer someone to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {referrals.map(ref => (
                <div key={ref.id} className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{ref.referred_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{ref.referred_email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusBadge(ref.status)}`}>
                    {ref.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Refer a Friend</h3>
                <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.referred_name}
                    onChange={e => setFormData(d => ({ ...d, referred_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Their full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.referred_email}
                    onChange={e => setFormData(d => ({ ...d, referred_email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="their@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.referred_phone}
                    onChange={e => setFormData(d => ({ ...d, referred_phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="What services might they need?"
                  />
                </div>

                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Submitting...' : 'Submit Referral'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
