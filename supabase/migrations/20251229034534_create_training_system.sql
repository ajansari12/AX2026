/*
  # Create Training System Tables

  1. New Tables
    - `training_modules` - Stores training content that can be assigned to clients
      - `id` (uuid, primary key)
      - `title` (text) - Module title
      - `description` (text) - Module description
      - `category` (text) - getting-started, guides, videos, documentation
      - `type` (text) - video, article, document
      - `content_url` (text) - URL to video/document
      - `content_body` (text) - For articles, the HTML/markdown content
      - `duration` (text) - Duration for videos
      - `read_time` (text) - Read time for articles
      - `thumbnail_url` (text) - Optional thumbnail
      - `order_index` (int) - Sort order within category
      - `is_active` (boolean) - Whether module is available

    - `client_training_assignments` - Links modules to specific clients
      - `id` (uuid, primary key)
      - `client_id` (uuid) - Reference to client
      - `module_id` (uuid) - Reference to training module
      - `assigned_at` (timestamp) - When assigned
      - `assigned_by` (text) - Admin who assigned it

    - `client_training_progress` - Tracks client completion
      - `id` (uuid, primary key)
      - `client_id` (uuid) - Reference to client
      - `module_id` (uuid) - Reference to training module
      - `started_at` (timestamp) - When client started
      - `completed_at` (timestamp) - When completed
      - `progress_percent` (int) - Progress 0-100

  2. Security
    - Enable RLS on all tables
    - Clients can view assigned modules and their own progress
    - Admins have full access
*/

-- Training Modules Table
CREATE TABLE IF NOT EXISTS training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'guides' CHECK (category IN ('getting-started', 'guides', 'videos', 'documentation')),
  type TEXT DEFAULT 'article' CHECK (type IN ('video', 'article', 'document')),
  content_url TEXT,
  content_body TEXT,
  duration TEXT,
  read_time TEXT,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Training Assignments Table
CREATE TABLE IF NOT EXISTS client_training_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by TEXT,
  UNIQUE(client_id, module_id)
);

-- Client Training Progress Table
CREATE TABLE IF NOT EXISTS client_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, module_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS training_modules_category_idx ON training_modules(category);
CREATE INDEX IF NOT EXISTS training_modules_is_active_idx ON training_modules(is_active);
CREATE INDEX IF NOT EXISTS client_training_assignments_client_id_idx ON client_training_assignments(client_id);
CREATE INDEX IF NOT EXISTS client_training_assignments_module_id_idx ON client_training_assignments(module_id);
CREATE INDEX IF NOT EXISTS client_training_progress_client_id_idx ON client_training_progress(client_id);

-- Enable RLS
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_training_progress ENABLE ROW LEVEL SECURITY;

-- Training Modules Policies
CREATE POLICY "Anyone can view active training modules"
  ON training_modules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins full access to training modules"
  ON training_modules FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Client Training Assignments Policies
CREATE POLICY "Clients can view own assignments"
  ON client_training_assignments FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  ));

CREATE POLICY "Admins full access to assignments"
  ON client_training_assignments FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Client Training Progress Policies
CREATE POLICY "Clients can view own progress"
  ON client_training_progress FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  ));

CREATE POLICY "Clients can update own progress"
  ON client_training_progress FOR INSERT
  WITH CHECK (client_id IN (
    SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  ));

CREATE POLICY "Clients can modify own progress"
  ON client_training_progress FOR UPDATE
  USING (client_id IN (
    SELECT id FROM clients WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  ));

CREATE POLICY "Admins full access to progress"
  ON client_training_progress FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Update trigger for training_modules
DROP TRIGGER IF EXISTS update_training_modules_updated_at ON training_modules;
CREATE TRIGGER update_training_modules_updated_at
  BEFORE UPDATE ON training_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update trigger for client_training_progress
DROP TRIGGER IF EXISTS update_client_training_progress_updated_at ON client_training_progress;
CREATE TRIGGER update_client_training_progress_updated_at
  BEFORE UPDATE ON client_training_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert default training modules
INSERT INTO training_modules (title, description, category, type, duration, read_time, order_index) VALUES
  ('Welcome to Your Client Portal', 'Learn how to navigate your portal and access all features.', 'getting-started', 'video', '3 min', NULL, 1),
  ('Understanding Your Project Dashboard', 'Track milestones, view progress, and stay updated on your project status.', 'getting-started', 'video', '5 min', NULL, 2),
  ('Managing Documents & Assets', 'How to view, download, and organize your project documents.', 'guides', 'article', NULL, '4 min read', 1),
  ('Communicating with Your Team', 'Best practices for messaging and getting quick responses.', 'guides', 'article', NULL, '3 min read', 2),
  ('Paying Invoices Online', 'Secure payment options and viewing your billing history.', 'guides', 'article', NULL, '2 min read', 3),
  ('AI Assistant Setup Guide', 'Complete guide to setting up and configuring your AI assistant.', 'documentation', 'document', NULL, NULL, 1),
  ('Automation Workflow Documentation', 'Technical documentation for your custom automation workflows.', 'documentation', 'document', NULL, NULL, 2),
  ('Website CMS Training', 'Learn how to update content on your new website.', 'videos', 'video', '12 min', NULL, 1),
  ('Analytics Dashboard Overview', 'Understanding your metrics and KPIs.', 'videos', 'video', '8 min', NULL, 2)
ON CONFLICT DO NOTHING;