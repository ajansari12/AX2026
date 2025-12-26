import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Tag,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { LeadTimeline } from './LeadTimeline';
import { formatDate, formatSource } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  service_interest: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
  pricing_preference?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'qualified', label: 'Qualified', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onStatusChange,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(lead.status);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await onStatusChange(lead.id, newStatus);
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find(s => s.value === currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lead.name}
              </h2>
              <a
                href={`mailto:${lead.email}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Mail size={14} />
                {lead.email}
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Lead info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                  Status
                </label>
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                    <span className="text-sm text-gray-500">Updating...</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === option.value
                            ? option.color + ' ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-900'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* Service Interest */}
                {lead.service_interest && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                      Service Interest
                    </label>
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {lead.service_interest}
                      </span>
                    </div>
                  </div>
                )}

                {/* Source */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Source
                  </label>
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                    {formatSource(lead.source)}
                  </span>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Created
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(lead.created_at, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Pricing Preference */}
                {lead.pricing_preference && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                      Pricing Preference
                    </label>
                    <span className="text-gray-900 dark:text-white capitalize">
                      {lead.pricing_preference.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {/* UTM Data */}
                {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                      Campaign Data
                    </label>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {lead.utm_source && <p>Source: {lead.utm_source}</p>}
                      {lead.utm_medium && <p>Medium: {lead.utm_medium}</p>}
                      {lead.utm_campaign && <p>Campaign: {lead.utm_campaign}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              {lead.message && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                    Message
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                        {lead.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <Mail size={16} />
                  Send Email
                </a>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(lead.email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink size={16} />
                  Search Online
                </a>
              </div>
            </div>

            {/* Right column - Timeline */}
            <div className="lg:col-span-2">
              <LeadTimeline leadId={lead.id} leadName={lead.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
