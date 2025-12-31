/*
  # Consolidate RLS Policies - Admin/Client Access Pattern

  1. Purpose
    - Eliminate "Multiple Permissive Policies" warnings by consolidating separate admin and client
      policies into single unified policies
    - Fix security issues in training tables that use USING (true) for admin access
    - Maintain same behavior: Admins see ALL records, Clients see only THEIR OWN records

  2. Tables Affected
    - clients: Consolidated SELECT, kept separate UPDATE
    - projects: Consolidated SELECT
    - project_milestones: Consolidated SELECT
    - client_documents: Consolidated SELECT
    - client_messages: Consolidated SELECT, INSERT
    - invoices: Consolidated SELECT
    - client_activity: Consolidated SELECT
    - client_training_assignments: Consolidated SELECT, fixed admin security
    - client_training_progress: Consolidated SELECT/INSERT/UPDATE, fixed admin security
    - training_modules: Fixed overly permissive admin policy

  3. Security Pattern
    - Single policy per action using: is_admin_by_uid() OR client_ownership_check
    - Admins (whitelisted in admin_users) can access all records
    - Clients can only access records matching their email

  4. Notes
    - No data changes, only policy restructuring
    - All policies remain restrictive and secure
*/

-- ============================================
-- CLIENTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Clients can view own profile" ON clients;

CREATE POLICY "View clients - admin all or client own"
  ON clients FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR LOWER(email) = LOWER((select auth.jwt()->>'email'))
  );

-- Keep separate admin policies for INSERT/UPDATE/DELETE (clients don't need these)
-- Admin UPDATE policy already exists, client UPDATE policy needs consolidation

DROP POLICY IF EXISTS "Admins can update clients" ON clients;
DROP POLICY IF EXISTS "Clients can update own profile" ON clients;

CREATE POLICY "Update clients - admin all or client own"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR LOWER(email) = LOWER((select auth.jwt()->>'email'))
  )
  WITH CHECK (
    (select is_admin_by_uid())
    OR LOWER(email) = LOWER((select auth.jwt()->>'email'))
  );

-- ============================================
-- PROJECTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;

CREATE POLICY "View projects - admin all or client own"
  ON projects FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- ============================================
-- PROJECT MILESTONES TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can view all milestones" ON project_milestones;
DROP POLICY IF EXISTS "Clients can view own milestones" ON project_milestones;

CREATE POLICY "View milestones - admin all or client own"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN clients c ON p.client_id = c.id
      WHERE LOWER(c.email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- ============================================
-- CLIENT DOCUMENTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can view all documents" ON client_documents;
DROP POLICY IF EXISTS "Clients can view own documents" ON client_documents;

CREATE POLICY "View documents - admin all or client own"
  ON client_documents FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- ============================================
-- CLIENT MESSAGES TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can view all messages" ON client_messages;
DROP POLICY IF EXISTS "Clients can view own messages" ON client_messages;

CREATE POLICY "View messages - admin all or client own"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

DROP POLICY IF EXISTS "Admins can insert messages" ON client_messages;
DROP POLICY IF EXISTS "Clients can send messages" ON client_messages;

CREATE POLICY "Insert messages - admin all or client own"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    (select is_admin_by_uid())
    OR (
      client_id IN (
        SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
      )
      AND sender_type = 'client'
      AND sender_email = (select auth.jwt()->>'email')
    )
  );

-- ============================================
-- INVOICES TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can view all invoices" ON invoices;
DROP POLICY IF EXISTS "Clients can view own invoices" ON invoices;

CREATE POLICY "View invoices - admin all or client own"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- ============================================
-- CLIENT ACTIVITY TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can view all activity" ON client_activity;
DROP POLICY IF EXISTS "Clients can view own activity" ON client_activity;

CREATE POLICY "View activity - admin all or client own"
  ON client_activity FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- ============================================
-- TRAINING MODULES TABLE - Fix Security Issue
-- ============================================

DROP POLICY IF EXISTS "Admins full access to training modules" ON training_modules;

CREATE POLICY "Admins can manage training modules"
  ON training_modules FOR ALL
  TO authenticated
  USING ((select is_admin_by_uid()))
  WITH CHECK ((select is_admin_by_uid()));

-- ============================================
-- CLIENT TRAINING ASSIGNMENTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins full access to assignments" ON client_training_assignments;
DROP POLICY IF EXISTS "Clients can view own assignments" ON client_training_assignments;

CREATE POLICY "View assignments - admin all or client own"
  ON client_training_assignments FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

CREATE POLICY "Admins can manage assignments"
  ON client_training_assignments FOR INSERT
  TO authenticated
  WITH CHECK ((select is_admin_by_uid()));

CREATE POLICY "Admins can update assignments"
  ON client_training_assignments FOR UPDATE
  TO authenticated
  USING ((select is_admin_by_uid()))
  WITH CHECK ((select is_admin_by_uid()));

CREATE POLICY "Admins can delete assignments"
  ON client_training_assignments FOR DELETE
  TO authenticated
  USING ((select is_admin_by_uid()));

-- ============================================
-- CLIENT TRAINING PROGRESS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins full access to progress" ON client_training_progress;
DROP POLICY IF EXISTS "Clients can view own progress" ON client_training_progress;
DROP POLICY IF EXISTS "Clients can update own progress" ON client_training_progress;
DROP POLICY IF EXISTS "Clients can modify own progress" ON client_training_progress;

CREATE POLICY "View progress - admin all or client own"
  ON client_training_progress FOR SELECT
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

CREATE POLICY "Insert progress - admin all or client own"
  ON client_training_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

CREATE POLICY "Update progress - admin all or client own"
  ON client_training_progress FOR UPDATE
  TO authenticated
  USING (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  )
  WITH CHECK (
    (select is_admin_by_uid())
    OR client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

CREATE POLICY "Admins can delete progress"
  ON client_training_progress FOR DELETE
  TO authenticated
  USING ((select is_admin_by_uid()));
