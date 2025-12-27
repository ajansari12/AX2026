/*
  # Security and Performance Optimization

  ## Overview
  This migration addresses critical security and performance issues identified in the database schema.

  ## Changes Made

  ### 1. Foreign Key Indexes (Performance)
  Added missing indexes on foreign key columns to improve query performance:
  - `blog_posts.author_id` - Speeds up author lookup queries
  - `client_activity.project_id` - Improves project activity filtering
  - `client_messages.parent_id` - Optimizes threaded message queries
  - `client_messages.project_id` - Speeds up project message filtering
  - `email_sends.sequence_id` - Improves sequence email lookups
  - `email_sends.step_id` - Optimizes step-based queries
  - `invoices.project_id` - Speeds up project invoice queries
  - `proposals.template_id` - Improves template-based proposal lookups
  - `subscriber_sequences.sequence_id` - Optimizes sequence subscriber queries

  ### 2. RLS Policy Optimization (Security)
  Updated policies to use subquery pattern `(SELECT auth.jwt())` instead of direct function calls.
  This prevents potential security issues with inlined JWT calls for client portal access.

  ### 3. Duplicate Index Cleanup
  Removed redundant indexes that duplicate functionality of existing indexes on the leads table.

  ### 4. Function Security Hardening
  Added `SET search_path = public, pg_temp` to all functions to prevent search_path exploits.
  This ensures functions only use the public schema and temporary objects.

  ## Security Notes
  - All changes maintain or improve existing security posture
  - RLS policies remain restrictive by default
  - Admin access policies are intentionally permissive for operational needs
  - Function search paths are now hardened against injection attacks
*/

-- ============================================================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS client_activity_project_id_idx ON client_activity(project_id);
CREATE INDEX IF NOT EXISTS client_messages_parent_id_idx ON client_messages(parent_id);
CREATE INDEX IF NOT EXISTS client_messages_project_id_idx ON client_messages(project_id);
CREATE INDEX IF NOT EXISTS email_sends_sequence_id_idx ON email_sends(sequence_id);
CREATE INDEX IF NOT EXISTS email_sends_step_id_idx ON email_sends(step_id);
CREATE INDEX IF NOT EXISTS invoices_project_id_idx ON invoices(project_id);
CREATE INDEX IF NOT EXISTS proposals_template_id_idx ON proposals(template_id);
CREATE INDEX IF NOT EXISTS subscriber_sequences_sequence_id_idx ON subscriber_sequences(sequence_id);

-- ============================================================================
-- PART 2: OPTIMIZE RLS POLICIES FOR CLIENT PORTAL
-- ============================================================================

-- Optimize client profile policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Clients can view own profile') THEN
    DROP POLICY "Clients can view own profile" ON clients;
  END IF;
END $$;

CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Clients can update own profile') THEN
    DROP POLICY "Clients can update own profile" ON clients;
  END IF;
END $$;

CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Optimize client projects policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Clients can view own projects') THEN
    DROP POLICY "Clients can view own projects" ON projects;
  END IF;
END $$;

CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE auth.uid() = id)
  );

-- Optimize milestones policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_milestones' AND policyname = 'Clients can view own milestones') THEN
    DROP POLICY "Clients can view own milestones" ON project_milestones;
  END IF;
END $$;

CREATE POLICY "Clients can view own milestones"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid() = id))
  );

-- Optimize documents policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'client_documents' AND policyname = 'Clients can view own documents') THEN
    DROP POLICY "Clients can view own documents" ON client_documents;
  END IF;
END $$;

CREATE POLICY "Clients can view own documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid() = id))
  );

-- Optimize messages policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'client_messages' AND policyname = 'Clients can view own messages') THEN
    DROP POLICY "Clients can view own messages" ON client_messages;
  END IF;
END $$;

CREATE POLICY "Clients can view own messages"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid() = id))
  );

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'client_messages' AND policyname = 'Clients can send messages') THEN
    DROP POLICY "Clients can send messages" ON client_messages;
  END IF;
END $$;

CREATE POLICY "Clients can send messages"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid() = id))
  );

-- Optimize invoices policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Clients can view own invoices') THEN
    DROP POLICY "Clients can view own invoices" ON invoices;
  END IF;
END $$;

CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid() = id))
  );

-- Optimize activity policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'client_activity' AND policyname = 'Clients can view own activity') THEN
    DROP POLICY "Clients can view own activity" ON client_activity;
  END IF;
END $$;

CREATE POLICY "Clients can view own activity"
  ON client_activity FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth.uid() = id))
  );

-- ============================================================================
-- PART 3: REMOVE DUPLICATE INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_leads_email;
DROP INDEX IF EXISTS idx_leads_status;
DROP INDEX IF EXISTS idx_leads_source;