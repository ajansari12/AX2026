/*
  # Add Chat Ratings Table

  This migration adds a table for storing chat conversation ratings
  to track user satisfaction with the AI assistant.

  1. New Table
    - `chat_ratings` - Stores thumbs up/down ratings with optional feedback

  2. Security
    - Allow anonymous users to insert ratings
    - Allow authenticated users to view all ratings
*/

CREATE TABLE IF NOT EXISTS chat_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for conversation lookup
CREATE INDEX IF NOT EXISTS chat_ratings_conversation_id_idx ON chat_ratings(conversation_id);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS chat_ratings_rating_idx ON chat_ratings(rating);
CREATE INDEX IF NOT EXISTS chat_ratings_created_at_idx ON chat_ratings(created_at DESC);

-- Enable RLS
ALTER TABLE chat_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert ratings
CREATE POLICY "Anyone can insert ratings"
  ON chat_ratings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can view all ratings
CREATE POLICY "Authenticated users can view ratings"
  ON chat_ratings FOR SELECT
  TO authenticated
  USING (true);

-- Add phone column to leads table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'phone'
  ) THEN
    ALTER TABLE leads ADD COLUMN phone TEXT;
  END IF;
END;
$$;