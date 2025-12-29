/*
  # Add Alternative Payment Methods to Invoices

  1. Changes to invoices table
    - `payment_method` - Type of payment (stripe, bank_transfer, check, cash, other)
    - `payment_instructions` - Instructions for non-Stripe payments (bank details, etc.)
    - `manual_payment_date` - Date when manual payment was recorded
    - `manual_payment_reference` - Reference number for manual payments
    - `payment_notes` - Additional notes about payment arrangements

  2. Notes
    - Allows admin to record alternative payment methods
    - Admin can manually mark invoices as paid for non-Stripe payments
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE invoices ADD COLUMN payment_method TEXT DEFAULT 'stripe' 
      CHECK (payment_method IN ('stripe', 'bank_transfer', 'check', 'cash', 'other'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'payment_instructions'
  ) THEN
    ALTER TABLE invoices ADD COLUMN payment_instructions TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'manual_payment_date'
  ) THEN
    ALTER TABLE invoices ADD COLUMN manual_payment_date DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'manual_payment_reference'
  ) THEN
    ALTER TABLE invoices ADD COLUMN manual_payment_reference TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'payment_notes'
  ) THEN
    ALTER TABLE invoices ADD COLUMN payment_notes TEXT;
  END IF;
END $$;