/*
  # Add Missing Foreign Key Indexes and Optimize RLS Policies

  ## 1. Missing Foreign Key Indexes
  - client_training_assignments.module_id
  - clients.auth_user_id

  ## 2. RLS Policy Optimizations
  All admin-only policies updated to use (select auth.jwt()) wrapper
  to prevent per-row re-evaluation.

  ## Tables Updated:
  - authors, blog_posts, lead_notes, lead_activity
  - lead_engagements, lead_scoring_rules, pipeline_stage_history
  - proposal_templates, proposals, clients, projects
  - project_milestones, client_documents, client_messages
  - invoices, client_activity, integrations, webhooks
  - api_keys, email_sequences, email_sequence_steps
  - email_sends, subscriber_sequences, admin_settings
  - client_training_assignments, client_training_progress

  ## Note on "Unused Indexes"
  The foreign key indexes created in the previous migration are reported
  as unused because they are new. They should be kept as they improve
  JOIN performance on foreign key relationships.

  ## Note on "Always True" Public Policies
  Tables like leads, bookings, chat_*, newsletter_subscribers, etc.
  intentionally have open INSERT policies for public form submissions.
  These are by design and should not be restricted.
*/

-- ============================================
-- MISSING FOREIGN KEY INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_client_training_assignments_module_id 
  ON public.client_training_assignments(module_id);

CREATE INDEX IF NOT EXISTS idx_clients_auth_user_id 
  ON public.clients(auth_user_id);

-- ============================================
-- AUTHORS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can insert authors" ON public.authors;
DROP POLICY IF EXISTS "Admin users can update authors" ON public.authors;

CREATE POLICY "Admin users can insert authors" ON public.authors
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

CREATE POLICY "Admin users can update authors" ON public.authors
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- BLOG_POSTS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin users can update blog posts" ON public.blog_posts;

CREATE POLICY "Admin users can delete blog posts" ON public.blog_posts
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

CREATE POLICY "Admin users can insert blog posts" ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

CREATE POLICY "Admin users can update blog posts" ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- LEAD_NOTES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can delete lead notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Admin users can insert lead notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Admin users can update lead notes" ON public.lead_notes;

CREATE POLICY "Admin users can delete lead notes" ON public.lead_notes
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

CREATE POLICY "Admin users can insert lead notes" ON public.lead_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

CREATE POLICY "Admin users can update lead notes" ON public.lead_notes
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- LEAD_ACTIVITY - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can insert lead activity" ON public.lead_activity;

CREATE POLICY "Admin users can insert lead activity" ON public.lead_activity
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- LEAD_ENGAGEMENTS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage lead engagements" ON public.lead_engagements;

CREATE POLICY "Admin users can manage lead engagements" ON public.lead_engagements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- LEAD_SCORING_RULES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage scoring rules" ON public.lead_scoring_rules;

CREATE POLICY "Admin users can manage scoring rules" ON public.lead_scoring_rules
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- PIPELINE_STAGE_HISTORY - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can insert pipeline history" ON public.pipeline_stage_history;

CREATE POLICY "Admin users can insert pipeline history" ON public.pipeline_stage_history
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- PROPOSAL_TEMPLATES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage proposal templates" ON public.proposal_templates;

CREATE POLICY "Admin users can manage proposal templates" ON public.proposal_templates
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- PROPOSALS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage proposals" ON public.proposals;

CREATE POLICY "Admin users can manage proposals" ON public.proposals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- CLIENTS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View clients - admin all or client own" ON public.clients;
DROP POLICY IF EXISTS "Update clients - admin all or client own" ON public.clients;

CREATE POLICY "View clients - admin all or client own" ON public.clients
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR lower(email) = lower((select auth.jwt() ->> 'email'))
  );

CREATE POLICY "Update clients - admin all or client own" ON public.clients
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR lower(email) = lower((select auth.jwt() ->> 'email'))
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR lower(email) = lower((select auth.jwt() ->> 'email'))
  );

-- ============================================
-- PROJECTS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View projects - admin all or client own" ON public.projects;

CREATE POLICY "View projects - admin all or client own" ON public.projects
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- ============================================
-- PROJECT_MILESTONES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View milestones - admin all or client own" ON public.project_milestones;

CREATE POLICY "View milestones - admin all or client own" ON public.project_milestones
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR project_id IN (
      SELECT p.id FROM public.projects p
      JOIN public.clients c ON p.client_id = c.id
      WHERE lower(c.email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- ============================================
-- CLIENT_DOCUMENTS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View documents - admin all or client own" ON public.client_documents;

CREATE POLICY "View documents - admin all or client own" ON public.client_documents
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- ============================================
-- CLIENT_MESSAGES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View messages - admin all or client own" ON public.client_messages;
DROP POLICY IF EXISTS "Insert messages - admin all or client own" ON public.client_messages;

CREATE POLICY "View messages - admin all or client own" ON public.client_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Insert messages - admin all or client own" ON public.client_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- ============================================
-- INVOICES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View invoices - admin all or client own" ON public.invoices;

CREATE POLICY "View invoices - admin all or client own" ON public.invoices
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- ============================================
-- CLIENT_ACTIVITY - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View activity - admin all or client own" ON public.client_activity;

CREATE POLICY "View activity - admin all or client own" ON public.client_activity
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- ============================================
-- INTEGRATIONS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage integrations" ON public.integrations;

CREATE POLICY "Admin users can manage integrations" ON public.integrations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- WEBHOOKS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage webhooks" ON public.webhooks;

CREATE POLICY "Admin users can manage webhooks" ON public.webhooks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- API_KEYS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage API keys" ON public.api_keys;

CREATE POLICY "Admin users can manage API keys" ON public.api_keys
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- EMAIL_SEQUENCES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage sequences" ON public.email_sequences;

CREATE POLICY "Admin users can manage sequences" ON public.email_sequences
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- EMAIL_SEQUENCE_STEPS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage sequence steps" ON public.email_sequence_steps;

CREATE POLICY "Admin users can manage sequence steps" ON public.email_sequence_steps
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- EMAIL_SENDS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can insert email sends" ON public.email_sends;

CREATE POLICY "Admin users can insert email sends" ON public.email_sends
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- SUBSCRIBER_SEQUENCES - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can manage subscriber sequences" ON public.subscriber_sequences;

CREATE POLICY "Admin users can manage subscriber sequences" ON public.subscriber_sequences
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- ADMIN_SETTINGS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "Admin users can update settings" ON public.admin_settings;

CREATE POLICY "Admin users can update settings" ON public.admin_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- ============================================
-- CLIENT_TRAINING_ASSIGNMENTS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View assignments - admin all or client own" ON public.client_training_assignments;

CREATE POLICY "View assignments - admin all or client own" ON public.client_training_assignments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

-- ============================================
-- CLIENT_TRAINING_PROGRESS - Optimize RLS
-- ============================================
DROP POLICY IF EXISTS "View progress - admin all or client own" ON public.client_training_progress;
DROP POLICY IF EXISTS "Insert progress - admin all or client own" ON public.client_training_progress;
DROP POLICY IF EXISTS "Update progress - admin all or client own" ON public.client_training_progress;

CREATE POLICY "View progress - admin all or client own" ON public.client_training_progress
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Insert progress - admin all or client own" ON public.client_training_progress
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Update progress - admin all or client own" ON public.client_training_progress
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (select auth.jwt() ->> 'email') 
      AND is_active = true
    )
    OR client_id IN (
      SELECT id FROM public.clients 
      WHERE lower(email) = lower((select auth.jwt() ->> 'email'))
    )
  );