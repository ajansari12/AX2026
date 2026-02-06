/*
  # Create Website Audits & Product Events Tables

  1. New Tables
    - `website_audits`
      - `id` (uuid, primary key)
      - `url` (text) - The URL that was audited
      - `mobile_scores` (jsonb) - PageSpeed scores for mobile
      - `desktop_scores` (jsonb) - PageSpeed scores for desktop
      - `metrics` (jsonb) - Core Web Vitals and other metrics
      - `top_issues` (jsonb) - Top issues found during audit
      - `screenshot_url` (text) - Screenshot of the site
      - `visitor_id` (text) - Anonymous visitor identifier
      - `email` (text, nullable) - Email if captured
      - `lead_id` (uuid, nullable) - FK to leads table if lead created
      - `created_at` (timestamptz)

    - `product_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - Type of event (audit_started, demo_started, etc.)
      - `product_slug` (text) - Which product the event relates to
      - `visitor_id` (text) - Anonymous visitor identifier
      - `metadata` (jsonb) - Additional event data
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on both tables
    - website_audits: anon can insert (for public audit tool), admins can select
    - product_events: anon can insert (for tracking), admins can select

  3. Indexes
    - website_audits: visitor_id, email, created_at
    - product_events: event_type, product_slug, visitor_id, created_at
*/

CREATE TABLE IF NOT EXISTS website_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  mobile_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  desktop_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  top_issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  screenshot_url text NOT NULL DEFAULT '',
  visitor_id text NOT NULL DEFAULT '',
  email text,
  lead_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE website_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can insert audits"
  ON website_audits FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert audits"
  ON website_audits FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all audits"
  ON website_audits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update audits"
  ON website_audits FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_website_audits_visitor_id ON website_audits (visitor_id);
CREATE INDEX IF NOT EXISTS idx_website_audits_email ON website_audits (email);
CREATE INDEX IF NOT EXISTS idx_website_audits_created_at ON website_audits (created_at);

CREATE TABLE IF NOT EXISTS product_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  product_slug text NOT NULL DEFAULT '',
  visitor_id text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can insert product events"
  ON product_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert product events"
  ON product_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all product events"
  ON product_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_product_events_type ON product_events (event_type);
CREATE INDEX IF NOT EXISTS idx_product_events_slug ON product_events (product_slug);
CREATE INDEX IF NOT EXISTS idx_product_events_visitor ON product_events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_product_events_created ON product_events (created_at);
