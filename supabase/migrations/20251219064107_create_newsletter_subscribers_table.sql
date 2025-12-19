/*
  # Create Newsletter Subscribers Table
  
  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, unique) - Subscriber's email address
      - `source` (text) - Where they subscribed from
      - `subscribed_at` (timestamptz) - When they subscribed
      - `is_active` (boolean) - Whether subscription is active
      
  2. Security
    - Enable RLS on `newsletter_subscribers` table
    - Public can insert new subscribers
    - Authenticated users can read and update
    
  3. Notes
    - Email is unique to prevent duplicate subscriptions
    - is_active allows for soft unsubscribe
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text NOT NULL DEFAULT 'website',
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at DESC);
