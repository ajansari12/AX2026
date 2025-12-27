import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  FileSpreadsheet,
  FileImage,
  File,
  FilePenLine,
  FolderOpen,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useClientDocuments, ClientDocument } from '../hooks/useClientPortal';

type DocumentCategory = 'all' | 'proposal' | 'contract' | 'invoice' | 'asset' | 'training' | 'deliverable' | 'general';

export const PortalDocuments: React.FC = () => {
  const { documents, isLoading, markAsViewed, markAsDownloaded } = useClientDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory>('all');
  const [selectedDoc, setSelectedDoc] = useState<ClientDocument | null>(null);

  // Categories with counts
  const categories: { value: DocumentCategory; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: documents.length },
    { value: 'proposal', label: 'Proposals', count: documents.filter(d => d.category === 'proposal').length },
    { value: 'contract', label: 'Contracts', count: documents.filter(d => d.category === 'contract').length },
    { value: 'invoice', label: 'Invoices', count: documents.filter(d => d.category === 'invoice').length },
    { value: 'deliverable', label: 'Deliverables', count: documents.filter(d => d.category === 'deliverable').length },
    { value: 'asset', label: 'Assets', count: documents.filter(d => d.category === 'asset').length },
    { value: 'training', label: 'Training', count: documents.filter(d => d.category === 'training').length },
    { value: 'general', label: 'General', count: documents.filter(d => d.category === 'general').length },
  ].filter(cat => cat.value === 'all' || cat.count > 0);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = searchQuery
      ? doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get file icon based on type
  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <File className="w-6 h-6" />;
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv'))
      return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
    if (fileType.includes('image')) return <FileImage className="w-6 h-6 text-purple-500" />;
    if (fileType.includes('document') || fileType.includes('word'))
      return <FilePenLine className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle document view
  const handleView = async (doc: ClientDocument) => {
    await markAsViewed(doc.id);
    window.open(doc.file_url, '_blank');
  };

  // Handle document download
  const handleDownload = async (doc: ClientDocument) => {
    await markAsDownloaded(doc.id);

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = doc.file_url;
    link.download = doc.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      proposal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      contract: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      invoice: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      asset: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      training: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      deliverable: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      general: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[category] || colors.general;
  };

  return (
    <>
      <SEO
        title="Documents | Client Portal"
        description="Access your project documents, contracts, and deliverables."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Access your project documents, contracts, and deliverables
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat.value
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
                <span className="ml-1.5 opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Documents grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center"
          >
            <FolderOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No documents found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'Try adjusting your search terms.'
                : "You don't have any documents yet."}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-gray-200 dark:hover:border-gray-700 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </span>
                        {doc.file_size && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(doc.file_size)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {doc.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  {/* Project tag */}
                  {doc.project && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <FolderOpen size={12} />
                      <span>{doc.project.name}</span>
                    </div>
                  )}

                  {/* Status indicators */}
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    {doc.requires_signature && (
                      <span className={`flex items-center gap-1 ${
                        doc.is_signed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {doc.is_signed ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Signed</span>
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            <span>Awaiting signature</span>
                          </>
                        )}
                      </span>
                    )}
                    {doc.viewed_at && (
                      <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Eye size={12} />
                        <span>Viewed</span>
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar size={12} />
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => handleView(doc)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};
