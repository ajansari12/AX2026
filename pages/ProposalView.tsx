import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';
import {
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Building2,
  Mail,
  Loader2,
  AlertCircle,
  Download,
  ExternalLink,
} from 'lucide-react';

interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface PricingItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  client_company: string | null;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  sections: ProposalSection[];
  pricing_items: PricingItem[];
  total_amount: number;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
}

export const ProposalView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!token) {
        setError('Invalid proposal link');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch proposal by share token
        const { data, error: fetchError } = await supabase
          .from('proposals')
          .select('*')
          .eq('share_token', token)
          .single();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Proposal not found');
          setIsLoading(false);
          return;
        }

        setProposal(data);
        setAccepted(data.status === 'accepted');

        // Record view
        await supabase.from('proposal_views').insert({
          proposal_id: data.id,
          viewed_at: new Date().toISOString(),
          ip_address: null,
          user_agent: navigator.userAgent,
        });

        // Update status to viewed if it was sent
        if (data.status === 'sent') {
          await supabase
            .from('proposals')
            .update({ status: 'viewed', updated_at: new Date().toISOString() })
            .eq('id', data.id);
        }
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError('Failed to load proposal');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, [token]);

  const handleAccept = async () => {
    if (!proposal) return;

    setIsAccepting(true);
    try {
      const { error: updateError } = await supabase
        .from('proposals')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', proposal.id);

      if (updateError) throw updateError;

      setAccepted(true);
      setProposal({ ...proposal, status: 'accepted' });
    } catch (err) {
      console.error('Error accepting proposal:', err);
    } finally {
      setIsAccepting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpired = proposal?.valid_until
    ? new Date(proposal.valid_until) < new Date()
    : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Proposal Not Found'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            This proposal link may have expired or is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <SEO
        title={`Proposal: ${proposal.title}`}
        description={`Business proposal for ${proposal.client_name}`}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white dark:text-gray-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {proposal.title}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Proposal from Axrategy
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              {accepted ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                  <CheckCircle2 size={16} /> Accepted
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm font-bold">
                  <Clock size={16} /> Expired
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold">
                  <Clock size={16} /> Pending
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Building2 size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                  Prepared For
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {proposal.client_name}
                </p>
                {proposal.client_company && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {proposal.client_company}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                  Valid Until
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {proposal.valid_until
                    ? formatDate(proposal.valid_until)
                    : 'No expiration'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <DollarSign size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                  Total Investment
                </p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">
                  {formatCurrency(proposal.total_amount)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        {proposal.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.div>
          ))}

        {/* Pricing */}
        {proposal.pricing_items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Investment Breakdown
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                      Description
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                      Qty
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                      Unit Price
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.pricing_items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 dark:border-gray-800/50"
                    >
                      <td className="py-4 px-4 text-gray-900 dark:text-white">
                        {item.description}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <td
                      colSpan={3}
                      className="py-4 px-4 text-right font-bold text-gray-900 dark:text-white"
                    >
                      Total Investment
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-xl text-gray-900 dark:text-white">
                      {formatCurrency(proposal.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        )}

        {/* Notes */}
        {proposal.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 mb-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              {proposal.notes}
            </p>
          </motion.div>
        )}

        {/* Actions */}
        {!accepted && !isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to proceed?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              By accepting this proposal, you agree to the terms and scope outlined above.
              We'll reach out to discuss next steps and get your project started.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isAccepting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                Accept Proposal
              </button>

              <a
                href={`mailto:hello@axrategy.com?subject=Question about proposal: ${proposal.title}`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Mail size={20} />
                Ask a Question
              </a>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>This proposal was created by Axrategy</p>
          <p className="mt-1">
            Questions? Contact us at{' '}
            <a
              href="mailto:hello@axrategy.com"
              className="text-gray-900 dark:text-white hover:underline"
            >
              hello@axrategy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
