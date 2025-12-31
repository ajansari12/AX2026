/*
  # Fix Function Search Paths

  1. Security Improvements
    - Sets immutable search_path for functions to prevent search path injection attacks
    - Functions affected: is_admin, is_admin_by_uid

  2. Notes
    - Setting search_path to '' (empty) ensures functions use fully qualified names
    - This is a security best practice to prevent privilege escalation
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_whitelist
    WHERE LOWER(email) = LOWER(auth.jwt()->>'email')
    AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_by_uid(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_whitelist aw
    JOIN auth.users u ON LOWER(u.email) = LOWER(aw.email)
    WHERE u.id = user_id
    AND aw.is_active = true
  );
END;
$$;
