import React from 'react';
import { FileText, MessageSquare, CreditCard, Folder, Search, Calendar, Bell, Users } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
    {icon && (
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

export const EmptyProjects: React.FC<{ onAction?: () => void }> = ({ onAction }) => (
  <EmptyState
    icon={<Folder className="w-8 h-8 text-gray-400" />}
    title="No projects yet"
    description="Your active projects will appear here once they're created. Contact us to get started on your first project."
    action={onAction ? { label: 'Contact Us', onClick: onAction } : undefined}
  />
);

export const EmptyDocuments: React.FC = () => (
  <EmptyState
    icon={<FileText className="w-8 h-8 text-gray-400" />}
    title="No documents"
    description="Project documents, contracts, and deliverables will appear here as they become available."
  />
);

export const EmptyMessages: React.FC<{ onAction?: () => void }> = ({ onAction }) => (
  <EmptyState
    icon={<MessageSquare className="w-8 h-8 text-gray-400" />}
    title="No messages"
    description="Start a conversation with our team. We're here to help with any questions about your project."
    action={onAction ? { label: 'Send Message', onClick: onAction } : undefined}
  />
);

export const EmptyInvoices: React.FC = () => (
  <EmptyState
    icon={<CreditCard className="w-8 h-8 text-gray-400" />}
    title="No invoices"
    description="Your invoices and payment history will appear here. All caught up!"
  />
);

export const EmptySearchResults: React.FC<{ query?: string }> = ({ query }) => (
  <EmptyState
    icon={<Search className="w-8 h-8 text-gray-400" />}
    title="No results found"
    description={query ? `We couldn't find anything matching "${query}". Try a different search term.` : 'Try adjusting your search or filters.'}
  />
);

export const EmptyActivity: React.FC = () => (
  <EmptyState
    icon={<Calendar className="w-8 h-8 text-gray-400" />}
    title="No recent activity"
    description="Activity from your projects will appear here as work progresses."
  />
);

export const EmptyNotifications: React.FC = () => (
  <EmptyState
    icon={<Bell className="w-8 h-8 text-gray-400" />}
    title="All caught up"
    description="You have no new notifications. We'll let you know when something needs your attention."
  />
);

export const EmptyClients: React.FC<{ onAction?: () => void }> = ({ onAction }) => (
  <EmptyState
    icon={<Users className="w-8 h-8 text-gray-400" />}
    title="No clients yet"
    description="Client accounts will appear here as they're created."
    action={onAction ? { label: 'Add Client', onClick: onAction } : undefined}
  />
);

export const EmptyTraining: React.FC = () => (
  <EmptyState
    icon={<FileText className="w-8 h-8 text-gray-400" />}
    title="No training materials"
    description="Training videos, documentation, and guides will appear here as they're created for your systems."
  />
);
