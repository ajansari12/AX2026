/*
  # Drop Unused Indexes

  ## Overview
  This migration removes indexes that have never been used according to database statistics.
  Unused indexes waste storage space and slow down write operations without providing
  any query performance benefit.

  ## Important Notes
  - These indexes were identified as unused through pg_stat_user_indexes
  - If any of these indexes become needed in the future, they can be recreated
  - Dropping unused indexes improves INSERT/UPDATE/DELETE performance
  - Also removes duplicate index on leads table (idx_leads_created_at duplicates leads_created_at_idx)

  ## Indexes Removed by Table
  - newsletter_subscribers: idx_subscribers_email, newsletter_subscribers_tags_idx, newsletter_subscribers_search_idx
  - blog_posts: idx_blog_slug, idx_blog_category, idx_blog_featured, blog_posts_author_id_idx
  - teardown_requests: idx_teardown_email, idx_teardown_status
  - chat_conversations: idx_chat_conversations_visitor_id, chat_conversations_email_idx
  - chat_messages: idx_chat_messages_conversation_id, chat_messages_search_idx
  - resource_downloads: idx_downloads_email, idx_downloads_resource
  - bookings: idx_bookings_email, idx_bookings_status, idx_bookings_lead_id, bookings_search_idx
  - chat_ratings: chat_ratings_conversation_id_idx, chat_ratings_rating_idx, chat_ratings_created_at_idx
  - lead_notes: lead_notes_lead_id_idx, lead_notes_created_at_idx
  - lead_activity: lead_activity_lead_id_idx, lead_activity_created_at_idx, lead_activity_type_idx
  - leads: leads_score_idx, leads_pipeline_stage_idx, leads_search_idx, leads_status_idx, leads_source_idx, 
           leads_created_at_idx (duplicate), leads_status_source_idx
  - lead_engagements: lead_engagements_lead_id_idx, lead_engagements_type_idx, lead_engagements_created_idx
  - pipeline_stage_history: pipeline_history_lead_idx, pipeline_history_created_idx
  - proposals: proposals_lead_idx, proposals_status_idx, proposals_share_token_idx, proposals_template_id_idx
  - proposal_views: proposal_views_proposal_idx
  - clients: clients_email_idx, clients_lead_id_idx
  - projects: projects_client_id_idx, projects_status_idx
  - project_milestones: project_milestones_project_id_idx, project_milestones_status_idx
  - client_documents: client_documents_client_id_idx, client_documents_project_id_idx, client_documents_category_idx
  - client_messages: client_messages_client_id_idx, client_messages_is_read_idx, client_messages_created_at_idx,
                     client_messages_parent_id_idx, client_messages_project_id_idx
  - invoices: invoices_client_id_idx, invoices_status_idx, invoices_due_date_idx, invoices_project_id_idx
  - client_activity: client_activity_client_id_idx, client_activity_created_at_idx, client_activity_project_id_idx
  - integrations: integrations_name_idx
  - webhooks: webhooks_enabled_idx
  - webhook_logs: webhook_logs_webhook_idx, webhook_logs_created_idx
  - api_keys: api_keys_prefix_idx
  - api_request_logs: api_request_logs_key_idx, api_request_logs_created_idx
  - audit_log: audit_log_table_name_idx, audit_log_record_id_idx, audit_log_action_idx, 
               audit_log_actor_email_idx, audit_log_created_at_idx, audit_log_table_action_idx
  - email_sequences: email_sequences_trigger_idx, email_sequences_active_idx
  - email_sequence_steps: email_sequence_steps_sequence_idx
  - email_sends: email_sends_recipient_idx, email_sends_status_idx, email_sends_created_idx,
                 email_sends_sequence_id_idx, email_sends_step_id_idx
  - subscriber_sequences: subscriber_sequences_email_idx, subscriber_sequences_status_idx,
                          subscriber_sequences_next_email_idx, subscriber_sequences_sequence_id_idx
  - case_studies: idx_case_studies_industry, idx_case_studies_slug, idx_case_studies_active
  - services: idx_services_slug, idx_services_active, idx_services_sort_order
*/

-- newsletter_subscribers
DROP INDEX IF EXISTS idx_subscribers_email;
DROP INDEX IF EXISTS newsletter_subscribers_tags_idx;
DROP INDEX IF EXISTS newsletter_subscribers_search_idx;

-- blog_posts
DROP INDEX IF EXISTS idx_blog_slug;
DROP INDEX IF EXISTS idx_blog_category;
DROP INDEX IF EXISTS idx_blog_featured;
DROP INDEX IF EXISTS blog_posts_author_id_idx;

-- teardown_requests
DROP INDEX IF EXISTS idx_teardown_email;
DROP INDEX IF EXISTS idx_teardown_status;

-- chat_conversations
DROP INDEX IF EXISTS idx_chat_conversations_visitor_id;
DROP INDEX IF EXISTS chat_conversations_email_idx;

-- chat_messages
DROP INDEX IF EXISTS idx_chat_messages_conversation_id;
DROP INDEX IF EXISTS chat_messages_search_idx;

-- resource_downloads
DROP INDEX IF EXISTS idx_downloads_email;
DROP INDEX IF EXISTS idx_downloads_resource;

-- bookings
DROP INDEX IF EXISTS idx_bookings_email;
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_bookings_lead_id;
DROP INDEX IF EXISTS bookings_search_idx;

-- chat_ratings
DROP INDEX IF EXISTS chat_ratings_conversation_id_idx;
DROP INDEX IF EXISTS chat_ratings_rating_idx;
DROP INDEX IF EXISTS chat_ratings_created_at_idx;

-- lead_notes
DROP INDEX IF EXISTS lead_notes_lead_id_idx;
DROP INDEX IF EXISTS lead_notes_created_at_idx;

-- lead_activity
DROP INDEX IF EXISTS lead_activity_lead_id_idx;
DROP INDEX IF EXISTS lead_activity_created_at_idx;
DROP INDEX IF EXISTS lead_activity_type_idx;

-- leads (including duplicate idx_leads_created_at)
DROP INDEX IF EXISTS leads_score_idx;
DROP INDEX IF EXISTS leads_pipeline_stage_idx;
DROP INDEX IF EXISTS leads_search_idx;
DROP INDEX IF EXISTS leads_status_idx;
DROP INDEX IF EXISTS leads_source_idx;
DROP INDEX IF EXISTS idx_leads_created_at;
DROP INDEX IF EXISTS leads_status_source_idx;

-- lead_engagements
DROP INDEX IF EXISTS lead_engagements_lead_id_idx;
DROP INDEX IF EXISTS lead_engagements_type_idx;
DROP INDEX IF EXISTS lead_engagements_created_idx;

-- pipeline_stage_history
DROP INDEX IF EXISTS pipeline_history_lead_idx;
DROP INDEX IF EXISTS pipeline_history_created_idx;

-- proposals
DROP INDEX IF EXISTS proposals_lead_idx;
DROP INDEX IF EXISTS proposals_status_idx;
DROP INDEX IF EXISTS proposals_share_token_idx;
DROP INDEX IF EXISTS proposals_template_id_idx;

-- proposal_views
DROP INDEX IF EXISTS proposal_views_proposal_idx;

-- clients
DROP INDEX IF EXISTS clients_email_idx;
DROP INDEX IF EXISTS clients_lead_id_idx;

-- projects
DROP INDEX IF EXISTS projects_client_id_idx;
DROP INDEX IF EXISTS projects_status_idx;

-- project_milestones
DROP INDEX IF EXISTS project_milestones_project_id_idx;
DROP INDEX IF EXISTS project_milestones_status_idx;

-- client_documents
DROP INDEX IF EXISTS client_documents_client_id_idx;
DROP INDEX IF EXISTS client_documents_project_id_idx;
DROP INDEX IF EXISTS client_documents_category_idx;

-- client_messages
DROP INDEX IF EXISTS client_messages_client_id_idx;
DROP INDEX IF EXISTS client_messages_is_read_idx;
DROP INDEX IF EXISTS client_messages_created_at_idx;
DROP INDEX IF EXISTS client_messages_parent_id_idx;
DROP INDEX IF EXISTS client_messages_project_id_idx;

-- invoices
DROP INDEX IF EXISTS invoices_client_id_idx;
DROP INDEX IF EXISTS invoices_status_idx;
DROP INDEX IF EXISTS invoices_due_date_idx;
DROP INDEX IF EXISTS invoices_project_id_idx;

-- client_activity
DROP INDEX IF EXISTS client_activity_client_id_idx;
DROP INDEX IF EXISTS client_activity_created_at_idx;
DROP INDEX IF EXISTS client_activity_project_id_idx;

-- integrations
DROP INDEX IF EXISTS integrations_name_idx;

-- webhooks
DROP INDEX IF EXISTS webhooks_enabled_idx;

-- webhook_logs
DROP INDEX IF EXISTS webhook_logs_webhook_idx;
DROP INDEX IF EXISTS webhook_logs_created_idx;

-- api_keys
DROP INDEX IF EXISTS api_keys_prefix_idx;

-- api_request_logs
DROP INDEX IF EXISTS api_request_logs_key_idx;
DROP INDEX IF EXISTS api_request_logs_created_idx;

-- audit_log
DROP INDEX IF EXISTS audit_log_table_name_idx;
DROP INDEX IF EXISTS audit_log_record_id_idx;
DROP INDEX IF EXISTS audit_log_action_idx;
DROP INDEX IF EXISTS audit_log_actor_email_idx;
DROP INDEX IF EXISTS audit_log_created_at_idx;
DROP INDEX IF EXISTS audit_log_table_action_idx;

-- email_sequences
DROP INDEX IF EXISTS email_sequences_trigger_idx;
DROP INDEX IF EXISTS email_sequences_active_idx;

-- email_sequence_steps
DROP INDEX IF EXISTS email_sequence_steps_sequence_idx;

-- email_sends
DROP INDEX IF EXISTS email_sends_recipient_idx;
DROP INDEX IF EXISTS email_sends_status_idx;
DROP INDEX IF EXISTS email_sends_created_idx;
DROP INDEX IF EXISTS email_sends_sequence_id_idx;
DROP INDEX IF EXISTS email_sends_step_id_idx;

-- subscriber_sequences
DROP INDEX IF EXISTS subscriber_sequences_email_idx;
DROP INDEX IF EXISTS subscriber_sequences_status_idx;
DROP INDEX IF EXISTS subscriber_sequences_next_email_idx;
DROP INDEX IF EXISTS subscriber_sequences_sequence_id_idx;

-- case_studies
DROP INDEX IF EXISTS idx_case_studies_industry;
DROP INDEX IF EXISTS idx_case_studies_slug;
DROP INDEX IF EXISTS idx_case_studies_active;

-- services
DROP INDEX IF EXISTS idx_services_slug;
DROP INDEX IF EXISTS idx_services_active;
DROP INDEX IF EXISTS idx_services_sort_order;