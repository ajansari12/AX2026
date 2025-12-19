/*
  # Create Bookings Table
  
  1. New Tables
    - `bookings`
      - `id` (uuid, primary key) - Unique identifier
      - `cal_booking_id` (text, nullable) - External Cal.com booking ID
      - `name` (text) - Booker's name
      - `email` (text) - Booker's email
      - `scheduled_time` (timestamptz) - When the meeting is scheduled
      - `status` (text) - Booking status (scheduled, completed, cancelled, no_show)
      - `notes` (text, nullable) - Any notes about the booking
      - `lead_id` (uuid, nullable, FK) - Link to leads table if email matches
      - `created_at` (timestamptz) - When booking was created
      
  2. Security
    - Enable RLS on `bookings` table
    - Public can insert (for webhook/form submissions)
    - Authenticated users can read and update
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cal_booking_id text,
  name text NOT NULL,
  email text NOT NULL,
  scheduled_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON bookings(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON bookings(lead_id);
