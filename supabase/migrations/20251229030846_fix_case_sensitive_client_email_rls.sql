/*
  # Fix Case-Sensitive Email Comparison in Client RLS Policies

  1. Problem
    - Client RLS policies use case-sensitive email comparison
    - If user signs up with "User@Example.com" but client record has "user@example.com"
    - The RLS policy `auth.jwt() ->> 'email' = email` won't match
    - This causes clients to be redirected back to login even after successful auth

  2. Solution
    - Update all client-related RLS policies to use LOWER() for case-insensitive matching
    - Change `auth.jwt() ->> 'email' = email` to `LOWER(auth.jwt() ->> 'email') = LOWER(email)`

  3. Tables Updated
    - clients
    - projects
    - project_milestones
    - client_documents
    - client_messages
    - invoices
    - client_activity
*/

-- ============================================
-- DROP EXISTING CLIENT POLICIES
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
-- CREATE CASE-INSENSITIVE CLIENT POLICIES
-- ============================================

-- CLIENTS TABLE: Use LOWER() for case-insensitive email matching
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  TO authenticated
  USING (LOWER(auth.jwt() ->> 'email') = LOWER(email));

CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  TO authenticated
  USING (LOWER(auth.jwt() ->> 'email') = LOWER(email))
  WITH CHECK (LOWER(auth.jwt() ->> 'email') = LOWER(email));

-- PROJECTS TABLE: Clients can view projects where they are the client
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
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
      WHERE LOWER(c.email) = LOWER(auth.jwt() ->> 'email')
    )
  );

-- CLIENT DOCUMENTS TABLE: Clients can view their own documents
CREATE POLICY "Clients can view own documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
    )
  );

-- CLIENT MESSAGES TABLE: Clients can view and send their own messages
CREATE POLICY "Clients can view own messages"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Clients can send messages"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
    )
    AND sender_type = 'client'
    AND LOWER(sender_email) = LOWER(auth.jwt() ->> 'email')
  );

-- INVOICES TABLE: Clients can view their own invoices
CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
    )
  );

-- CLIENT ACTIVITY TABLE: Clients can view their own activity
CREATE POLICY "Clients can view own activity"
  ON client_activity FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
    )
  );
