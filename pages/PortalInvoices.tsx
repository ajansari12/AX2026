import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FolderOpen,
  X,
  DollarSign,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useClientInvoices, Invoice } from '../hooks/useClientPortal';

type InvoiceFilter = 'all' | 'pending' | 'paid';

export const PortalInvoices: React.FC = () => {
  const { invoices, isLoading, markAsViewed, pendingInvoices, paidInvoices, totalOutstanding, totalPaid } = useClientInvoices();
  const [filter, setFilter] = useState<InvoiceFilter>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Mark invoice as viewed when selected
  useEffect(() => {
    if (selectedInvoice && !selectedInvoice.viewed_at) {
      markAsViewed(selectedInvoice.id);
    }
  }, [selectedInvoice, markAsViewed]);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['sent', 'viewed', 'overdue'].includes(invoice.status);
    if (filter === 'paid') return invoice.status === 'paid';
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get status color and label
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      draft: {
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        label: 'Draft',
        icon: <Clock size={14} />,
      },
      sent: {
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        label: 'Sent',
        icon: <Clock size={14} />,
      },
      viewed: {
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        label: 'Viewed',
        icon: <Clock size={14} />,
      },
      paid: {
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        label: 'Paid',
        icon: <CheckCircle2 size={14} />,
      },
      overdue: {
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        label: 'Overdue',
        icon: <AlertCircle size={14} />,
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        label: 'Cancelled',
        icon: <X size={14} />,
      },
      refunded: {
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        label: 'Refunded',
        icon: <DollarSign size={14} />,
      },
    };
    return statusMap[status] || statusMap.draft;
  };

  // Handle pay invoice
  const handlePay = (invoice: Invoice) => {
    if (invoice.stripe_payment_url) {
      window.open(invoice.stripe_payment_url, '_blank');
    }
  };

  return (
    <>
      <SEO
        title="Invoices | Client Portal"
        description="View and pay your invoices."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white"
          >
            <h1 className="text-2xl font-bold mb-2">Invoices</h1>
            <p className="text-gray-300">View and manage your billing history</p>

            {totalOutstanding > 0 && (
              <div className="mt-4 flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-amber-100 text-sm">
                  Outstanding balance: <strong>{formatCurrency(totalOutstanding)}</strong>
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Paid</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalPaid)}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {paidInvoices.length} invoice{paidInvoices.length !== 1 ? 's' : ''} paid
            </div>
          </motion.div>
        </div>

        {/* Filter tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
          {(['all', 'pending', 'paid'] as const).map((tab) => {
            const counts = {
              all: invoices.length,
              pending: pendingInvoices.length,
              paid: paidInvoices.length,
            };
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                  filter === tab
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
                <span className="ml-1.5 opacity-60">({counts[tab]})</span>
              </button>
            );
          })}
        </div>

        {/* Invoices list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24" />
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center"
          >
            <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No invoices found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all'
                ? "You don't have any invoices yet."
                : `No ${filter} invoices.`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredInvoices.map((invoice, index) => {
                const statusInfo = getStatusInfo(invoice.status);
                const isPayable = ['sent', 'viewed', 'overdue'].includes(invoice.status) && invoice.stripe_payment_url;

                return (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Invoice info */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Receipt className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {invoice.invoice_number}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                            </div>
                            {invoice.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {invoice.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {invoice.project && (
                                <span className="flex items-center gap-1.5">
                                  <FolderOpen size={14} />
                                  {invoice.project.name}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(invoice.created_at).toLocaleDateString()}
                              </span>
                              {invoice.due_date && (
                                <span className={`flex items-center gap-1.5 ${
                                  invoice.status === 'overdue' ? 'text-red-500' : ''
                                }`}>
                                  <Clock size={14} />
                                  Due: {new Date(invoice.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Amount and actions */}
                        <div className="flex items-center gap-4 ml-16 md:ml-0">
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(invoice.total_amount, invoice.currency)}
                            </p>
                            {invoice.tax_amount > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Includes {formatCurrency(invoice.tax_amount, invoice.currency)} tax
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                              title="View details"
                            >
                              <ExternalLink size={18} />
                            </button>
                            {isPayable && (
                              <button
                                onClick={() => handlePay(invoice)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                              >
                                <CreditCard size={18} />
                                <span>Pay Now</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Paid indicator */}
                    {invoice.paid_at && (
                      <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/10 border-t border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 size={16} />
                        <span>Paid on {new Date(invoice.paid_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Invoice detail modal */}
        <AnimatePresence>
          {selectedInvoice && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedInvoice(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Invoice {selectedInvoice.invoice_number}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const statusInfo = getStatusInfo(selectedInvoice.status);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Invoice Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedInvoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedInvoice.due_date && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Due Date</p>
                        <p className={`font-medium ${
                          selectedInvoice.status === 'overdue'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {new Date(selectedInvoice.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project */}
                  {selectedInvoice.project && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FolderOpen size={16} />
                      <span>Project: {selectedInvoice.project.name}</span>
                    </div>
                  )}

                  {/* Description */}
                  {selectedInvoice.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedInvoice.description}
                      </p>
                    </div>
                  )}

                  {/* Line items */}
                  {selectedInvoice.line_items && selectedInvoice.line_items.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Line Items
                      </h3>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Item
                              </th>
                              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Qty
                              </th>
                              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Price
                              </th>
                              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {selectedInvoice.line_items.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                  {item.description || item.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right">
                                  {item.quantity || 1}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right">
                                  {formatCurrency(item.unit_price || item.price, selectedInvoice.currency)}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                                  {formatCurrency((item.quantity || 1) * (item.unit_price || item.price), selectedInvoice.currency)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                      </span>
                    </div>
                    {selectedInvoice.tax_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Tax</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatCurrency(selectedInvoice.tax_amount, selectedInvoice.currency)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrency(selectedInvoice.total_amount, selectedInvoice.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedInvoice.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedInvoice.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  {['sent', 'viewed', 'overdue'].includes(selectedInvoice.status) && selectedInvoice.stripe_payment_url && (
                    <button
                      onClick={() => handlePay(selectedInvoice)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                    >
                      <CreditCard size={18} />
                      <span>Pay {formatCurrency(selectedInvoice.total_amount, selectedInvoice.currency)}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
