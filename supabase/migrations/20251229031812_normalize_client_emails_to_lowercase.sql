/*
  # Normalize Client Emails to Lowercase

  1. Problem
    - Some client emails were stored with mixed case (e.g., "User@Example.com")
    - The login flow normalizes emails to lowercase for comparison
    - This causes case-sensitive mismatches preventing successful login

  2. Solution
    - Update all existing client emails to lowercase
    - This ensures consistent email storage and matching

  3. Changes Made
    - Updates all rows in clients table where email != LOWER(email)
    - No data loss - only changes email casing

  4. Safety
    - Uses WHERE clause to only update records that need changing
    - Idempotent - safe to run multiple times
*/

UPDATE clients
SET 
  email = LOWER(email),
  updated_at = NOW()
WHERE email != LOWER(email);
