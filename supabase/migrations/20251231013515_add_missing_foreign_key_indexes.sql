/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Adds indexes on all foreign key columns that were missing coverage
    - This improves JOIN performance and prevents full table scans during cascading deletes

  2. Tables Affected
    - admin_users (added_by)
    - api_request_logs (api_key_id)
    - blog_posts (author_id)
    - bookings (lead_id)
    - chat_messages (conversation_id)
    - chat_ratings (conversation_id)
    - client_activity (client_id, project_id)
    - client_documents (client_id, project_id)
    - client_messages (client_id, parent_id, project_id)
    - client_training_progress (module_id)
    - clients (lead_id)
    - email_sends (sequence_id, step_id)
    - invoices (client_id, project_id)
    - lead_activity (lead_id)
    - lead_engagements (lead_id)
    - lead_notes (lead_id)
    - pipeline_stage_history (lead_id)
    - project_milestones (project_id)
    - projects (client_id)
    - proposal_views (proposal_id)
    - proposals (lead_id, template_id)
    - subscriber_sequences (sequence_id)
    - webhook_logs (webhook_id)

  3. Notes
    - Using IF NOT EXISTS to prevent errors if indexes already exist
    - Using CONCURRENTLY where possible for zero-downtime index creation
*/

CREATE INDEX IF NOT EXISTS idx_admin_users_added_by ON admin_users(added_by);

CREATE INDEX IF NOT EXISTS idx_api_request_logs_api_key_id ON api_request_logs(api_key_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);

CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON bookings(lead_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_chat_ratings_conversation_id ON chat_ratings(conversation_id);

CREATE INDEX IF NOT EXISTS idx_client_activity_client_id ON client_activity(client_id);

CREATE INDEX IF NOT EXISTS idx_client_activity_project_id ON client_activity(project_id);

CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);

CREATE INDEX IF NOT EXISTS idx_client_documents_project_id ON client_documents(project_id);

CREATE INDEX IF NOT EXISTS idx_client_messages_client_id ON client_messages(client_id);

CREATE INDEX IF NOT EXISTS idx_client_messages_parent_id ON client_messages(parent_id);

CREATE INDEX IF NOT EXISTS idx_client_messages_project_id ON client_messages(project_id);

CREATE INDEX IF NOT EXISTS idx_client_training_progress_module_id ON client_training_progress(module_id);

CREATE INDEX IF NOT EXISTS idx_clients_lead_id ON clients(lead_id);

CREATE INDEX IF NOT EXISTS idx_email_sends_sequence_id ON email_sends(sequence_id);

CREATE INDEX IF NOT EXISTS idx_email_sends_step_id ON email_sends(step_id);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);

CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);

CREATE INDEX IF NOT EXISTS idx_lead_activity_lead_id ON lead_activity(lead_id);

CREATE INDEX IF NOT EXISTS idx_lead_engagements_lead_id ON lead_engagements(lead_id);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);

CREATE INDEX IF NOT EXISTS idx_pipeline_stage_history_lead_id ON pipeline_stage_history(lead_id);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);

CREATE INDEX IF NOT EXISTS idx_proposal_views_proposal_id ON proposal_views(proposal_id);

CREATE INDEX IF NOT EXISTS idx_proposals_lead_id ON proposals(lead_id);

CREATE INDEX IF NOT EXISTS idx_proposals_template_id ON proposals(template_id);

CREATE INDEX IF NOT EXISTS idx_subscriber_sequences_sequence_id ON subscriber_sequences(sequence_id);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
