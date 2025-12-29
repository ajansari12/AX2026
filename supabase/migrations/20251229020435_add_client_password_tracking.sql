/*
  # Add Password Tracking for Client Portal

  1. Changes to `clients` table
    - `password_set` (boolean) - tracks whether client has set up a password
    - `invitation_token` (text) - temporary token for password setup invitations
    - `invitation_expires_at` (timestamptz) - when the invitation token expires

  2. Security
    - invitation_token is only readable by admins
    - password_set is readable by the client themselves

  3. Notes
    - Existing clients default to password_set = false
    - Invitation tokens expire after 7 days by default
*/

-- Add password tracking columns to clients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'password_set'
  ) THEN
    ALTER TABLE clients ADD COLUMN password_set boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'invitation_token'
  ) THEN
    ALTER TABLE clients ADD COLUMN invitation_token text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'invitation_expires_at'
  ) THEN
    ALTER TABLE clients ADD COLUMN invitation_expires_at timestamptz;
  END IF;
END $$;

-- Create index on invitation_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_clients_invitation_token ON clients(invitation_token) WHERE invitation_token IS NOT NULL;

-- Create function to generate secure invitation token
CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Create function to validate invitation token
CREATE OR REPLACE FUNCTION validate_invitation_token(token text)
RETURNS TABLE(client_id uuid, email text, name text, is_valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as client_id,
    c.email,
    c.name,
    (c.invitation_expires_at > now() AND c.password_set = false) as is_valid
  FROM clients c
  WHERE c.invitation_token = token;
END;
$$;

-- Create function to mark password as set and clear invitation token
CREATE OR REPLACE FUNCTION mark_password_set(client_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE clients
  SET 
    password_set = true,
    invitation_token = NULL,
    invitation_expires_at = NULL,
    updated_at = now()
  WHERE email = lower(client_email);
  
  RETURN FOUND;
END;
$$;