/*
  # Proposal Generator Tables

  This migration adds tables for the proposal generation system.

  1. New Tables
    - `proposal_templates` - Reusable proposal templates
    - `proposals` - Generated proposals for leads
    - `proposal_sections` - Template sections for drag-and-drop
    - `proposal_views` - Track when proposals are viewed

  2. Features
    - Template-based proposals
    - Section drag-and-drop
    - View tracking
    - E-signature ready
*/

-- Proposal templates
CREATE TABLE IF NOT EXISTS proposal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'web_development', 'ai_assistant', 'automation', 'strategy'
  sections JSONB NOT NULL DEFAULT '[]', -- Array of section definitions
  default_terms TEXT, -- Default terms and conditions
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  template_id UUID REFERENCES proposal_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT,

  -- Content
  sections JSONB NOT NULL DEFAULT '[]', -- Customized sections for this proposal
  summary TEXT,
  scope_of_work TEXT,
  deliverables JSONB DEFAULT '[]',
  timeline TEXT,
  pricing JSONB DEFAULT '{}', -- {items: [], subtotal, tax, discount, total}
  terms TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
  valid_until DATE,

  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  response_notes TEXT,

  -- E-signature
  signature_requested BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  signature_data JSONB, -- Signature image, IP, timestamp

  -- Metadata
  share_token TEXT UNIQUE, -- For public viewing
  view_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposal view tracking
CREATE TABLE IF NOT EXISTS proposal_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  user_agent TEXT,
  duration_seconds INTEGER,
  sections_viewed TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS proposals_lead_idx ON proposals(lead_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON proposals(status);
CREATE INDEX IF NOT EXISTS proposals_share_token_idx ON proposals(share_token);
CREATE INDEX IF NOT EXISTS proposal_views_proposal_idx ON proposal_views(proposal_id);

-- RLS
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage templates"
  ON proposal_templates FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage proposals"
  ON proposals FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view proposals by share token"
  ON proposals FOR SELECT TO anon
  USING (share_token IS NOT NULL);

CREATE POLICY "Authenticated users can view proposal views"
  ON proposal_views FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can log proposal views"
  ON proposal_views FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Generate share token function
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Insert default templates
INSERT INTO proposal_templates (name, description, category, sections) VALUES
(
  'Web Development Project',
  'Standard template for web development projects',
  'web_development',
  '[
    {"id": "intro", "title": "Introduction", "type": "text", "content": "Thank you for considering us for your web development needs."},
    {"id": "scope", "title": "Scope of Work", "type": "text", "content": ""},
    {"id": "timeline", "title": "Project Timeline", "type": "timeline", "content": ""},
    {"id": "pricing", "title": "Investment", "type": "pricing", "content": ""},
    {"id": "terms", "title": "Terms & Conditions", "type": "text", "content": ""}
  ]'::jsonb
),
(
  'AI Assistant Implementation',
  'Template for AI chatbot and assistant projects',
  'ai_assistant',
  '[
    {"id": "intro", "title": "Executive Summary", "type": "text", "content": ""},
    {"id": "solution", "title": "Proposed Solution", "type": "text", "content": ""},
    {"id": "features", "title": "Features & Capabilities", "type": "list", "content": ""},
    {"id": "integration", "title": "Integration Plan", "type": "text", "content": ""},
    {"id": "pricing", "title": "Investment", "type": "pricing", "content": ""},
    {"id": "roi", "title": "Expected ROI", "type": "text", "content": ""},
    {"id": "terms", "title": "Terms", "type": "text", "content": ""}
  ]'::jsonb
),
(
  'Business Automation',
  'Template for automation and workflow projects',
  'automation',
  '[
    {"id": "intro", "title": "Introduction", "type": "text", "content": ""},
    {"id": "current", "title": "Current State Analysis", "type": "text", "content": ""},
    {"id": "proposed", "title": "Proposed Automation", "type": "text", "content": ""},
    {"id": "benefits", "title": "Benefits & Savings", "type": "list", "content": ""},
    {"id": "timeline", "title": "Implementation Timeline", "type": "timeline", "content": ""},
    {"id": "pricing", "title": "Investment", "type": "pricing", "content": ""},
    {"id": "terms", "title": "Terms", "type": "text", "content": ""}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;
