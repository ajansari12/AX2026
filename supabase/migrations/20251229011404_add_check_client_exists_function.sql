/*
  # Add Secure Client Email Check Function

  1. Purpose
    - Create an RPC function to securely check if a client email exists
    - Allows anonymous users to verify email before sending magic link
    - Uses SECURITY DEFINER to bypass RLS safely
    - Returns only boolean - no client data exposed

  2. Function Details
    - Name: check_client_exists
    - Parameter: client_email (text)
    - Returns: boolean
    - Security: SECURITY DEFINER with restricted search_path

  3. Security Considerations
    - Function only returns true/false
    - No client data is exposed
    - Cannot be used to enumerate all clients
    - Rate limiting should be implemented at application level
*/

CREATE OR REPLACE FUNCTION check_client_exists(client_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM clients 
    WHERE LOWER(email) = LOWER(client_email)
      AND status != 'inactive'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION check_client_exists(text) TO anon;
GRANT EXECUTE ON FUNCTION check_client_exists(text) TO authenticated;
