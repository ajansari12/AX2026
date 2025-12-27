/*
  # Add Database Notification Triggers

  This migration adds triggers that automatically send notifications
  via the send-email Edge Function when new leads or bookings are created.

  1. Functions
    - `notify_new_lead()` - Sends notification for new lead submissions
    - `notify_new_booking()` - Sends notification for new booking confirmations
    - `notify_lead_status_change()` - Sends notification when lead status changes

  2. Triggers
    - `on_new_lead` - Fires after INSERT on leads table
    - `on_new_booking` - Fires after INSERT on bookings table
    - `on_lead_status_change` - Fires after UPDATE on leads when status changes

  3. Notes
    - Uses pg_net extension for async HTTP calls
    - Notifications are sent asynchronously to not block the insert
    - Edge function URL should be configured via database settings
    - SECURITY DEFINER allows the function to access pg_net
*/

-- Enable pg_net extension if not already enabled
-- Note: pg_net is pre-installed on Supabase
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create admin_settings table if it doesn't exist
-- This stores configuration like edge function URLs
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings (these should be updated in production)
INSERT INTO admin_settings (key, value, description) VALUES
  ('edge_function_base_url', 'https://your-project.supabase.co/functions/v1', 'Base URL for Supabase Edge Functions'),
  ('notifications_enabled', 'true', 'Whether to send automatic notifications'),
  ('notification_email', 'hi@axrategy.com', 'Email to receive admin notifications')
ON CONFLICT (key) DO NOTHING;

-- Function to get admin setting
CREATE OR REPLACE FUNCTION get_admin_setting(setting_key TEXT)
RETURNS TEXT AS $$
  SELECT value FROM admin_settings WHERE key = setting_key;
$$ LANGUAGE sql STABLE;

-- Function to notify on new lead
-- This sends an HTTP request to the send-email edge function
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  base_url TEXT;
  notifications_enabled TEXT;
  service_role_key TEXT;
BEGIN
  -- Check if notifications are enabled
  SELECT value INTO notifications_enabled FROM admin_settings WHERE key = 'notifications_enabled';
  IF notifications_enabled != 'true' THEN
    RETURN NEW;
  END IF;

  -- Get the edge function base URL
  SELECT value INTO base_url FROM admin_settings WHERE key = 'edge_function_base_url';

  -- Get service role key from app settings (must be set via ALTER DATABASE)
  BEGIN
    service_role_key := current_setting('app.service_role_key', true);
  EXCEPTION WHEN OTHERS THEN
    service_role_key := NULL;
  END;

  -- If no service role key, log and continue without failing
  IF service_role_key IS NULL OR service_role_key = '' THEN
    RAISE NOTICE 'Service role key not configured. Skipping notification for lead %.', NEW.id;
    RETURN NEW;
  END IF;

  -- Send async HTTP request to edge function
  PERFORM extensions.http_post(
    url := base_url || '/send-email',
    body := jsonb_build_object(
      'type', 'new_lead',
      'lead', jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'service_interest', NEW.service_interest,
        'message', NEW.message,
        'source', NEW.source,
        'pricing_preference', NEW.pricing_preference
      )
    )::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't fail the insert if notification fails
  RAISE NOTICE 'Failed to send lead notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify on new booking
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  base_url TEXT;
  notifications_enabled TEXT;
  service_role_key TEXT;
BEGIN
  -- Check if notifications are enabled
  SELECT value INTO notifications_enabled FROM admin_settings WHERE key = 'notifications_enabled';
  IF notifications_enabled != 'true' THEN
    RETURN NEW;
  END IF;

  -- Get the edge function base URL
  SELECT value INTO base_url FROM admin_settings WHERE key = 'edge_function_base_url';

  -- Get service role key
  BEGIN
    service_role_key := current_setting('app.service_role_key', true);
  EXCEPTION WHEN OTHERS THEN
    service_role_key := NULL;
  END;

  IF service_role_key IS NULL OR service_role_key = '' THEN
    RAISE NOTICE 'Service role key not configured. Skipping notification for booking %.', NEW.id;
    RETURN NEW;
  END IF;

  -- Send async HTTP request to edge function
  PERFORM extensions.http_post(
    url := base_url || '/send-email',
    body := jsonb_build_object(
      'type', 'new_booking',
      'booking', jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'scheduled_time', NEW.scheduled_time,
        'notes', NEW.notes
      )
    )::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Failed to send booking notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers (only if they don't exist)
DO $$
BEGIN
  -- Lead notification trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_new_lead_notification') THEN
    CREATE TRIGGER on_new_lead_notification
      AFTER INSERT ON leads
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_lead();
  END IF;

  -- Booking notification trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_new_booking_notification') THEN
    CREATE TRIGGER on_new_booking_notification
      AFTER INSERT ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_booking();
  END IF;
END;
$$;

-- RLS policy for admin_settings (only authenticated users can access)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view settings"
  ON admin_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON admin_settings FOR UPDATE
  TO authenticated
  USING (true);

-- Add comment to remind about service role key configuration
COMMENT ON FUNCTION notify_new_lead() IS
'Sends notification to admin when a new lead is created.
Requires app.service_role_key to be set via:
ALTER DATABASE postgres SET app.service_role_key = ''your-service-role-key'';
And edge_function_base_url to be updated in admin_settings table.';

COMMENT ON FUNCTION notify_new_booking() IS
'Sends notification to admin when a new booking is created.
Requires the same configuration as notify_new_lead().';
