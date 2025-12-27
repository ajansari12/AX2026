/*
  # CRM Integrations & Webhooks

  This migration adds tables for CRM integrations and webhook management.

  1. New Tables
    - `integrations` - Store integration configurations
    - `webhooks` - Webhook endpoints for external notifications
    - `webhook_logs` - Track webhook delivery attempts
    - `api_keys` - API key management for external access

  2. Features
    - HubSpot, Pipedrive, Zapier support
    - Webhook event subscriptions
    - API key authentication
*/

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'hubspot', 'pipedrive', 'zapier', 'slack', 'discord'
  display_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}', -- Encrypted credentials and settings
  field_mapping JSONB DEFAULT '{}', -- Map local fields to CRM fields
  sync_direction TEXT DEFAULT 'push' CHECK (sync_direction IN ('push', 'pull', 'bidirectional')),
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT, -- For signing payloads
  events TEXT[] NOT NULL, -- Array of event types to listen for
  is_enabled BOOLEAN DEFAULT true,
  headers JSONB DEFAULT '{}', -- Custom headers to send
  retry_count INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook delivery logs
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 1,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE, -- Hashed API key
  key_prefix TEXT NOT NULL, -- First 8 chars for identification
  permissions TEXT[] DEFAULT ARRAY['read'], -- 'read', 'write', 'delete'
  rate_limit INTEGER DEFAULT 1000, -- Requests per hour
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API request logs for rate limiting
CREATE TABLE IF NOT EXISTS api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_status INTEGER,
  response_time_ms INTEGER,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS integrations_name_idx ON integrations(name);
CREATE INDEX IF NOT EXISTS webhooks_enabled_idx ON webhooks(is_enabled);
CREATE INDEX IF NOT EXISTS webhook_logs_webhook_idx ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS webhook_logs_created_idx ON webhook_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS api_keys_prefix_idx ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS api_request_logs_key_idx ON api_request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS api_request_logs_created_idx ON api_request_logs(created_at DESC);

-- RLS Policies
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage integrations"
  ON integrations FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage webhooks"
  ON webhooks FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view webhook logs"
  ON webhook_logs FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage API keys"
  ON api_keys FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view API logs"
  ON api_request_logs FOR SELECT TO authenticated
  USING (true);

-- Function to dispatch webhooks
CREATE OR REPLACE FUNCTION dispatch_webhook(
  p_event_type TEXT,
  p_payload JSONB
)
RETURNS INTEGER AS $$
DECLARE
  webhook_record webhooks%ROWTYPE;
  dispatched INTEGER := 0;
BEGIN
  FOR webhook_record IN
    SELECT * FROM webhooks
    WHERE is_enabled = true
    AND p_event_type = ANY(events)
  LOOP
    -- Log the webhook dispatch (actual HTTP call done by Edge Function)
    INSERT INTO webhook_logs (webhook_id, event_type, payload, success)
    VALUES (webhook_record.id, p_event_type, p_payload, false);

    dispatched := dispatched + 1;
  END LOOP;

  RETURN dispatched;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to dispatch webhooks on lead events
CREATE OR REPLACE FUNCTION trigger_lead_webhook()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM dispatch_webhook('lead.created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM dispatch_webhook('lead.updated', jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM dispatch_webhook('lead.deleted', to_jsonb(OLD));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'lead_webhook_trigger') THEN
    CREATE TRIGGER lead_webhook_trigger
      AFTER INSERT OR UPDATE OR DELETE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION trigger_lead_webhook();
  END IF;
END $$;

-- Trigger for booking webhooks
CREATE OR REPLACE FUNCTION trigger_booking_webhook()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM dispatch_webhook('booking.created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM dispatch_webhook('booking.updated', to_jsonb(NEW));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'booking_webhook_trigger') THEN
    CREATE TRIGGER booking_webhook_trigger
      AFTER INSERT OR UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION trigger_booking_webhook();
  END IF;
END $$;

-- Insert default integration configurations
INSERT INTO integrations (name, display_name, config) VALUES
  ('hubspot', 'HubSpot CRM', '{"api_version": "v3", "object_type": "contacts"}'),
  ('pipedrive', 'Pipedrive', '{"api_version": "v1"}'),
  ('zapier', 'Zapier', '{"webhook_style": "catch"}'),
  ('slack', 'Slack', '{"message_format": "blocks"}'),
  ('discord', 'Discord', '{"embed_style": true}')
ON CONFLICT DO NOTHING;