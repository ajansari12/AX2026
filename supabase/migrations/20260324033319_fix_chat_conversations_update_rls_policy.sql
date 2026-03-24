/*
  # Fix chat_conversations UPDATE RLS policy vulnerability

  ## Problem
  The existing "Visitors can update own conversations" policy used USING(true) and 
  WITH CHECK(true), which allowed any anonymous user to update any row in the table.
  A malicious visitor could overwrite other visitors' chat sessions.

  ## Fix
  Replace with a session-scoped policy that restricts updates to only the conversation
  whose visitor_id matches the x-visitor-id header sent by the client. If no header 
  is present, no rows are accessible for update.

  ## Security
  - Anonymous users can now only update conversations they own (matching visitor_id)
  - If visitor_id header is absent or mismatched, the update is rejected at DB level
  - NULL headers safely evaluate to NULL = NULL which is falsy, blocking all access
*/

DROP POLICY IF EXISTS "Visitors can update own conversations" ON public.chat_conversations;

CREATE POLICY "Visitors can update own conversations"
  ON public.chat_conversations
  FOR UPDATE
  TO anon
  USING (
    visitor_id IS NOT NULL
    AND visitor_id = (
      SELECT current_setting('request.headers', true)::json->>'x-visitor-id'
    )
  )
  WITH CHECK (
    visitor_id IS NOT NULL
    AND visitor_id = (
      SELECT current_setting('request.headers', true)::json->>'x-visitor-id'
    )
  );
