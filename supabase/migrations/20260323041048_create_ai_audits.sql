/*
  # Create ai_audits table

  ## Summary
  Creates a new table to store results from the Free AI Systems Audit interactive tool.

  ## New Tables

  ### `ai_audits`
  Stores each audit submission with business profile, calculated scores, and impact estimates.

  | Column             | Type         | Description                                          |
  |--------------------|--------------|------------------------------------------------------|
  | id                 | uuid         | Primary key                                          |
  | created_at         | timestamptz  | Submission timestamp                                 |
  | industry           | text         | Selected industry key (e.g. "dental", "legal")       |
  | team_size          | text         | Selected team size bucket (e.g. "6-20")              |
  | pain_point         | text         | Selected primary pain point                          |
  | lead_volume        | text         | Monthly lead volume bucket (e.g. "25-50")            |
  | tools              | text[]       | Array of tools currently in use                      |
  | website_url        | text         | Optional website URL provided by visitor             |
  | automation_score   | integer      | Calculated automation opportunity score (0–100)      |
  | hours_saved        | numeric      | Estimated monthly hours recoverable                  |
  | monthly_impact     | numeric      | Estimated monthly revenue opportunity ($)            |
  | email              | text         | Optional email captured post-results                 |
  | website_audit_id   | uuid         | Optional FK to a website_audits record               |

  ## Security
  - RLS enabled: table is locked by default
  - Service role has full access (admin/backend use)
  - Anonymous and authenticated users can INSERT only — no reads of others' data

  ## Notes
  - INSERT-only for public users keeps audit results private
  - Non-blocking: the frontend catches insert errors gracefully
*/

CREATE TABLE IF NOT EXISTS ai_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  industry TEXT NOT NULL,
  team_size TEXT NOT NULL,
  pain_point TEXT NOT NULL,
  lead_volume TEXT NOT NULL,
  tools TEXT[] DEFAULT '{}',
  website_url TEXT,
  automation_score INTEGER,
  hours_saved NUMERIC,
  monthly_impact NUMERIC,
  email TEXT,
  website_audit_id UUID
);

ALTER TABLE ai_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to ai_audits"
  ON ai_audits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert ai_audits"
  ON ai_audits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
