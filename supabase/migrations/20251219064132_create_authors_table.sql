/*
  # Create Authors Table
  
  1. New Tables
    - `authors`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Author's name
      - `role` (text) - Author's role/title
      - `avatar_url` (text) - URL to author's avatar image
      - `bio` (text, nullable) - Author's biography
      - `created_at` (timestamptz) - When the author was added
      
  2. Security
    - Enable RLS on `authors` table
    - Public can read authors (needed for blog display)
    - Authenticated users can manage authors
*/

CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  avatar_url text NOT NULL,
  bio text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view authors"
  ON authors
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert authors"
  ON authors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update authors"
  ON authors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
