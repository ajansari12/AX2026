/*
  # Add Missing Foreign Key Indexes

  This migration adds indexes on foreign key columns that were missing,
  which improves JOIN performance and query execution.

  ## Tables and Indexes Added:
  1. admin_users.added_by
  2. api_request_logs.api_key_id
  3. blog_posts.author_id
  4. bookings.lead_id
  5. chat_messages.conversation_id
  6. chat_ratings.conversation_id
  7. client_activity.client_id, project_id
  8. client_documents.client_id, project_id
  9. client_messages.client_id, parent_id, project_id
  10. client_training_progress.module_id
  11. clients.lead_id
  12. email_sends.sequence_id, step_id
  13. invoices.client_id, project_id
  14. lead_activity.lead_id
  15. lead_engagements.lead_id
  16. lead_notes.lead_id
  17. pipeline_stage_history.lead_id
  18. project_milestones.project_id
  19. projects.client_id
  20. proposal_views.proposal_id
  21. proposals.lead_id, template_id
  22. subscriber_sequences.sequence_id
  23. webhook_logs.webhook_id
*/

-- admin_users.added_by
CREATE INDEX IF NOT EXISTS idx_admin_users_added_by ON public.admin_users(added_by);

-- api_request_logs.api_key_id
CREATE INDEX IF NOT EXISTS idx_api_request_logs_api_key_id ON public.api_request_logs(api_key_id);

-- blog_posts.author_id
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);

-- bookings.lead_id
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON public.bookings(lead_id);

-- chat_messages.conversation_id
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);

-- chat_ratings.conversation_id
CREATE INDEX IF NOT EXISTS idx_chat_ratings_conversation_id ON public.chat_ratings(conversation_id);

-- client_activity.client_id and project_id
CREATE INDEX IF NOT EXISTS idx_client_activity_client_id ON public.client_activity(client_id);
CREATE INDEX IF NOT EXISTS idx_client_activity_project_id ON public.client_activity(project_id);

-- client_documents.client_id and project_id
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON public.client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_project_id ON public.client_documents(project_id);

-- client_messages.client_id, parent_id, project_id
CREATE INDEX IF NOT EXISTS idx_client_messages_client_id ON public.client_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_parent_id ON public.client_messages(parent_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_project_id ON public.client_messages(project_id);

-- client_training_progress.module_id
CREATE INDEX IF NOT EXISTS idx_client_training_progress_module_id ON public.client_training_progress(module_id);

-- clients.lead_id
CREATE INDEX IF NOT EXISTS idx_clients_lead_id ON public.clients(lead_id);

-- email_sends.sequence_id and step_id
CREATE INDEX IF NOT EXISTS idx_email_sends_sequence_id ON public.email_sends(sequence_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_step_id ON public.email_sends(step_id);

-- invoices.client_id and project_id
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON public.invoices(project_id);

-- lead_activity.lead_id
CREATE INDEX IF NOT EXISTS idx_lead_activity_lead_id ON public.lead_activity(lead_id);

-- lead_engagements.lead_id
CREATE INDEX IF NOT EXISTS idx_lead_engagements_lead_id ON public.lead_engagements(lead_id);

-- lead_notes.lead_id
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);

-- pipeline_stage_history.lead_id
CREATE INDEX IF NOT EXISTS idx_pipeline_stage_history_lead_id ON public.pipeline_stage_history(lead_id);

-- project_milestones.project_id
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);

-- projects.client_id
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);

-- proposal_views.proposal_id
CREATE INDEX IF NOT EXISTS idx_proposal_views_proposal_id ON public.proposal_views(proposal_id);

-- proposals.lead_id and template_id
CREATE INDEX IF NOT EXISTS idx_proposals_lead_id ON public.proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_template_id ON public.proposals(template_id);

-- subscriber_sequences.sequence_id
CREATE INDEX IF NOT EXISTS idx_subscriber_sequences_sequence_id ON public.subscriber_sequences(sequence_id);

-- webhook_logs.webhook_id
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON public.webhook_logs(webhook_id);