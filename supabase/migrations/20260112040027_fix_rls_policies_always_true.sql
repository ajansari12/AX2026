/*
  # Fix RLS Policies - Replace Always True with Admin-Only

  This migration replaces RLS policies that have USING(true) or WITH CHECK(true)
  with proper admin-only checks where appropriate.

  ## Policy Categories:
  1. Admin-only tables: Restrict to admin users only
  2. Public insert tables: Keep public for leads, bookings, etc.
  3. Anonymous access tables: Keep for chat, proposal views, etc.

  ## Tables Updated:
  - admin_settings, api_keys, authors, blog_posts
  - email_sends, email_sequence_steps, email_sequences
  - integrations, lead_activity, lead_engagements
  - lead_notes, lead_scoring_rules
  - pipeline_stage_history, proposal_templates, proposals
  - subscriber_sequences, webhooks
*/

-- ============================================
-- ADMIN_SETTINGS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.admin_settings;

CREATE POLICY "Admin users can update settings" ON public.admin_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- API_KEYS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage API keys" ON public.api_keys;

CREATE POLICY "Admin users can manage API keys" ON public.api_keys
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- AUTHORS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can insert authors" ON public.authors;
DROP POLICY IF EXISTS "Authenticated users can update authors" ON public.authors;

CREATE POLICY "Admin users can insert authors" ON public.authors
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

CREATE POLICY "Admin users can update authors" ON public.authors
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- BLOG_POSTS - Admin only for write operations
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;

CREATE POLICY "Admin users can delete blog posts" ON public.blog_posts
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

CREATE POLICY "Admin users can insert blog posts" ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

CREATE POLICY "Admin users can update blog posts" ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- EMAIL_SENDS - Admin only
-- ============================================
DROP POLICY IF EXISTS "System can insert email sends" ON public.email_sends;

CREATE POLICY "Admin users can insert email sends" ON public.email_sends
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- EMAIL_SEQUENCE_STEPS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage sequence steps" ON public.email_sequence_steps;

CREATE POLICY "Admin users can manage sequence steps" ON public.email_sequence_steps
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- EMAIL_SEQUENCES - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage sequences" ON public.email_sequences;

CREATE POLICY "Admin users can manage sequences" ON public.email_sequences
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- INTEGRATIONS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage integrations" ON public.integrations;

CREATE POLICY "Admin users can manage integrations" ON public.integrations
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- LEAD_ACTIVITY - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can insert activity" ON public.lead_activity;

CREATE POLICY "Admin users can insert lead activity" ON public.lead_activity
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- LEAD_ENGAGEMENTS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage engagements" ON public.lead_engagements;

CREATE POLICY "Admin users can manage lead engagements" ON public.lead_engagements
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- LEAD_NOTES - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can delete notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Authenticated users can insert notes" ON public.lead_notes;
DROP POLICY IF EXISTS "Authenticated users can update notes" ON public.lead_notes;

CREATE POLICY "Admin users can delete lead notes" ON public.lead_notes
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

CREATE POLICY "Admin users can insert lead notes" ON public.lead_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

CREATE POLICY "Admin users can update lead notes" ON public.lead_notes
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- LEAD_SCORING_RULES - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage scoring rules" ON public.lead_scoring_rules;

CREATE POLICY "Admin users can manage scoring rules" ON public.lead_scoring_rules
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- PIPELINE_STAGE_HISTORY - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can insert pipeline history" ON public.pipeline_stage_history;

CREATE POLICY "Admin users can insert pipeline history" ON public.pipeline_stage_history
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- PROPOSAL_TEMPLATES - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage templates" ON public.proposal_templates;

CREATE POLICY "Admin users can manage proposal templates" ON public.proposal_templates
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- PROPOSALS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage proposals" ON public.proposals;

CREATE POLICY "Admin users can manage proposals" ON public.proposals
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- SUBSCRIBER_SEQUENCES - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage subscriber sequences" ON public.subscriber_sequences;

CREATE POLICY "Admin users can manage subscriber sequences" ON public.subscriber_sequences
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );

-- ============================================
-- WEBHOOKS - Admin only
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage webhooks" ON public.webhooks;

CREATE POLICY "Admin users can manage webhooks" ON public.webhooks
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = (select auth.jwt() ->> 'email') AND is_active = true)
  );