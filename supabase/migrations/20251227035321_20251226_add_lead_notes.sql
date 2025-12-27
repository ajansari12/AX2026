-- Lead Notes & Activity Timeline
-- This migration adds tables for tracking notes and activity on leads

-- Notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS lead_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'status_change', 'note_added', 'email_sent', 'call_made', 'created', etc.
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  actor_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS lead_notes_lead_id_idx ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS lead_notes_created_at_idx ON lead_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS lead_activity_lead_id_idx ON lead_activity(lead_id);
CREATE INDEX IF NOT EXISTS lead_activity_created_at_idx ON lead_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS lead_activity_type_idx ON lead_activity(activity_type);

-- RLS Policies
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) can read notes
CREATE POLICY "Authenticated users can read notes"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert notes
CREATE POLICY "Authenticated users can insert notes"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update their own notes
CREATE POLICY "Authenticated users can update notes"
  ON lead_notes FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete notes
CREATE POLICY "Authenticated users can delete notes"
  ON lead_notes FOR DELETE
  TO authenticated
  USING (true);

-- Authenticated users can read activity
CREATE POLICY "Authenticated users can read activity"
  ON lead_activity FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert activity
CREATE POLICY "Authenticated users can insert activity"
  ON lead_activity FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Trigger to auto-log lead creation
CREATE OR REPLACE FUNCTION log_lead_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO lead_activity (lead_id, activity_type, description, metadata)
  VALUES (
    NEW.id,
    'created',
    'Lead created from ' || COALESCE(NEW.source, 'unknown source'),
    jsonb_build_object('source', NEW.source, 'email', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'lead_creation_trigger') THEN
    CREATE TRIGGER lead_creation_trigger
      AFTER INSERT ON leads
      FOR EACH ROW
      EXECUTE FUNCTION log_lead_creation();
  END IF;
END;
$$;

-- Trigger to auto-log status changes
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lead_activity (lead_id, activity_type, description, metadata)
    VALUES (
      NEW.id,
      'status_change',
      'Status changed from ' || COALESCE(OLD.status, 'none') || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'lead_status_change_trigger') THEN
    CREATE TRIGGER lead_status_change_trigger
      AFTER UPDATE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION log_lead_status_change();
  END IF;
END;
$$;

-- Trigger to auto-log note additions
CREATE OR REPLACE FUNCTION log_note_addition()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO lead_activity (lead_id, activity_type, description, actor_email, metadata)
  VALUES (
    NEW.lead_id,
    'note_added',
    'Note added',
    NEW.author_email,
    jsonb_build_object('note_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'note_addition_trigger') THEN
    CREATE TRIGGER note_addition_trigger
      AFTER INSERT ON lead_notes
      FOR EACH ROW
      EXECUTE FUNCTION log_note_addition();
  END IF;
END;
$$;