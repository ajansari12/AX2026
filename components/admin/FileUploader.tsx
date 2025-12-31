import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, FileText, Video, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  storagePath: string;
}

interface FileUploaderProps {
  clientId: string;
  category?: string;
  onUploadComplete: (files: UploadedFile[]) => void;
  onCancel: () => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

interface FileWithProgress {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
  url?: string;
  storagePath?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
];

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.includes('pdf')) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  clientId,
  category = 'general',
  onUploadComplete,
  onCancel,
  maxFiles = 10,
  maxSizeMB = 50,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported: ${file.type}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSizeMB}MB`;
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const remainingSlots = maxFiles - files.length;

    if (fileArray.length > remainingSlots) {
      alert(`You can only upload ${maxFiles} files at a time. ${remainingSlots} slots remaining.`);
      return;
    }

    const newFileItems: FileWithProgress[] = fileArray.map((file) => {
      const error = validateFile(file);
      return {
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        progress: 0,
        status: error ? 'error' : 'pending',
        error,
      };
    });

    setFiles((prev) => [...prev, ...newFileItems]);
  }, [files.length, maxFiles, acceptedTypes, maxSizeMB]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  }, [addFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const uploadFile = async (fileItem: FileWithProgress): Promise<UploadedFile | null> => {
    const { file } = fileItem;
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${clientId}/${category}/${timestamp}-${sanitizedName}`;

    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: 'uploading', progress: 10 } : f
        )
      );

      const { data, error } = await supabase.storage
        .from('client-documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, progress: 80 } : f
        )
      );

      const { data: urlData } = supabase.storage
        .from('client-documents')
        .getPublicUrl(storagePath);

      const signedUrlResult = await supabase.storage
        .from('client-documents')
        .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

      const finalUrl = signedUrlResult.data?.signedUrl || urlData.publicUrl;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: 'complete', progress: 100, url: finalUrl, storagePath }
            : f
        )
      );

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: finalUrl,
        storagePath,
      };
    } catch (err) {
      console.error('Upload error:', err);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
            : f
        )
      );
      return null;
    }
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    const uploadedFiles: UploadedFile[] = [];

    for (const fileItem of pendingFiles) {
      const result = await uploadFile(fileItem);
      if (result) {
        uploadedFiles.push(result);
      }
    }

    setIsUploading(false);

    if (uploadedFiles.length > 0) {
      onUploadComplete(uploadedFiles);
    }
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const completedCount = files.filter((f) => f.status === 'complete').length;
  const hasErrors = files.some((f) => f.status === 'error');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upload Documents
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Drag and drop files or click to browse. Max {maxSizeMB}MB per file.
          </p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              PDF, Word, Images, Videos up to {maxSizeMB}MB
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Files ({files.length}/{maxFiles})
              </h3>
              <AnimatePresence mode="popLayout">
                {files.map((fileItem) => {
                  const FileIcon = getFileIcon(fileItem.file.type);
                  return (
                    <motion.div
                      key={fileItem.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border
                        ${fileItem.status === 'error'
                          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                          : fileItem.status === 'complete'
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-lg
                        ${fileItem.status === 'error'
                          ? 'bg-red-100 dark:bg-red-800'
                          : fileItem.status === 'complete'
                          ? 'bg-green-100 dark:bg-green-800'
                          : 'bg-gray-200 dark:bg-gray-600'
                        }
                      `}>
                        <FileIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {fileItem.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(fileItem.file.size)}
                          </span>
                          {fileItem.status === 'error' && (
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {fileItem.error}
                            </span>
                          )}
                        </div>
                        {fileItem.status === 'uploading' && (
                          <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${fileItem.progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {fileItem.status === 'uploading' && (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        )}
                        {fileItem.status === 'complete' && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        {fileItem.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        {(fileItem.status === 'pending' || fileItem.status === 'error') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(fileItem.id);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {completedCount > 0 && (
                <span className="text-green-600">{completedCount} uploaded</span>
              )}
              {completedCount > 0 && pendingCount > 0 && ' · '}
              {pendingCount > 0 && (
                <span>{pendingCount} ready to upload</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadAll}
                disabled={pendingCount === 0 || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload {pendingCount > 0 ? `(${pendingCount})` : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
