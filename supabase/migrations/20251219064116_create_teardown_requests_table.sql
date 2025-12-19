/*
  # Create Teardown Requests Table
  
  1. New Tables
    - `teardown_requests`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text) - Requester's email address
      - `website_url` (text) - Website URL to analyze
      - `status` (text) - Request status (pending, in_progress, completed, sent)
      - `created_at` (timestamptz) - When the request was made
      
  2. Security
    - Enable RLS on `teardown_requests` table
    - Public can submit teardown requests
    - Authenticated users can read and update
    
  3. Notes
    - This tracks website audit/teardown requests from exit intent modal
*/

CREATE TABLE IF NOT EXISTS teardown_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  website_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teardown_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit teardown requests"
  ON teardown_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view teardown requests"
  ON teardown_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update teardown requests"
  ON teardown_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_teardown_email ON teardown_requests(email);
CREATE INDEX IF NOT EXISTS idx_teardown_created_at ON teardown_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_teardown_status ON teardown_requests(status);
