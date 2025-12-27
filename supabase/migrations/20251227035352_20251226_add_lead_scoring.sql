/*
  # Lead Scoring System

  This migration adds a lead scoring system that automatically
  calculates scores based on engagement and profile data.

  1. New Columns
    - `score` on leads table - Calculated engagement score
    - `score_breakdown` on leads table - JSON with score components
    - `last_scored_at` on leads table - When score was last calculated

  2. Scoring Factors
    - Service interest match (20 pts)
    - Budget level (up to 30 pts)
    - Engagement (chat, downloads, etc.) (up to 25 pts)
    - Recency (up to 25 pts)
*/

-- Add scoring columns to leads table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'score'
  ) THEN
    ALTER TABLE leads ADD COLUMN score INTEGER DEFAULT 0;
    ALTER TABLE leads ADD COLUMN score_breakdown JSONB DEFAULT '{}';
    ALTER TABLE leads ADD COLUMN last_scored_at TIMESTAMPTZ;
    ALTER TABLE leads ADD COLUMN pipeline_stage TEXT DEFAULT 'new'
      CHECK (pipeline_stage IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'));
    ALTER TABLE leads ADD COLUMN expected_value DECIMAL(10,2);
    ALTER TABLE leads ADD COLUMN probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100);

    CREATE INDEX IF NOT EXISTS leads_score_idx ON leads(score DESC);
    CREATE INDEX IF NOT EXISTS leads_pipeline_stage_idx ON leads(pipeline_stage);
  END IF;
END $$;

-- Lead engagement tracking table
CREATE TABLE IF NOT EXISTS lead_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  engagement_type TEXT NOT NULL, -- 'page_view', 'chat', 'download', 'email_open', 'email_click', 'booking'
  metadata JSONB DEFAULT '{}',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_engagements_lead_id_idx ON lead_engagements(lead_id);
CREATE INDEX IF NOT EXISTS lead_engagements_type_idx ON lead_engagements(engagement_type);
CREATE INDEX IF NOT EXISTS lead_engagements_created_idx ON lead_engagements(created_at DESC);

-- RLS for engagements
ALTER TABLE lead_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage engagements"
  ON lead_engagements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Scoring rules table
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'profile', 'engagement', 'recency', 'budget'
  condition_type TEXT NOT NULL, -- 'equals', 'contains', 'greater_than', 'less_than', 'within_days'
  condition_field TEXT NOT NULL, -- Field to check (e.g., 'service_interest', 'pricing_preference')
  condition_value TEXT NOT NULL, -- Value to compare against
  points INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for scoring rules
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage scoring rules"
  ON lead_scoring_rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default scoring rules
INSERT INTO lead_scoring_rules (name, description, category, condition_type, condition_field, condition_value, points) VALUES
  -- Profile-based scoring
  ('High-value service interest', 'AI Assistant or Automation service', 'profile', 'contains', 'service_interest', 'ai,automation', 20),
  ('Enterprise pricing', 'Selected enterprise pricing tier', 'profile', 'equals', 'pricing_preference', 'enterprise', 30),
  ('Growth pricing', 'Selected growth pricing tier', 'profile', 'equals', 'pricing_preference', 'growth', 20),
  ('Starter pricing', 'Selected starter pricing tier', 'profile', 'equals', 'pricing_preference', 'starter', 10),

  -- Engagement scoring
  ('Chat engagement', 'Had chat conversation', 'engagement', 'equals', 'engagement_type', 'chat', 15),
  ('Resource download', 'Downloaded a resource', 'engagement', 'equals', 'engagement_type', 'download', 10),
  ('Email opened', 'Opened marketing email', 'engagement', 'equals', 'engagement_type', 'email_open', 5),
  ('Email clicked', 'Clicked link in email', 'engagement', 'equals', 'engagement_type', 'email_click', 10),
  ('Booked call', 'Scheduled a consultation', 'engagement', 'equals', 'engagement_type', 'booking', 25),

  -- Recency scoring
  ('Very recent lead', 'Lead created within 24 hours', 'recency', 'within_days', 'created_at', '1', 25),
  ('Recent lead', 'Lead created within 7 days', 'recency', 'within_days', 'created_at', '7', 15),
  ('Active lead', 'Lead created within 30 days', 'recency', 'within_days', 'created_at', '30', 5)
ON CONFLICT DO NOTHING;

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(p_lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
  lead_record leads%ROWTYPE;
  engagement_record RECORD;
  rule RECORD;
  total_score INTEGER := 0;
  breakdown JSONB := '{}';
  rule_matched BOOLEAN;
  days_old INTEGER;
BEGIN
  -- Get lead data
  SELECT * INTO lead_record FROM leads WHERE id = p_lead_id;
  IF lead_record IS NULL THEN
    RETURN 0;
  END IF;

  -- Calculate days since creation
  days_old := EXTRACT(DAY FROM (NOW() - lead_record.created_at));

  -- Apply profile-based rules
  FOR rule IN SELECT * FROM lead_scoring_rules WHERE is_active = true AND category = 'profile' LOOP
    rule_matched := false;

    IF rule.condition_type = 'equals' THEN
      IF rule.condition_field = 'pricing_preference' AND lead_record.pricing_preference = rule.condition_value THEN
        rule_matched := true;
      ELSIF rule.condition_field = 'service_interest' AND lead_record.service_interest = rule.condition_value THEN
        rule_matched := true;
      END IF;
    ELSIF rule.condition_type = 'contains' THEN
      IF rule.condition_field = 'service_interest' AND
         (lead_record.service_interest ILIKE '%' || ANY(string_to_array(rule.condition_value, ',')) || '%') THEN
        rule_matched := true;
      END IF;
    END IF;

    IF rule_matched THEN
      total_score := total_score + rule.points;
      breakdown := breakdown || jsonb_build_object(rule.name, rule.points);
    END IF;
  END LOOP;

  -- Apply recency rules (only apply highest matching rule)
  FOR rule IN
    SELECT * FROM lead_scoring_rules
    WHERE is_active = true AND category = 'recency'
    ORDER BY condition_value::INTEGER ASC
  LOOP
    IF days_old <= rule.condition_value::INTEGER THEN
      total_score := total_score + rule.points;
      breakdown := breakdown || jsonb_build_object(rule.name, rule.points);
      EXIT; -- Only apply the first (most valuable) matching rule
    END IF;
  END LOOP;

  -- Sum engagement points
  FOR engagement_record IN
    SELECT engagement_type, SUM(points) as total_points
    FROM lead_engagements
    WHERE lead_id = p_lead_id
    GROUP BY engagement_type
  LOOP
    total_score := total_score + engagement_record.total_points;
    breakdown := breakdown || jsonb_build_object(
      'engagement_' || engagement_record.engagement_type,
      engagement_record.total_points
    );
  END LOOP;

  -- Update lead with new score
  UPDATE leads SET
    score = total_score,
    score_breakdown = breakdown,
    last_scored_at = NOW()
  WHERE id = p_lead_id;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to recalculate score on engagement
CREATE OR REPLACE FUNCTION trigger_recalculate_score()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_lead_score(NEW.lead_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'engagement_score_trigger') THEN
    CREATE TRIGGER engagement_score_trigger
      AFTER INSERT ON lead_engagements
      FOR EACH ROW
      EXECUTE FUNCTION trigger_recalculate_score();
  END IF;
END $$;

-- Function to bulk recalculate all lead scores
CREATE OR REPLACE FUNCTION recalculate_all_lead_scores()
RETURNS INTEGER AS $$
DECLARE
  lead_record leads%ROWTYPE;
  count INTEGER := 0;
BEGIN
  FOR lead_record IN SELECT * FROM leads LOOP
    PERFORM calculate_lead_score(lead_record.id);
    count := count + 1;
  END LOOP;
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pipeline stage history for tracking movement
CREATE TABLE IF NOT EXISTS pipeline_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  changed_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pipeline_history_lead_idx ON pipeline_stage_history(lead_id);
CREATE INDEX IF NOT EXISTS pipeline_history_created_idx ON pipeline_stage_history(created_at DESC);

-- RLS for pipeline history
ALTER TABLE pipeline_stage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pipeline history"
  ON pipeline_stage_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pipeline history"
  ON pipeline_stage_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Trigger to log pipeline stage changes
CREATE OR REPLACE FUNCTION log_pipeline_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.pipeline_stage IS DISTINCT FROM NEW.pipeline_stage THEN
    INSERT INTO pipeline_stage_history (lead_id, from_stage, to_stage)
    VALUES (NEW.id, OLD.pipeline_stage, NEW.pipeline_stage);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'pipeline_change_trigger') THEN
    CREATE TRIGGER pipeline_change_trigger
      AFTER UPDATE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION log_pipeline_change();
  END IF;
END $$;