/*
  # Drop Unused Indexes

  1. Performance Improvements
    - Removes indexes that have never been used according to pg_stat_user_indexes
    - Reduces storage overhead and improves write performance

  2. Indexes Removed
    - admin_users_is_active_idx on admin_users
    - client_documents_pinned_at_idx on client_documents
    - client_documents_expires_at_idx on client_documents
    - idx_clients_invitation_token on clients
    - idx_clients_auth_user_id on clients
    - training_modules_category_idx on training_modules
    - training_modules_is_active_idx on training_modules
    - client_training_assignments_module_id_idx on client_training_assignments
    - client_training_progress_client_id_idx on client_training_progress
    - leads_created_at_idx on leads

  3. Notes
    - Using IF EXISTS to prevent errors if indexes don't exist
    - These indexes showed zero usage in database statistics
*/

DROP INDEX IF EXISTS admin_users_is_active_idx;

DROP INDEX IF EXISTS client_documents_pinned_at_idx;

DROP INDEX IF EXISTS client_documents_expires_at_idx;

DROP INDEX IF EXISTS idx_clients_invitation_token;

DROP INDEX IF EXISTS idx_clients_auth_user_id;

DROP INDEX IF EXISTS training_modules_category_idx;

DROP INDEX IF EXISTS training_modules_is_active_idx;

DROP INDEX IF EXISTS client_training_assignments_module_id_idx;

DROP INDEX IF EXISTS client_training_progress_client_id_idx;

DROP INDEX IF EXISTS leads_created_at_idx;
