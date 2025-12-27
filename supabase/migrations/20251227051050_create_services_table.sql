/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Service title
      - `description` (text) - Short description
      - `outcome` (text) - Expected outcome
      - `icon` (text) - Icon name for display
      - `tags` (text[]) - Array of tags
      - `features` (text[]) - Array of features
      - `timeline` (text) - Project timeline
      - `who_is_it_for` (text) - Target audience
      - `faq` (jsonb) - FAQ questions and answers
      - `is_active` (boolean, default true) - Visibility flag
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `services` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage services
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  outcome text NOT NULL,
  icon text NOT NULL,
  tags text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  timeline text NOT NULL,
  who_is_it_for text NOT NULL,
  faq jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are publicly readable"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
