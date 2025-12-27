/*
  # Harden Function Search Paths

  ## Overview
  This migration adds explicit `SET search_path = public, pg_temp` to all public functions
  to prevent search_path injection attacks. Functions with mutable search paths could be
  exploited if an attacker creates malicious objects in a schema that appears earlier in
  the search path.

  ## Functions Updated
  - log_lead_creation
  - log_lead_status_change
  - log_note_addition
  - calculate_lead_score
  - trigger_recalculate_score
  - recalculate_all_lead_scores
  - log_pipeline_change
  - generate_share_token
  - update_updated_at
  - log_client_login
  - log_document_view
  - log_invoice_view
  - log_invoice_payment
  - generate_invoice_number
  - dispatch_webhook
  - trigger_lead_webhook
  - trigger_booking_webhook
  - enroll_in_sequence
  - auto_enroll_newsletter
  - auto_enroll_lead
  - audit_trigger_func
  - set_audit_user
  - get_admin_setting
  - notify_new_lead
  - notify_new_booking

  ## Security Notes
  - SET search_path = public, pg_temp ensures only public schema is used
  - pg_temp allows temporary tables to work as expected
  - This prevents attackers from hijacking function calls via schema manipulation
*/

-- log_lead_creation
CREATE OR REPLACE FUNCTION public.log_lead_creation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
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
$function$;

-- log_lead_status_change
CREATE OR REPLACE FUNCTION public.log_lead_status_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
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
$function$;

-- log_note_addition
CREATE OR REPLACE FUNCTION public.log_note_addition()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
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
$function$;

-- calculate_lead_score
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_lead_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  lead_record leads%ROWTYPE;
  engagement_record RECORD;
  rule RECORD;
  total_score INTEGER := 0;
  breakdown JSONB := '{}';
  rule_matched BOOLEAN;
  days_old INTEGER;
BEGIN
  SELECT * INTO lead_record FROM leads WHERE id = p_lead_id;
  IF lead_record IS NULL THEN
    RETURN 0;
  END IF;

  days_old := EXTRACT(DAY FROM (NOW() - lead_record.created_at));

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

  FOR rule IN
    SELECT * FROM lead_scoring_rules
    WHERE is_active = true AND category = 'recency'
    ORDER BY condition_value::INTEGER ASC
  LOOP
    IF days_old <= rule.condition_value::INTEGER THEN
      total_score := total_score + rule.points;
      breakdown := breakdown || jsonb_build_object(rule.name, rule.points);
      EXIT;
    END IF;
  END LOOP;

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

  UPDATE leads SET
    score = total_score,
    score_breakdown = breakdown,
    last_scored_at = NOW()
  WHERE id = p_lead_id;

  RETURN total_score;
END;
$function$;

-- trigger_recalculate_score
CREATE OR REPLACE FUNCTION public.trigger_recalculate_score()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  PERFORM calculate_lead_score(NEW.lead_id);
  RETURN NEW;
END;
$function$;

-- recalculate_all_lead_scores
CREATE OR REPLACE FUNCTION public.recalculate_all_lead_scores()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
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
$function$;

-- log_pipeline_change
CREATE OR REPLACE FUNCTION public.log_pipeline_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF OLD.pipeline_stage IS DISTINCT FROM NEW.pipeline_stage THEN
    INSERT INTO pipeline_stage_history (lead_id, from_stage, to_stage)
    VALUES (NEW.id, OLD.pipeline_stage, NEW.pipeline_stage);
  END IF;
  RETURN NEW;
END;
$function$;

-- generate_share_token
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS text
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$function$;

-- update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- log_client_login
CREATE OR REPLACE FUNCTION public.log_client_login()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF OLD.last_login_at IS DISTINCT FROM NEW.last_login_at THEN
    INSERT INTO client_activity (client_id, activity_type, description)
    VALUES (NEW.id, 'login', 'Client logged in');
  END IF;
  RETURN NEW;
END;
$function$;

-- log_document_view
CREATE OR REPLACE FUNCTION public.log_document_view()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF OLD.viewed_at IS NULL AND NEW.viewed_at IS NOT NULL THEN
    INSERT INTO client_activity (client_id, activity_type, description, metadata)
    VALUES (
      NEW.client_id,
      'document_view',
      'Viewed document: ' || NEW.name,
      jsonb_build_object('document_id', NEW.id, 'document_name', NEW.name)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- log_invoice_view
CREATE OR REPLACE FUNCTION public.log_invoice_view()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF OLD.viewed_at IS NULL AND NEW.viewed_at IS NOT NULL THEN
    INSERT INTO client_activity (client_id, activity_type, description, metadata)
    VALUES (
      NEW.client_id,
      'invoice_viewed',
      'Viewed invoice: ' || NEW.invoice_number,
      jsonb_build_object('invoice_id', NEW.id, 'invoice_number', NEW.invoice_number, 'amount', NEW.total_amount)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- log_invoice_payment
CREATE OR REPLACE FUNCTION public.log_invoice_payment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF OLD.status != 'paid' AND NEW.status = 'paid' THEN
    INSERT INTO client_activity (client_id, activity_type, description, metadata)
    VALUES (
      NEW.client_id,
      'invoice_paid',
      'Paid invoice: ' || NEW.invoice_number,
      jsonb_build_object('invoice_id', NEW.id, 'invoice_number', NEW.invoice_number, 'amount', NEW.total_amount)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- generate_invoice_number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
  year_prefix TEXT;
  next_num INTEGER;
BEGIN
  year_prefix := to_char(NOW(), 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_num
  FROM invoices
  WHERE invoice_number LIKE year_prefix || '-%';

  NEW.invoice_number := year_prefix || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$function$;

-- dispatch_webhook
CREATE OR REPLACE FUNCTION public.dispatch_webhook(p_event_type text, p_payload jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  webhook_record webhooks%ROWTYPE;
  dispatched INTEGER := 0;
BEGIN
  FOR webhook_record IN
    SELECT * FROM webhooks
    WHERE is_enabled = true
    AND p_event_type = ANY(events)
  LOOP
    INSERT INTO webhook_logs (webhook_id, event_type, payload, success)
    VALUES (webhook_record.id, p_event_type, p_payload, false);

    dispatched := dispatched + 1;
  END LOOP;

  RETURN dispatched;
END;
$function$;

-- trigger_lead_webhook
CREATE OR REPLACE FUNCTION public.trigger_lead_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
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
$function$;

-- trigger_booking_webhook
CREATE OR REPLACE FUNCTION public.trigger_booking_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM dispatch_webhook('booking.created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM dispatch_webhook('booking.updated', to_jsonb(NEW));
  END IF;
  RETURN NEW;
END;
$function$;

-- enroll_in_sequence
CREATE OR REPLACE FUNCTION public.enroll_in_sequence(p_email text, p_sequence_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  first_step email_sequence_steps%ROWTYPE;
  enrollment_id UUID;
  next_scheduled TIMESTAMPTZ;
BEGIN
  SELECT * INTO first_step
  FROM email_sequence_steps
  WHERE sequence_id = p_sequence_id AND is_active = true
  ORDER BY step_order ASC
  LIMIT 1;

  IF first_step IS NULL THEN
    RETURN NULL;
  END IF;

  next_scheduled := NOW() + (first_step.delay_days || ' days')::INTERVAL + (first_step.delay_hours || ' hours')::INTERVAL;

  INSERT INTO subscriber_sequences (
    subscriber_email,
    sequence_id,
    current_step,
    status,
    next_email_scheduled_at
  ) VALUES (
    p_email,
    p_sequence_id,
    1,
    'active',
    next_scheduled
  )
  ON CONFLICT (subscriber_email, sequence_id) DO UPDATE SET
    status = 'active',
    current_step = 1,
    started_at = NOW(),
    next_email_scheduled_at = next_scheduled,
    completed_at = NULL
  RETURNING id INTO enrollment_id;

  RETURN enrollment_id;
END;
$function$;

-- auto_enroll_newsletter
CREATE OR REPLACE FUNCTION public.auto_enroll_newsletter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  sequence_record email_sequences%ROWTYPE;
BEGIN
  FOR sequence_record IN
    SELECT * FROM email_sequences
    WHERE trigger_type = 'newsletter_signup' AND is_active = true
  LOOP
    PERFORM enroll_in_sequence(NEW.email, sequence_record.id);
  END LOOP;

  RETURN NEW;
END;
$function$;

-- auto_enroll_lead
CREATE OR REPLACE FUNCTION public.auto_enroll_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  sequence_record email_sequences%ROWTYPE;
BEGIN
  FOR sequence_record IN
    SELECT * FROM email_sequences
    WHERE trigger_type = 'lead_created' AND is_active = true
  LOOP
    PERFORM enroll_in_sequence(NEW.email, sequence_record.id);
  END LOOP;

  RETURN NEW;
END;
$function$;

-- audit_trigger_func
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  old_data_json JSONB;
  new_data_json JSONB;
  changed_cols TEXT[];
  col_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    new_data_json := to_jsonb(NEW);
    old_data_json := NULL;
    changed_cols := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    old_data_json := to_jsonb(OLD);
    new_data_json := to_jsonb(NEW);

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

    IF array_length(changed_cols, 1) IS NULL OR array_length(changed_cols, 1) = 0 THEN
      RETURN NEW;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    old_data_json := to_jsonb(OLD);
    new_data_json := NULL;
    changed_cols := NULL;
  END IF;

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
$function$;

-- set_audit_user
CREATE OR REPLACE FUNCTION public.set_audit_user(user_email text)
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  PERFORM set_config('app.current_user_email', user_email, true);
END;
$function$;

-- get_admin_setting
CREATE OR REPLACE FUNCTION public.get_admin_setting(setting_key text)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $function$
  SELECT value FROM admin_settings WHERE key = setting_key;
$function$;

-- notify_new_lead
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  base_url TEXT;
  notifications_enabled TEXT;
  service_role_key TEXT;
BEGIN
  SELECT value INTO notifications_enabled FROM admin_settings WHERE key = 'notifications_enabled';
  IF notifications_enabled != 'true' THEN
    RETURN NEW;
  END IF;

  SELECT value INTO base_url FROM admin_settings WHERE key = 'edge_function_base_url';

  BEGIN
    service_role_key := current_setting('app.service_role_key', true);
  EXCEPTION WHEN OTHERS THEN
    service_role_key := NULL;
  END;

  IF service_role_key IS NULL OR service_role_key = '' THEN
    RAISE NOTICE 'Service role key not configured. Skipping notification for lead %.', NEW.id;
    RETURN NEW;
  END IF;

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
  RAISE NOTICE 'Failed to send lead notification: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- notify_new_booking
CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  base_url TEXT;
  notifications_enabled TEXT;
  service_role_key TEXT;
BEGIN
  SELECT value INTO notifications_enabled FROM admin_settings WHERE key = 'notifications_enabled';
  IF notifications_enabled != 'true' THEN
    RETURN NEW;
  END IF;

  SELECT value INTO base_url FROM admin_settings WHERE key = 'edge_function_base_url';

  BEGIN
    service_role_key := current_setting('app.service_role_key', true);
  EXCEPTION WHEN OTHERS THEN
    service_role_key := NULL;
  END;

  IF service_role_key IS NULL OR service_role_key = '' THEN
    RAISE NOTICE 'Service role key not configured. Skipping notification for booking %.', NEW.id;
    RETURN NEW;
  END IF;

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
$function$;