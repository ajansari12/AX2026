/*
  # Create Leads Table
  
  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `name` (text) - Lead's full name
      - `email` (text) - Lead's email address
      - `service_interest` (text, nullable) - Which service they're interested in
      - `message` (text, nullable) - Additional message from the lead
      - `source` (text) - Where the lead came from (contact_form, exit_modal, etc.)
      - `status` (text) - Lead status (new, contacted, qualified, converted, closed)
      - `utm_source` (text, nullable) - UTM tracking parameter
      - `utm_medium` (text, nullable) - UTM tracking parameter
      - `utm_campaign` (text, nullable) - UTM tracking parameter
      - `created_at` (timestamptz) - When the lead was created
      - `updated_at` (timestamptz) - When the lead was last updated
      
  2. Security
    - Enable RLS on `leads` table
    - Add policy for inserting leads (public can insert)
    - Read access restricted to authenticated users only
    
  3. Indexes
    - Index on email for quick lookups
    - Index on created_at for date-based queries
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service_interest text,
  message text,
  source text NOT NULL DEFAULT 'contact_form',
  status text NOT NULL DEFAULT 'new',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
