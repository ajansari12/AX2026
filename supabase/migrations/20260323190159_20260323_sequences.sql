/*
  # Create lead_sequences table for native email automation

  ## Summary
  Adds a dedicated `lead_sequences` table to power a 4-step AI-generated email
  drip sequence for every new lead captured via the contact form or other sources.

  ## New Tables
  - `lead_sequences`
    - `id` (uuid, PK) — unique sequence record
    - `lead_id` (uuid, FK → leads.id, CASCADE DELETE) — optional link to the lead row
    - `lead_email` (text, NOT NULL) — recipient email address
    - `lead_name` (text) — first/full name for personalization
    - `industry` (text) — industry context for Claude prompt
    - `sequence_type` (text) — discriminator: new_lead | audit_followup | post_booking
    - `current_step` (int) — last completed step (0 = none sent yet)
    - `status` (text) — active | paused | completed | unsubscribed
    - `next_send_at` (timestamptz) — when the cron job should send the next email
    - `last_sent_at` (timestamptz) — timestamp of the most recent send
    - `metadata` (jsonb) — flexible bag for source, UTM, etc.
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled; service_role only — no client or anon access

  ## Indexes
  - `idx_sequences_next_send` on (status, next_send_at) — used by the daily cron query
*/

CREATE TABLE IF NOT EXISTS lead_sequences (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        uuid REFERENCES leads(id) ON DELETE CASCADE,
  lead_email     text NOT NULL,
  lead_name      text,
  industry       text,
  sequence_type  text NOT NULL DEFAULT 'new_lead',
  current_step   integer NOT NULL DEFAULT 0,
  status         text NOT NULL DEFAULT 'active',
  next_send_at   timestamptz DEFAULT now() + interval '3 days',
  last_sent_at   timestamptz,
  metadata       jsonb NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lead_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only"
  ON lead_sequences
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_sequences_next_send
  ON lead_sequences (status, next_send_at);
