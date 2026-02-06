/*
  # Fix product bundle sort order and blog published date

  1. Modified Tables
    - `product_bundle_items`: Add `sort_order` integer column (default 0) for controlling display order of products within bundles
    - `blog_posts`: Add `published_at` timestamptz column alongside existing text `published_date` for proper date sorting

  2. Data Updates
    - Backfill `sort_order` values for existing bundle items based on insertion order
    - Backfill `published_at` from existing `published_date` text values

  3. Indexes
    - Add index on `product_bundle_items(bundle_id, sort_order)` for ordered retrieval
    - Add index on `blog_posts(published_at)` for date-based sorting

  4. Important Notes
    - The original `published_date` text column is preserved for backward compatibility
    - No data is dropped or deleted
*/

-- Add sort_order to product_bundle_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_bundle_items' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE product_bundle_items ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;

-- Backfill sort_order based on creation order within each bundle
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY bundle_id ORDER BY id) - 1 AS rn
  FROM product_bundle_items
)
UPDATE product_bundle_items
SET sort_order = ordered.rn
FROM ordered
WHERE product_bundle_items.id = ordered.id;

-- Add composite index for ordered retrieval
CREATE INDEX IF NOT EXISTS idx_product_bundle_items_bundle_sort
  ON product_bundle_items(bundle_id, sort_order);

-- Add published_at timestamptz column to blog_posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN published_at timestamptz;
  END IF;
END $$;

-- Backfill published_at from the text published_date column
UPDATE blog_posts
SET published_at = published_date::timestamptz
WHERE published_date IS NOT NULL AND published_at IS NULL;

-- Add index for date-based sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
  ON blog_posts(published_at DESC);
