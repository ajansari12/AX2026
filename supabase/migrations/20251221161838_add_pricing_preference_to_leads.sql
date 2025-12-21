/*
  # Add pricing preference to leads table

  1. Changes
    - Adds `pricing_preference` column to `leads` table
    - Column stores user's preferred pricing model: 'one_time', 'monthly', or 'undecided'
    - Defaults to 'undecided' for backwards compatibility

  2. Notes
    - This helps sales team understand prospect's budget preferences
    - Captured from contact form when user expresses interest in specific pricing model
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'pricing_preference'
  ) THEN
    ALTER TABLE leads ADD COLUMN pricing_preference text DEFAULT 'undecided';
  END IF;
END $$;
