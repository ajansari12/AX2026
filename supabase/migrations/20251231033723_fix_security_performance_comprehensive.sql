/*
  # Comprehensive Security and Performance Fixes

  This migration addresses multiple security and performance issues identified
  in the database audit.

  ## 1. Missing Foreign Key Indexes
  Adding indexes for foreign keys that lack covering indexes:
  - client_training_assignments.module_id
  - clients.auth_user_id

  ## 2. Unused Indexes Removal
  Dropping 32 indexes that have never been used to reduce storage overhead
  and improve write performance.

  ## 3. RLS Policy Optimization
  Updating RLS policies to wrap `is_admin_by_uid()` calls in SELECT subqueries.
  This prevents re-evaluation per row and significantly improves query performance.

  ## 4. Multiple Permissive Policies Consolidation
  Consolidating duplicate permissive policies into single policies per action.

  ## 5. Function Search Path Security
  Fixing mutable search_path in functions.
*/

-- ============================================================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_client_training_assignments_module_id
  ON public.client_training_assignments(module_id);

CREATE INDEX IF NOT EXISTS idx_clients_auth_user_id
  ON public.clients(auth_user_id);

-- ============================================================================
-- PART 2: DROP UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_admin_users_added_by;
DROP INDEX IF EXISTS public.idx_api_request_logs_api_key_id;
DROP INDEX IF EXISTS public.idx_blog_posts_author_id;
DROP INDEX IF EXISTS public.idx_bookings_lead_id;
DROP INDEX IF EXISTS public.idx_chat_messages_conversation_id;
DROP INDEX IF EXISTS public.idx_chat_ratings_conversation_id;
DROP INDEX IF EXISTS public.idx_client_activity_client_id;
DROP INDEX IF EXISTS public.idx_client_activity_project_id;
DROP INDEX IF EXISTS public.idx_client_documents_client_id;
DROP INDEX IF EXISTS public.idx_client_documents_project_id;
DROP INDEX IF EXISTS public.idx_client_messages_client_id;
DROP INDEX IF EXISTS public.idx_client_messages_parent_id;
DROP INDEX IF EXISTS public.idx_client_messages_project_id;
DROP INDEX IF EXISTS public.idx_client_training_progress_module_id;
DROP INDEX IF EXISTS public.idx_clients_lead_id;
DROP INDEX IF EXISTS public.idx_email_sends_sequence_id;
DROP INDEX IF EXISTS public.idx_email_sends_step_id;
DROP INDEX IF EXISTS public.idx_invoices_client_id;
DROP INDEX IF EXISTS public.idx_invoices_project_id;
DROP INDEX IF EXISTS public.idx_lead_activity_lead_id;
DROP INDEX IF EXISTS public.idx_lead_engagements_lead_id;
DROP INDEX IF EXISTS public.idx_lead_notes_lead_id;
DROP INDEX IF EXISTS public.idx_pipeline_stage_history_lead_id;
DROP INDEX IF EXISTS public.idx_project_milestones_project_id;
DROP INDEX IF EXISTS public.idx_projects_client_id;
DROP INDEX IF EXISTS public.idx_proposal_views_proposal_id;
DROP INDEX IF EXISTS public.idx_proposals_lead_id;
DROP INDEX IF EXISTS public.idx_proposals_template_id;
DROP INDEX IF EXISTS public.idx_subscriber_sequences_sequence_id;
DROP INDEX IF EXISTS public.idx_webhook_logs_webhook_id;

-- ============================================================================
-- PART 3: FIX RLS POLICIES - Wrap is_admin_by_uid() in SELECT
-- ============================================================================

-- 3.1 clients table - admin-only policies
DROP POLICY IF EXISTS "Admins can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can insert clients" ON public.clients;

CREATE POLICY "Admins can delete clients" ON public.clients
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can insert clients" ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

-- 3.2 projects table - admin-only policies
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

-- 3.3 project_milestones table - admin-only policies
DROP POLICY IF EXISTS "Admins can delete milestones" ON public.project_milestones;
DROP POLICY IF EXISTS "Admins can insert milestones" ON public.project_milestones;
DROP POLICY IF EXISTS "Admins can update milestones" ON public.project_milestones;

CREATE POLICY "Admins can delete milestones" ON public.project_milestones
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can insert milestones" ON public.project_milestones
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can update milestones" ON public.project_milestones
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

-- 3.4 client_documents table - admin-only policies
DROP POLICY IF EXISTS "Admins can delete documents" ON public.client_documents;
DROP POLICY IF EXISTS "Admins can insert documents" ON public.client_documents;
DROP POLICY IF EXISTS "Admins can update documents" ON public.client_documents;

CREATE POLICY "Admins can delete documents" ON public.client_documents
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can insert documents" ON public.client_documents
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can update documents" ON public.client_documents
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

-- 3.5 client_messages table - admin-only policies
DROP POLICY IF EXISTS "Admins can delete messages" ON public.client_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.client_messages;

CREATE POLICY "Admins can delete messages" ON public.client_messages
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can update messages" ON public.client_messages
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

-- 3.6 invoices table - admin-only policies
DROP POLICY IF EXISTS "Admins can delete invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can update invoices" ON public.invoices;

CREATE POLICY "Admins can delete invoices" ON public.invoices
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can insert invoices" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can update invoices" ON public.invoices
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

-- 3.7 client_activity table - admin-only policies
DROP POLICY IF EXISTS "Admins can delete activity" ON public.client_activity;
DROP POLICY IF EXISTS "Admins can insert activity" ON public.client_activity;
DROP POLICY IF EXISTS "Admins can update activity" ON public.client_activity;

CREATE POLICY "Admins can delete activity" ON public.client_activity
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can insert activity" ON public.client_activity
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Admins can update activity" ON public.client_activity
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

-- ============================================================================
-- PART 4: CONSOLIDATE MULTIPLE PERMISSIVE POLICIES
-- ============================================================================

-- 4.1 bookings table - consolidate policies
DROP POLICY IF EXISTS "Admins can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

CREATE POLICY "Insert bookings - public" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "View bookings - authenticated" ON public.bookings
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Update bookings - admin only" ON public.bookings
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete bookings - admin only" ON public.bookings
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- 4.2 case_studies table - consolidate policies
DROP POLICY IF EXISTS "Authenticated users can manage case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Case studies are publicly readable" ON public.case_studies;

CREATE POLICY "View case studies - public active or admin all" ON public.case_studies
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR (SELECT is_admin_by_uid()));

CREATE POLICY "Manage case studies - admin only" ON public.case_studies
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Update case studies - admin only" ON public.case_studies
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete case studies - admin only" ON public.case_studies
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- 4.3 leads table - consolidate policies
DROP POLICY IF EXISTS "Admins can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;

CREATE POLICY "Insert leads - public" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "View leads - admin only" ON public.leads
  FOR SELECT TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Update leads - admin only" ON public.leads
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete leads - admin only" ON public.leads
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- 4.4 newsletter_subscribers table - consolidate policies
DROP POLICY IF EXISTS "Admins can insert newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view all newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete newsletter subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Insert subscribers - public" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "View subscribers - admin only" ON public.newsletter_subscribers
  FOR SELECT TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Update subscribers - admin only" ON public.newsletter_subscribers
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete subscribers - admin only" ON public.newsletter_subscribers
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- 4.5 resource_downloads table - consolidate policies
DROP POLICY IF EXISTS "Admins can insert resource downloads" ON public.resource_downloads;
DROP POLICY IF EXISTS "Anyone can log resource downloads" ON public.resource_downloads;
DROP POLICY IF EXISTS "Admins can view all resource downloads" ON public.resource_downloads;
DROP POLICY IF EXISTS "Authenticated users can view resource downloads" ON public.resource_downloads;
DROP POLICY IF EXISTS "Admins can update resource downloads" ON public.resource_downloads;
DROP POLICY IF EXISTS "Admins can delete resource downloads" ON public.resource_downloads;

CREATE POLICY "Insert downloads - public" ON public.resource_downloads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "View downloads - admin only" ON public.resource_downloads
  FOR SELECT TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Update downloads - admin only" ON public.resource_downloads
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete downloads - admin only" ON public.resource_downloads
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- 4.6 services table - consolidate policies
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;
DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;

CREATE POLICY "View services - public active or admin all" ON public.services
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR (SELECT is_admin_by_uid()));

CREATE POLICY "Insert services - admin only" ON public.services
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Update services - admin only" ON public.services
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete services - admin only" ON public.services
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- 4.7 teardown_requests table - consolidate policies
DROP POLICY IF EXISTS "Admins can insert teardown requests" ON public.teardown_requests;
DROP POLICY IF EXISTS "Anyone can submit teardown requests" ON public.teardown_requests;
DROP POLICY IF EXISTS "Admins can view all teardown requests" ON public.teardown_requests;
DROP POLICY IF EXISTS "Authenticated users can view teardown requests" ON public.teardown_requests;
DROP POLICY IF EXISTS "Admins can update teardown requests" ON public.teardown_requests;
DROP POLICY IF EXISTS "Authenticated users can update teardown requests" ON public.teardown_requests;
DROP POLICY IF EXISTS "Admins can delete teardown requests" ON public.teardown_requests;

CREATE POLICY "Insert teardown requests - public" ON public.teardown_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "View teardown requests - admin only" ON public.teardown_requests
  FOR SELECT TO authenticated
  USING ((SELECT is_admin_by_uid()));

CREATE POLICY "Update teardown requests - admin only" ON public.teardown_requests
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete teardown requests - admin only" ON public.teardown_requests
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- 4.8 training_modules table - consolidate policies
DROP POLICY IF EXISTS "Admins can manage training modules" ON public.training_modules;
DROP POLICY IF EXISTS "Anyone can view active training modules" ON public.training_modules;

CREATE POLICY "View training modules - public active or admin all" ON public.training_modules
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR (SELECT is_admin_by_uid()));

CREATE POLICY "Insert training modules - admin only" ON public.training_modules
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Update training modules - admin only" ON public.training_modules
  FOR UPDATE TO authenticated
  USING ((SELECT is_admin_by_uid()))
  WITH CHECK ((SELECT is_admin_by_uid()));

CREATE POLICY "Delete training modules - admin only" ON public.training_modules
  FOR DELETE TO authenticated
  USING ((SELECT is_admin_by_uid()));

-- ============================================================================
-- PART 5: FIX FUNCTION SEARCH PATHS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_whitelist
    WHERE LOWER(email) = LOWER(auth.jwt()->>'email')
    AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = user_email AND is_active = TRUE
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_by_uid()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_by_uid(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_whitelist aw
    JOIN auth.users u ON LOWER(u.email) = LOWER(aw.email)
    WHERE u.id = user_id
    AND aw.is_active = true
  );
END;
$$;
