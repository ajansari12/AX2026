/*
  # Create Case Studies Table

  1. New Tables
    - `case_studies`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `client` (text) - Client name
      - `industry` (text) - Client industry
      - `title` (text) - Case study title
      - `summary` (text) - Brief summary
      - `problem` (text) - Problem description
      - `solution` (text) - Solution description
      - `outcome` (text) - Main outcome
      - `outcome_details` (text[]) - Array of detailed outcomes
      - `image` (text) - Image URL
      - `tags` (text[]) - Array of tags
      - `stack` (text[]) - Technology stack used
      - `is_active` (boolean, default true) - Visibility flag
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `case_studies` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage case studies
*/

CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  client text NOT NULL,
  industry text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  problem text NOT NULL,
  solution text NOT NULL,
  outcome text NOT NULL,
  outcome_details text[] DEFAULT '{}',
  image text,
  tags text[] DEFAULT '{}',
  stack text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Case studies are publicly readable"
  ON case_studies FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage case studies"
  ON case_studies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_active ON case_studies(is_active);
CREATE INDEX IF NOT EXISTS idx_case_studies_sort_order ON case_studies(sort_order);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(industry);
