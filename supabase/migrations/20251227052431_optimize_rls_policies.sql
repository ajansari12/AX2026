/*
  # Optimize RLS Policies with Select Wrapper

  ## Overview
  This migration fixes RLS policies that re-evaluate auth.uid() for each row by wrapping
  the function call in a subquery. This ensures the auth function is evaluated once per
  query rather than once per row, significantly improving performance at scale.

  ## Tables Affected
  - clients (view, update policies)
  - projects (view policy)
  - project_milestones (view policy)
  - client_documents (view policy)
  - client_messages (view, insert policies)
  - invoices (view policy)
  - client_activity (view policy)

  ## Security Notes
  - No changes to security posture - same access rules, better performance
  - All policies continue to enforce proper ownership checks
*/

-- ============================================================================
-- CLIENTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own profile" ON clients;
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Clients can update own profile" ON clients;
CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE (select auth.uid()) = id)
  );

-- ============================================================================
-- PROJECT MILESTONES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own milestones" ON project_milestones;
CREATE POLICY "Clients can view own milestones"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id IN (SELECT id FROM clients WHERE (select auth.uid()) = id)
    )
  );

-- ============================================================================
-- CLIENT DOCUMENTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own documents" ON client_documents;
CREATE POLICY "Clients can view own documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id IN (SELECT id FROM clients WHERE (select auth.uid()) = id)
    )
  );

-- ============================================================================
-- CLIENT MESSAGES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own messages" ON client_messages;
CREATE POLICY "Clients can view own messages"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id IN (SELECT id FROM clients WHERE (select auth.uid()) = id)
    )
  );

DROP POLICY IF EXISTS "Clients can send messages" ON client_messages;
CREATE POLICY "Clients can send messages"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id IN (SELECT id FROM clients WHERE (select auth.uid()) = id)
    )
  );

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own invoices" ON invoices;
CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id IN (SELECT id FROM clients WHERE (select auth.uid()) = id)
    )
  );

-- ============================================================================
-- CLIENT ACTIVITY TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own activity" ON client_activity;
CREATE POLICY "Clients can view own activity"
  ON client_activity FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id IN (SELECT id FROM clients WHERE (select auth.uid()) = id)
    )
  );