/*
  # Add Comprehensive Activity Logging

  This migration adds database triggers to automatically log client activities
  for the Recent Activity section in the client portal.

  1. New Triggers
    - `log_project_created` - Logs when a new project is created for a client
    - `log_project_status_change` - Logs when a project status changes
    - `log_milestone_completed` - Logs when a milestone is marked complete
    - `log_client_message_created` - Logs when a message is sent/received
    - `log_client_document_uploaded` - Logs when a document is uploaded
    - `log_invoice_created` - Logs when an invoice is created

  2. Security
    - All triggers use SECURITY DEFINER with explicit search_path
    - Activity is automatically linked to the correct client

  3. Important Notes
    - Existing triggers (login, document_view, invoice_view, invoice_paid) remain unchanged
    - Activities include helpful metadata for UI display
*/

-- ============================================
-- PROJECT CREATED TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION log_project_created()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata)
  VALUES (
    NEW.client_id,
    NEW.id,
    'project_created',
    'New project started: ' || NEW.name,
    jsonb_build_object(
      'project_id', NEW.id,
      'project_name', NEW.name,
      'status', NEW.status
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_project_created ON projects;
CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION log_project_created();

-- ============================================
-- PROJECT STATUS CHANGE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION log_project_status_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata)
    VALUES (
      NEW.client_id,
      NEW.id,
      'project_status_changed',
      'Project "' || NEW.name || '" status changed to ' || NEW.status,
      jsonb_build_object(
        'project_id', NEW.id,
        'project_name', NEW.name,
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_project_status_change ON projects;
CREATE TRIGGER on_project_status_change
  AFTER UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION log_project_status_change();

-- ============================================
-- MILESTONE COMPLETED TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION log_milestone_completed()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_client_id UUID;
  v_project_name TEXT;
BEGIN
  IF OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL THEN
    SELECT p.client_id, p.name INTO v_client_id, v_project_name
    FROM projects p
    WHERE p.id = NEW.project_id;
    
    IF v_client_id IS NOT NULL THEN
      INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata)
      VALUES (
        v_client_id,
        NEW.project_id,
        'milestone_completed',
        'Milestone completed: ' || NEW.title,
        jsonb_build_object(
          'milestone_id', NEW.id,
          'milestone_title', NEW.title,
          'project_id', NEW.project_id,
          'project_name', v_project_name
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_milestone_completed ON project_milestones;
CREATE TRIGGER on_milestone_completed
  AFTER UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION log_milestone_completed();

-- ============================================
-- CLIENT MESSAGE CREATED TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION log_client_message_created()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_project_name TEXT;
  v_description TEXT;
  v_activity_type TEXT;
BEGIN
  IF NEW.project_id IS NOT NULL THEN
    SELECT name INTO v_project_name FROM projects WHERE id = NEW.project_id;
  END IF;
  
  IF NEW.sender_type = 'client' THEN
    v_activity_type := 'message_sent';
    v_description := 'You sent a message';
  ELSE
    v_activity_type := 'message_received';
    v_description := 'New message from Axrategy';
  END IF;
  
  IF v_project_name IS NOT NULL THEN
    v_description := v_description || ' on "' || v_project_name || '"';
  END IF;
  
  INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata)
  VALUES (
    NEW.client_id,
    NEW.project_id,
    v_activity_type,
    v_description,
    jsonb_build_object(
      'message_id', NEW.id,
      'sender_type', NEW.sender_type,
      'project_id', NEW.project_id,
      'project_name', v_project_name,
      'preview', LEFT(NEW.content, 50)
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_client_message_created ON client_messages;
CREATE TRIGGER on_client_message_created
  AFTER INSERT ON client_messages
  FOR EACH ROW
  EXECUTE FUNCTION log_client_message_created();

-- ============================================
-- CLIENT DOCUMENT UPLOADED TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION log_client_document_uploaded()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_project_name TEXT;
BEGIN
  IF NEW.project_id IS NOT NULL THEN
    SELECT name INTO v_project_name FROM projects WHERE id = NEW.project_id;
  END IF;
  
  INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata)
  VALUES (
    NEW.client_id,
    NEW.project_id,
    'document_uploaded',
    'New document available: ' || NEW.name,
    jsonb_build_object(
      'document_id', NEW.id,
      'document_name', NEW.name,
      'category', NEW.category,
      'project_id', NEW.project_id,
      'project_name', v_project_name
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_client_document_uploaded ON client_documents;
CREATE TRIGGER on_client_document_uploaded
  AFTER INSERT ON client_documents
  FOR EACH ROW
  EXECUTE FUNCTION log_client_document_uploaded();

-- ============================================
-- INVOICE CREATED TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION log_invoice_created()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_project_name TEXT;
BEGIN
  IF NEW.project_id IS NOT NULL THEN
    SELECT name INTO v_project_name FROM projects WHERE id = NEW.project_id;
  END IF;
  
  INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata)
  VALUES (
    NEW.client_id,
    NEW.project_id,
    'invoice_created',
    'New invoice: ' || NEW.invoice_number || ' ($' || NEW.total_amount || ')',
    jsonb_build_object(
      'invoice_id', NEW.id,
      'invoice_number', NEW.invoice_number,
      'amount', NEW.total_amount,
      'project_id', NEW.project_id,
      'project_name', v_project_name
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_invoice_created ON invoices;
CREATE TRIGGER on_invoice_created
  AFTER INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION log_invoice_created();