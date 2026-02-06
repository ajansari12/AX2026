/*
  # Create preview_leads and gbp_audits tables

  1. New Tables
    - `preview_leads`
      - `id` (uuid, primary key)
      - `product_slug` (text) - which product preview captured the lead
      - `email` (text) - the lead's email address
      - `quiz_data` (jsonb) - optional quiz/form data submitted during preview
      - `created_at` (timestamptz)
    - `gbp_audits`
      - `id` (uuid, primary key)
      - `business_name` (text) - name entered by user
      - `city` (text) - city entered by user
      - `places_id` (text) - Google Places ID returned by API
      - `score` (integer) - computed profile completeness score 0-100
      - `findings` (jsonb) - detailed audit findings
      - `competitors` (jsonb) - competitor comparison data
      - `email` (text, nullable) - email if captured
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Insert-only policy for anonymous/authenticated users (public form submissions)
    - Select policies for authenticated admin users (via admin_users table)
*/

CREATE TABLE IF NOT EXISTS preview_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  quiz_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE preview_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a preview lead"
  ON preview_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view preview leads"
  ON preview_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
        AND admin_users.is_active = true
    )
  );

CREATE TABLE IF NOT EXISTS gbp_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  places_id text DEFAULT '',
  score integer DEFAULT 0,
  findings jsonb DEFAULT '{}',
  competitors jsonb DEFAULT '[]',
  email text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gbp_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a GBP audit"
  ON gbp_audits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view GBP audits"
  ON gbp_audits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
        AND admin_users.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_preview_leads_product_slug ON preview_leads(product_slug);
CREATE INDEX IF NOT EXISTS idx_preview_leads_email ON preview_leads(email);
CREATE INDEX IF NOT EXISTS idx_preview_leads_created_at ON preview_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gbp_audits_email ON gbp_audits(email);
CREATE INDEX IF NOT EXISTS idx_gbp_audits_created_at ON gbp_audits(created_at DESC);
