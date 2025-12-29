/*
  # Add auth_user_id to clients table

  1. Changes
    - Adds `auth_user_id` column to link clients to their Supabase auth users
    - This enables admin-created passwords to work with the portal login

  2. Notes
    - Column is nullable since existing clients may not have auth users yet
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE clients ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_clients_auth_user_id ON clients(auth_user_id);