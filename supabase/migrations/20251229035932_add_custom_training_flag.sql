/*
  # Add Custom Training Flag to Client Training Assignments

  1. Schema Changes
    - Add `is_custom` boolean column to `client_training_assignments` table
      - Defaults to true (assignments are custom by default since regular training is available to all)
    - Add `notes` text column for admin notes about the custom assignment
    - Add index on `is_custom` for efficient filtering

  2. Purpose
    - Distinguishes custom admin-assigned training from regular training
    - All active training modules are now visible to all clients by default
    - Custom assignments are additional/highlighted training for specific clients

  3. Notes
    - Existing assignments will be marked as custom (is_custom = true)
    - Regular training is accessed directly from training_modules table
*/

-- Add is_custom column to track custom assignments
ALTER TABLE client_training_assignments
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT true;

-- Add notes column for admin notes about the assignment
ALTER TABLE client_training_assignments
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create index for efficient filtering by custom status
CREATE INDEX IF NOT EXISTS client_training_assignments_is_custom_idx 
ON client_training_assignments(is_custom);

-- Update existing records to be marked as custom
UPDATE client_training_assignments
SET is_custom = true
WHERE is_custom IS NULL;