/*
  # Fix Client Portal RLS Policies

  1. Problem
    - Client RLS policies were incorrectly using `auth.uid() = clients.id`
    - This compares Supabase Auth UUID with clients table UUID (different values)
    - Clients cannot access their own data because UUIDs never match

  2. Solution
    - Drop incorrect policies that use UID comparison
    - Recreate policies using email-based comparison: `auth.jwt() ->> 'email' = clients.email`
    - Update all related table policies (projects, milestones, documents, messages, invoices, activity)

  3. Security
    - Email-based RLS ensures clients can only access data associated with their email
    - Admin policies remain unchanged (using is_admin_by_uid())
    - All policies remain restrictive and secure
*/

-- ============================================
-- DROP INCORRECT CLIENT POLICIES
-- ============================================

DROP POLICY IF EXISTS "Clients can view own profile" ON clients;
DROP POLICY IF EXISTS "Clients can update own profile" ON clients;
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
DROP POLICY IF EXISTS "Clients can view own milestones" ON project_milestones;
DROP POLICY IF EXISTS "Clients can view own documents" ON client_documents;
DROP POLICY IF EXISTS "Clients can view own messages" ON client_messages;
DROP POLICY IF EXISTS "Clients can send messages" ON client_messages;
DROP POLICY IF EXISTS "Clients can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Clients can view own activity" ON client_activity;

-- ============================================
-- CREATE CORRECTED CLIENT POLICIES
-- ============================================

-- CLIENTS TABLE: Use email from JWT to match client record
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- PROJECTS TABLE: Clients can view projects where they are the client
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  );

-- PROJECT MILESTONES TABLE: Clients can view milestones for their projects
CREATE POLICY "Clients can view own milestones"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN clients c ON p.client_id = c.id
      WHERE c.email = auth.jwt() ->> 'email'
    )
  );

-- CLIENT DOCUMENTS TABLE: Clients can view their own documents
CREATE POLICY "Clients can view own documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  );

-- CLIENT MESSAGES TABLE: Clients can view and send their own messages
CREATE POLICY "Clients can view own messages"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Clients can send messages"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
    AND sender_type = 'client'
    AND sender_email = auth.jwt() ->> 'email'
  );

-- INVOICES TABLE: Clients can view their own invoices
CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  );

-- CLIENT ACTIVITY TABLE: Clients can view their own activity
CREATE POLICY "Clients can view own activity"
  ON client_activity FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  );
