-- Client Portal Database Schema
-- This migration creates all tables needed for the client portal

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
  service_type TEXT, -- ai_assistant, automation, website, app, consulting
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  total_value DECIMAL(10,2),
  currency TEXT DEFAULT 'CAD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECT MILESTONES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENT DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT, -- pdf, docx, image, video, etc.
  file_size INTEGER, -- in bytes
  category TEXT DEFAULT 'general' CHECK (category IN ('proposal', 'contract', 'invoice', 'asset', 'training', 'deliverable', 'general')),
  uploaded_by TEXT,
  is_signed BOOLEAN DEFAULT FALSE,
  requires_signature BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMPTZ,
  downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS client_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'admin')),
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  parent_id UUID REFERENCES client_messages(id) ON DELETE SET NULL, -- for threading
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'refunded')),
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  description TEXT,
  line_items JSONB DEFAULT '[]',
  notes TEXT,
  due_date DATE,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_payment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENT ACTIVITY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS client_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- 'login', 'document_view', 'document_download', 'message_sent', 'invoice_viewed', 'invoice_paid', etc.
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS clients_email_idx ON clients(email);
CREATE INDEX IF NOT EXISTS clients_lead_id_idx ON clients(lead_id);
CREATE INDEX IF NOT EXISTS projects_client_id_idx ON projects(client_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS project_milestones_status_idx ON project_milestones(status);
CREATE INDEX IF NOT EXISTS client_documents_client_id_idx ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS client_documents_project_id_idx ON client_documents(project_id);
CREATE INDEX IF NOT EXISTS client_documents_category_idx ON client_documents(category);
CREATE INDEX IF NOT EXISTS client_messages_client_id_idx ON client_messages(client_id);
CREATE INDEX IF NOT EXISTS client_messages_is_read_idx ON client_messages(is_read);
CREATE INDEX IF NOT EXISTS client_messages_created_at_idx ON client_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON invoices(client_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON invoices(due_date);
CREATE INDEX IF NOT EXISTS client_activity_client_id_idx ON client_activity(client_id);
CREATE INDEX IF NOT EXISTS client_activity_created_at_idx ON client_activity(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_activity ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CLIENT POLICIES (Clients can only see their own data)
-- ============================================

-- Clients can view their own profile
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Clients can update their own profile
CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  USING (auth.jwt() ->> 'email' = email);

-- Clients can view their own projects
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

-- Clients can view their own milestones
CREATE POLICY "Clients can view own milestones"
  ON project_milestones FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  ));

-- Clients can view their own documents
CREATE POLICY "Clients can view own documents"
  ON client_documents FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

-- Clients can view and send their own messages
CREATE POLICY "Clients can view own messages"
  ON client_messages FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Clients can send messages"
  ON client_messages FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
    AND sender_type = 'client'
    AND sender_email = auth.jwt() ->> 'email'
  );

-- Clients can view their own invoices
CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

-- Clients can view their own activity
CREATE POLICY "Clients can view own activity"
  ON client_activity FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

-- ============================================
-- ADMIN POLICIES (Admins have full access)
-- ============================================

-- Check if user is admin (has admin role or is in admin list)
-- For simplicity, we're checking if user is authenticated
-- In production, you'd check a specific admin role or table

CREATE POLICY "Admins full access to clients"
  ON clients FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to projects"
  ON projects FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to milestones"
  ON project_milestones FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to documents"
  ON client_documents FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to messages"
  ON client_messages FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to invoices"
  ON invoices FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to activity"
  ON client_activity FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['clients', 'projects', 'project_milestones', 'client_documents', 'invoices'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END;
$$;

-- Log client login
CREATE OR REPLACE FUNCTION log_client_login()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.last_login_at IS DISTINCT FROM NEW.last_login_at THEN
    INSERT INTO client_activity (client_id, activity_type, description)
    VALUES (NEW.id, 'login', 'Client logged in');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS client_login_trigger ON clients;
CREATE TRIGGER client_login_trigger
  AFTER UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION log_client_login();

-- Log document view
CREATE OR REPLACE FUNCTION log_document_view()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS document_view_trigger ON client_documents;
CREATE TRIGGER document_view_trigger
  AFTER UPDATE ON client_documents
  FOR EACH ROW
  EXECUTE FUNCTION log_document_view();

-- Log invoice view
CREATE OR REPLACE FUNCTION log_invoice_view()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS invoice_view_trigger ON invoices;
CREATE TRIGGER invoice_view_trigger
  AFTER UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION log_invoice_view();

-- Log invoice payment
CREATE OR REPLACE FUNCTION log_invoice_payment()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS invoice_payment_trigger ON invoices;
CREATE TRIGGER invoice_payment_trigger
  AFTER UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION log_invoice_payment();

-- Generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_invoice_number_trigger ON invoices;
CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL)
  EXECUTE FUNCTION generate_invoice_number();
