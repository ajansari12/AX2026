/*
  # Fix AI Chat Widget Price

  Corrects the AI Chat Widget subscription price from $199/mo to $99/mo.

  ## Changes
  - products: set price_cents = 9900 and price_display = '$99/mo' for the AI Chat Widget product

  ## Affected Rows
  - slug = 'ai-chat-widget'
  - Fallback name matches included for safety
*/

UPDATE products
SET
  price_cents = 9900,
  price_display = '$99/mo',
  updated_at = NOW()
WHERE slug = 'ai-chat-widget'
   OR name ILIKE '%AI Chat Widget%'
   OR name ILIKE '%chat widget%';
