/*
  # Drop Unused Indexes

  This migration removes indexes that are not being used,
  reducing storage overhead and maintenance costs.

  ## Indexes Dropped:
  1. idx_client_training_assignments_module_id - Not used
  2. idx_clients_auth_user_id - Not used
*/

DROP INDEX IF EXISTS public.idx_client_training_assignments_module_id;
DROP INDEX IF EXISTS public.idx_clients_auth_user_id;