/*
  # Seed Client Activity History

  This migration backfills client_activity data based on existing records
  so clients can see their recent activity on the dashboard.

  1. Activities Seeded
    - Project created activities
    - Message sent/received activities
    - Login activity

  2. Important Notes
    - Only seeds data for existing records that don't have corresponding activities
    - Uses the original created_at timestamps for historical accuracy
*/

-- Seed project created activities for existing projects
INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata, created_at)
SELECT 
  p.client_id,
  p.id,
  'project_created',
  'New project started: ' || p.name,
  jsonb_build_object(
    'project_id', p.id,
    'project_name', p.name,
    'status', p.status
  ),
  p.created_at
FROM projects p
WHERE NOT EXISTS (
  SELECT 1 FROM client_activity ca 
  WHERE ca.project_id = p.id 
  AND ca.activity_type = 'project_created'
);

-- Seed message activities for existing messages
INSERT INTO client_activity (client_id, project_id, activity_type, description, metadata, created_at)
SELECT 
  m.client_id,
  m.project_id,
  CASE WHEN m.sender_type = 'client' THEN 'message_sent' ELSE 'message_received' END,
  CASE 
    WHEN m.sender_type = 'client' THEN 'You sent a message'
    ELSE 'New message from Axrategy'
  END,
  jsonb_build_object(
    'message_id', m.id,
    'sender_type', m.sender_type,
    'preview', LEFT(m.content, 50)
  ),
  m.created_at
FROM client_messages m
WHERE NOT EXISTS (
  SELECT 1 FROM client_activity ca 
  WHERE ca.metadata->>'message_id' = m.id::text
);

-- Seed a login activity for clients who have logged in
INSERT INTO client_activity (client_id, activity_type, description, created_at)
SELECT 
  c.id,
  'login',
  'Client logged in',
  c.last_login_at
FROM clients c
WHERE c.last_login_at IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM client_activity ca 
  WHERE ca.client_id = c.id 
  AND ca.activity_type = 'login'
  AND ca.created_at = c.last_login_at
);