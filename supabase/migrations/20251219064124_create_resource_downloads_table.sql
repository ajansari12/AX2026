/*
  # Create Resource Downloads Table
  
  1. New Tables
    - `resource_downloads`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text) - Downloader's email address
      - `resource_name` (text) - Name of the resource downloaded
      - `downloaded_at` (timestamptz) - When the download occurred
      
  2. Security
    - Enable RLS on `resource_downloads` table
    - Public can submit download requests
    - Authenticated users can read
    
  3. Notes
    - Tracks which lead magnets are popular
    - Links to newsletter_subscribers for unified email list
*/

CREATE TABLE IF NOT EXISTS resource_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  resource_name text NOT NULL,
  downloaded_at timestamptz DEFAULT now()
);

ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log resource downloads"
  ON resource_downloads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view resource downloads"
  ON resource_downloads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_downloads_email ON resource_downloads(email);
CREATE INDEX IF NOT EXISTS idx_downloads_resource ON resource_downloads(resource_name);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON resource_downloads(downloaded_at DESC);
