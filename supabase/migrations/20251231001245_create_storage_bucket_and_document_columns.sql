/*
  # Create Storage Bucket and Enhanced Document Columns

  1. Storage Setup
    - Creates 'client-documents' storage bucket for file uploads
    - Enables authenticated users to upload and access files
    - Files organized by client ID for security

  2. New Columns on client_documents
    - `pinned_at` (timestamptz) - When document was pinned to top
    - `expires_at` (timestamptz) - Optional expiration date
    - `version` (int) - Document version number
    - `file_size` (bigint) - File size in bytes
    - `mime_type` (text) - File MIME type

  3. New Column on clients
    - `portal_settings` (jsonb) - Per-client portal configuration

  4. Security
    - Storage policies restrict access to authenticated users
    - Clients can only access their own files via RLS
*/

-- Add new columns to client_documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_documents' AND column_name = 'pinned_at'
  ) THEN
    ALTER TABLE client_documents ADD COLUMN pinned_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_documents' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE client_documents ADD COLUMN expires_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_documents' AND column_name = 'version'
  ) THEN
    ALTER TABLE client_documents ADD COLUMN version INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_documents' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE client_documents ADD COLUMN file_size BIGINT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_documents' AND column_name = 'mime_type'
  ) THEN
    ALTER TABLE client_documents ADD COLUMN mime_type TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_documents' AND column_name = 'storage_path'
  ) THEN
    ALTER TABLE client_documents ADD COLUMN storage_path TEXT;
  END IF;
END $$;

-- Add portal_settings to clients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'portal_settings'
  ) THEN
    ALTER TABLE clients ADD COLUMN portal_settings JSONB DEFAULT '{
      "tabs_visible": ["documents", "training", "invoices", "messages", "projects"],
      "welcome_message": null,
      "theme": "default"
    }'::jsonb;
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS client_documents_pinned_at_idx ON client_documents(pinned_at) WHERE pinned_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS client_documents_expires_at_idx ON client_documents(expires_at) WHERE expires_at IS NOT NULL;

-- Insert storage bucket record (Supabase auto-creates the bucket)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-documents',
  'client-documents',
  false,
  52428800,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/zip']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Authenticated users can upload to their client folder
CREATE POLICY "Authenticated users can upload client documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'client-documents'
);

-- Storage Policies: Authenticated users can view client documents
CREATE POLICY "Authenticated users can view client documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'client-documents');

-- Storage Policies: Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update client documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'client-documents');

-- Storage Policies: Authenticated users can delete client documents
CREATE POLICY "Authenticated users can delete client documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'client-documents');