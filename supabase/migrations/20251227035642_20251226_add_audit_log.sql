/*
  # Add Audit Log Table

  This migration creates an audit log table to track all admin actions
  for compliance and debugging purposes.

  1. New Table
    - `audit_log` - Stores all admin actions with before/after data

  2. Triggers
    - Auto-log changes to leads, clients, projects, invoices tables

  3. Security
    - Only authenticated users can view audit logs
    - Insert is allowed via triggers (SECURITY DEFINER)
*/

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  actor_email TEXT,
  actor_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS audit_log_table_name_idx ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS audit_log_record_id_idx ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS audit_log_action_idx ON audit_log(action);
CREATE INDEX IF NOT EXISTS audit_log_actor_email_idx ON audit_log(actor_email);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log(created_at DESC);

-- Composite index for filtering
CREATE INDEX IF NOT EXISTS audit_log_table_action_idx ON audit_log(table_name, action);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view audit logs
CREATE POLICY "Authenticated users can view audit logs"
  ON audit_log FOR SELECT
  TO authenticated
  USING (true);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  old_data_json JSONB;
  new_data_json JSONB;
  changed_cols TEXT[];
  col_name TEXT;
BEGIN
  -- Determine action and set data
  IF TG_OP = 'INSERT' THEN
    new_data_json := to_jsonb(NEW);
    old_data_json := NULL;
    changed_cols := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    old_data_json := to_jsonb(OLD);
    new_data_json := to_jsonb(NEW);

    -- Find changed columns
    changed_cols := ARRAY[]::TEXT[];
    FOR col_name IN
      SELECT key FROM jsonb_each(old_data_json)
      UNION
      SELECT key FROM jsonb_each(new_data_json)
    LOOP
      IF (old_data_json ->> col_name) IS DISTINCT FROM (new_data_json ->> col_name) THEN
        changed_cols := array_append(changed_cols, col_name);
      END IF;
    END LOOP;

    -- Skip if no actual changes
    IF array_length(changed_cols, 1) IS NULL OR array_length(changed_cols, 1) = 0 THEN
      RETURN NEW;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    old_data_json := to_jsonb(OLD);
    new_data_json := NULL;
    changed_cols := NULL;
  END IF;

  -- Insert audit record
  INSERT INTO audit_log (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_fields,
    actor_email,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    old_data_json,
    new_data_json,
    changed_cols,
    COALESCE(current_setting('app.current_user_email', true), 'system'),
    NOW()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for main tables
DO $$
BEGIN
  -- Leads audit trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'leads_audit_trigger') THEN
    CREATE TRIGGER leads_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION audit_trigger_func();
  END IF;

  -- Clients audit trigger (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'clients_audit_trigger') THEN
      CREATE TRIGGER clients_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON clients
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_func();
    END IF;
  END IF;

  -- Projects audit trigger (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'projects_audit_trigger') THEN
      CREATE TRIGGER projects_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON projects
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_func();
    END IF;
  END IF;

  -- Invoices audit trigger (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'invoices_audit_trigger') THEN
      CREATE TRIGGER invoices_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON invoices
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_func();
    END IF;
  END IF;
END;
$$;

-- Function to set current user for audit logging
CREATE OR REPLACE FUNCTION set_audit_user(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_email', user_email, true);
END;
$$ LANGUAGE plpgsql;