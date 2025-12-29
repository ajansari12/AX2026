/*
  # Update RLS Policies to Use Admin Whitelist

  1. Changes
    - Drop existing overly permissive admin policies that grant access to any authenticated user
    - Create new restrictive admin policies that only grant access to whitelisted admins
    - Apply to all tables: clients, projects, project_milestones, client_documents, client_messages, invoices, client_activity
    - Apply to existing tables: leads, newsletter_subscribers, teardown_requests, resource_downloads, bookings, chat_conversations, chat_messages

  2. Security
    - Only users in the admin_users whitelist (with is_active = TRUE) can access admin data
    - Regular authenticated users without admin access will only see their own data (if applicable)
*/

-- ============================================
-- DROP OLD OVERLY PERMISSIVE ADMIN POLICIES
-- ============================================

-- Client Portal tables
DROP POLICY IF EXISTS "Admins full access to clients" ON clients;
DROP POLICY IF EXISTS "Admins full access to projects" ON projects;
DROP POLICY IF EXISTS "Admins full access to milestones" ON project_milestones;
DROP POLICY IF EXISTS "Admins full access to documents" ON client_documents;
DROP POLICY IF EXISTS "Admins full access to messages" ON client_messages;
DROP POLICY IF EXISTS "Admins full access to invoices" ON invoices;
DROP POLICY IF EXISTS "Admins full access to activity" ON client_activity;

-- ============================================
-- CREATE NEW ADMIN POLICIES WITH WHITELIST CHECK
-- ============================================

-- CLIENTS TABLE
CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- PROJECTS TABLE
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- PROJECT MILESTONES TABLE
CREATE POLICY "Admins can view all milestones"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert milestones"
  ON project_milestones FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update milestones"
  ON project_milestones FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete milestones"
  ON project_milestones FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- CLIENT DOCUMENTS TABLE
CREATE POLICY "Admins can view all documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert documents"
  ON client_documents FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update documents"
  ON client_documents FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete documents"
  ON client_documents FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- CLIENT MESSAGES TABLE
CREATE POLICY "Admins can view all messages"
  ON client_messages FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert messages"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update messages"
  ON client_messages FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete messages"
  ON client_messages FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- INVOICES TABLE
CREATE POLICY "Admins can view all invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- CLIENT ACTIVITY TABLE
CREATE POLICY "Admins can view all activity"
  ON client_activity FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert activity"
  ON client_activity FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update activity"
  ON client_activity FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete activity"
  ON client_activity FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- ============================================
-- ADD ADMIN POLICIES TO EXISTING TABLES
-- ============================================

-- LEADS TABLE
CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- BOOKINGS TABLE
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- NEWSLETTER SUBSCRIBERS TABLE
CREATE POLICY "Admins can view all newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update newsletter subscribers"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete newsletter subscribers"
  ON newsletter_subscribers FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- TEARDOWN REQUESTS TABLE
CREATE POLICY "Admins can view all teardown requests"
  ON teardown_requests FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert teardown requests"
  ON teardown_requests FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update teardown requests"
  ON teardown_requests FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete teardown requests"
  ON teardown_requests FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- RESOURCE DOWNLOADS TABLE
CREATE POLICY "Admins can view all resource downloads"
  ON resource_downloads FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

CREATE POLICY "Admins can insert resource downloads"
  ON resource_downloads FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can update resource downloads"
  ON resource_downloads FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

CREATE POLICY "Admins can delete resource downloads"
  ON resource_downloads FOR DELETE
  TO authenticated
  USING (is_admin_by_uid());

-- CHAT CONVERSATIONS TABLE (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
    EXECUTE 'CREATE POLICY "Admins can view all chat conversations" ON chat_conversations FOR SELECT TO authenticated USING (is_admin_by_uid())';
    EXECUTE 'CREATE POLICY "Admins can insert chat conversations" ON chat_conversations FOR INSERT TO authenticated WITH CHECK (is_admin_by_uid())';
    EXECUTE 'CREATE POLICY "Admins can update chat conversations" ON chat_conversations FOR UPDATE TO authenticated USING (is_admin_by_uid()) WITH CHECK (is_admin_by_uid())';
    EXECUTE 'CREATE POLICY "Admins can delete chat conversations" ON chat_conversations FOR DELETE TO authenticated USING (is_admin_by_uid())';
  END IF;
END $$;

-- CHAT MESSAGES TABLE (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
    EXECUTE 'CREATE POLICY "Admins can view all chat messages" ON chat_messages FOR SELECT TO authenticated USING (is_admin_by_uid())';
    EXECUTE 'CREATE POLICY "Admins can insert chat messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (is_admin_by_uid())';
    EXECUTE 'CREATE POLICY "Admins can update chat messages" ON chat_messages FOR UPDATE TO authenticated USING (is_admin_by_uid()) WITH CHECK (is_admin_by_uid())';
    EXECUTE 'CREATE POLICY "Admins can delete chat messages" ON chat_messages FOR DELETE TO authenticated USING (is_admin_by_uid())';
  END IF;
END $$;
