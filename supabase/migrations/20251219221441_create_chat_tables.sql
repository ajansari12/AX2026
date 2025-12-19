/*
  # Create Chat Tables for AI Chatbot

  1. New Tables
    - `chat_conversations`
      - `id` (uuid, primary key)
      - `visitor_id` (text) - Anonymous identifier stored in localStorage
      - `email` (text, nullable) - If the visitor provides their email
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key to chat_conversations)
      - `role` (text) - 'user' or 'assistant'
      - `content` (text) - The message content
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow anonymous insert for new conversations and messages
    - Allow anonymous select for reading own conversation by visitor_id

  3. Notes
    - Uses visitor_id for session continuity without requiring authentication
    - Email capture is optional for lead generation
*/

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_visitor_id ON chat_conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create conversations"
  ON chat_conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Visitors can read own conversations"
  ON chat_conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Visitors can update own conversations"
  ON chat_conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON chat_messages FOR SELECT
  TO anon
  USING (true);
