/*
  # Optimize RLS Policies - Auth Function Calls

  This migration optimizes RLS policies by wrapping auth.<function>() calls
  with (select auth.<function>()) to prevent re-evaluation for each row.

  ## Tables Updated:
  1. clients - View and Update policies
  2. projects - View policy
  3. project_milestones - View policy
  4. client_documents - View policy
  5. client_messages - View and Insert policies
  6. invoices - View policy
  7. client_activity - View policy
  8. client_training_assignments - View policy
  9. client_training_progress - View, Insert, and Update policies
*/

-- Drop and recreate clients policies
DROP POLICY IF EXISTS "View clients - admin all or client own" ON public.clients;
DROP POLICY IF EXISTS "Update clients - admin all or client own" ON public.clients;

CREATE POLICY "View clients - admin all or client own" ON public.clients
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR lower(email) = lower((select auth.jwt() ->> 'email'))
  );

CREATE POLICY "Update clients - admin all or client own" ON public.clients
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR lower(email) = lower((select auth.jwt() ->> 'email'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR lower(email) = lower((select auth.jwt() ->> 'email'))
  );

-- Drop and recreate projects policies
DROP POLICY IF EXISTS "View projects - admin all or client own" ON public.projects;

CREATE POLICY "View projects - admin all or client own" ON public.projects
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- Drop and recreate project_milestones policies
DROP POLICY IF EXISTS "View milestones - admin all or client own" ON public.project_milestones;

CREATE POLICY "View milestones - admin all or client own" ON public.project_milestones
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR project_id IN (
      SELECT p.id FROM public.projects p
      JOIN public.clients c ON p.client_id = c.id
      WHERE lower(c.email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- Drop and recreate client_documents policies
DROP POLICY IF EXISTS "View documents - admin all or client own" ON public.client_documents;

CREATE POLICY "View documents - admin all or client own" ON public.client_documents
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- Drop and recreate client_messages policies
DROP POLICY IF EXISTS "View messages - admin all or client own" ON public.client_messages;
DROP POLICY IF EXISTS "Insert messages - admin all or client own" ON public.client_messages;

CREATE POLICY "View messages - admin all or client own" ON public.client_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Insert messages - admin all or client own" ON public.client_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- Drop and recreate invoices policies
DROP POLICY IF EXISTS "View invoices - admin all or client own" ON public.invoices;

CREATE POLICY "View invoices - admin all or client own" ON public.invoices
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- Drop and recreate client_activity policies
DROP POLICY IF EXISTS "View activity - admin all or client own" ON public.client_activity;

CREATE POLICY "View activity - admin all or client own" ON public.client_activity
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- Drop and recreate client_training_assignments policies
DROP POLICY IF EXISTS "View assignments - admin all or client own" ON public.client_training_assignments;

CREATE POLICY "View assignments - admin all or client own" ON public.client_training_assignments
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- Drop and recreate client_training_progress policies
DROP POLICY IF EXISTS "View progress - admin all or client own" ON public.client_training_progress;
DROP POLICY IF EXISTS "Insert progress - admin all or client own" ON public.client_training_progress;
DROP POLICY IF EXISTS "Update progress - admin all or client own" ON public.client_training_progress;

CREATE POLICY "View progress - admin all or client own" ON public.client_training_progress
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Insert progress - admin all or client own" ON public.client_training_progress
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Update progress - admin all or client own" ON public.client_training_progress
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
    OR client_id IN (
      SELECT id FROM public.clients WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );