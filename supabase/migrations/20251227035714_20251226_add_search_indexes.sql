/*
  # Add Full-Text Search Indexes

  This migration adds GIN indexes for full-text search capabilities
  across leads and chat messages tables to enable fast search in the admin panel.

  1. New Indexes
    - `leads_search_idx` - Full-text search on leads (name, email, message)
    - `chat_messages_search_idx` - Full-text search on chat message content
    - `leads_status_idx` - B-tree index for status filtering
    - `leads_source_idx` - B-tree index for source filtering
    - `leads_created_at_idx` - B-tree index for date range queries

  2. Notes
    - Uses 'english' text search configuration
    - GIN indexes support fast full-text search queries
    - Uses to_tsvector for indexing text fields
    - coalesce handles NULL values gracefully
*/

-- Add full-text search index to leads table
-- Enables searching across name, email, and message fields
CREATE INDEX IF NOT EXISTS leads_search_idx
ON leads
USING GIN (
  to_tsvector(
    'english',
    coalesce(name, '') || ' ' ||
    coalesce(email, '') || ' ' ||
    coalesce(message, '')
  )
);

-- Add full-text search index to chat messages
-- Enables searching conversation content
CREATE INDEX IF NOT EXISTS chat_messages_search_idx
ON chat_messages
USING GIN (
  to_tsvector('english', content)
);

-- Add additional B-tree indexes for common filter operations
-- These improve performance for status and source filtering

-- Status filter index
CREATE INDEX IF NOT EXISTS leads_status_idx
ON leads (status);

-- Source filter index
CREATE INDEX IF NOT EXISTS leads_source_idx
ON leads (source);

-- Date range query index
CREATE INDEX IF NOT EXISTS leads_created_at_idx
ON leads (created_at DESC);

-- Compound index for common filter combinations
CREATE INDEX IF NOT EXISTS leads_status_source_idx
ON leads (status, source);

-- Index for newsletter subscribers search
CREATE INDEX IF NOT EXISTS newsletter_subscribers_search_idx
ON newsletter_subscribers
USING GIN (
  to_tsvector('english', email)
);

-- Index for bookings search
CREATE INDEX IF NOT EXISTS bookings_search_idx
ON bookings
USING GIN (
  to_tsvector(
    'english',
    coalesce(name, '') || ' ' ||
    coalesce(email, '')
  )
);

-- Add index for conversation email (for admin lookup)
CREATE INDEX IF NOT EXISTS chat_conversations_email_idx
ON chat_conversations (email)
WHERE email IS NOT NULL;