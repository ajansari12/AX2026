/*
  # Optimize RLS Policies with Auth Function Calls

  1. Performance Improvements
    - Replaces auth.uid() with (select auth.uid()) in RLS policies
    - This prevents re-evaluation of auth functions for each row
    - Significant performance improvement at scale

  2. Policies Updated
    - client_training_progress: Clients can modify own progress, update own progress, view own progress
    - client_training_assignments: Clients can view own assignments
    - client_documents: Clients can view own documents
    - clients: Clients can update own profile, view own profile
    - projects: Clients can view own projects
    - project_milestones: Clients can view own milestones
    - client_messages: Clients can send messages, view own messages
    - client_activity: Clients can view own activity
    - invoices: Clients can view own invoices

  3. Notes
    - Each policy is dropped and recreated with the optimized auth function call
    - No changes to policy logic, only performance optimization
*/

-- client_training_progress policies
DROP POLICY IF EXISTS "Clients can modify own progress" ON client_training_progress;
CREATE POLICY "Clients can modify own progress" ON client_training_progress
  FOR UPDATE TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

DROP POLICY IF EXISTS "Clients can update own progress" ON client_training_progress;
CREATE POLICY "Clients can update own progress" ON client_training_progress
  FOR INSERT TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

DROP POLICY IF EXISTS "Clients can view own progress" ON client_training_progress;
CREATE POLICY "Clients can view own progress" ON client_training_progress
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- client_training_assignments policies
DROP POLICY IF EXISTS "Clients can view own assignments" ON client_training_assignments;
CREATE POLICY "Clients can view own assignments" ON client_training_assignments
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- client_documents policies
DROP POLICY IF EXISTS "Clients can view own documents" ON client_documents;
CREATE POLICY "Clients can view own documents" ON client_documents
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- clients policies
DROP POLICY IF EXISTS "Clients can update own profile" ON clients;
CREATE POLICY "Clients can update own profile" ON clients
  FOR UPDATE TO authenticated
  USING (
    LOWER(email) = LOWER((select auth.jwt()->>'email'))
  )
  WITH CHECK (
    LOWER(email) = LOWER((select auth.jwt()->>'email'))
  );

DROP POLICY IF EXISTS "Clients can view own profile" ON clients;
CREATE POLICY "Clients can view own profile" ON clients
  FOR SELECT TO authenticated
  USING (
    LOWER(email) = LOWER((select auth.jwt()->>'email'))
  );

-- projects policies
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
CREATE POLICY "Clients can view own projects" ON projects
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- project_milestones policies
DROP POLICY IF EXISTS "Clients can view own milestones" ON project_milestones;
CREATE POLICY "Clients can view own milestones" ON project_milestones
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE client_id IN (
        SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
      )
    )
  );

-- client_messages policies
DROP POLICY IF EXISTS "Clients can send messages" ON client_messages;
CREATE POLICY "Clients can send messages" ON client_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

DROP POLICY IF EXISTS "Clients can view own messages" ON client_messages;
CREATE POLICY "Clients can view own messages" ON client_messages
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- client_activity policies
DROP POLICY IF EXISTS "Clients can view own activity" ON client_activity;
CREATE POLICY "Clients can view own activity" ON client_activity
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );

-- invoices policies
DROP POLICY IF EXISTS "Clients can view own invoices" ON invoices;
CREATE POLICY "Clients can view own invoices" ON invoices
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE LOWER(email) = LOWER((select auth.jwt()->>'email'))
    )
  );
