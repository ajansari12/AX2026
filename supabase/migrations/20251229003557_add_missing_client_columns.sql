/*
  # Add Missing Columns to Clients Table

  1. Changes
    - Add `status` column with enum constraint ('active', 'inactive', 'pending')
    - Add `notes` column for client notes
    - Add `company` column (alias for consistency with app code)
    - Migrate existing `company_name` data to `company` column
    - Drop the old `company_name` column

  2. Notes
    - The `name` column constraint is relaxed to allow empty strings (app handles defaults)
    - Default status is 'active' for new clients
*/

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'status'
  ) THEN
    ALTER TABLE clients ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));
  END IF;
END $$;

-- Add notes column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'notes'
  ) THEN
    ALTER TABLE clients ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Add company column if it doesn't exist (to replace company_name for consistency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'company'
  ) THEN
    ALTER TABLE clients ADD COLUMN company TEXT;
  END IF;
END $$;

-- Migrate data from company_name to company if company_name exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'company_name'
  ) THEN
    UPDATE clients SET company = company_name WHERE company IS NULL AND company_name IS NOT NULL;
    ALTER TABLE clients DROP COLUMN company_name;
  END IF;
END $$;

-- Make name column nullable (the app handles defaults)
ALTER TABLE clients ALTER COLUMN name DROP NOT NULL;