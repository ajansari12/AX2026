/*
  # Create Products & Purchases System

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `name` (text) - Display name
      - `tagline` (text) - Short one-liner
      - `description` (text) - Full description
      - `type` (text) - 'digital', 'subscription', or 'productized_service'
      - `category` (text) - 'micro_product', 'standalone_subscription', 'productized_service'
      - `price_cents` (integer) - Price in cents
      - `price_display` (text) - Formatted display price
      - `setup_fee_cents` (integer) - Optional setup fee
      - `billing_period` (text) - 'one_time', 'monthly', 'annual'
      - `industry` (text) - Target industry or 'all'
      - `icon` (text) - Lucide icon name
      - `features` (jsonb) - Array of feature strings
      - `proof_point` (text) - Case study reference
      - `cta_text` (text) - CTA button text
      - `sort_order` (integer) - Display ordering
      - `is_active` (boolean) - Visibility flag
      - `is_featured` (boolean) - Featured flag
      - `stripe_price_id` (text) - Stripe Price ID
      - `created_at` / `updated_at` (timestamptz)

    - `purchases`
      - `id` (uuid, primary key)
      - `product_id` (uuid, FK to products)
      - `customer_email` (text)
      - `customer_name` (text)
      - `status` (text) - pending/active/cancelled/completed
      - `stripe_session_id` / `stripe_subscription_id` (text)
      - `amount_cents` (integer)
      - `created_at` / `updated_at` (timestamptz)

  2. Security
    - RLS enabled on both tables
    - Products: public read for active items, admin write via admin_users check
    - Purchases: admin-only access via admin_users check

  3. Indexes
    - Products: slug, type, category, industry, active+sort
    - Purchases: product_id, customer_email, status
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'digital' CHECK (type IN ('digital', 'subscription', 'productized_service')),
  category text NOT NULL DEFAULT 'micro_product' CHECK (category IN ('micro_product', 'standalone_subscription', 'productized_service')),
  price_cents integer NOT NULL DEFAULT 0,
  price_display text NOT NULL DEFAULT '',
  setup_fee_cents integer NOT NULL DEFAULT 0,
  billing_period text NOT NULL DEFAULT 'one_time' CHECK (billing_period IN ('one_time', 'monthly', 'annual')),
  industry text NOT NULL DEFAULT 'all',
  icon text NOT NULL DEFAULT 'Package',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  proof_point text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT 'Get Started',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  stripe_price_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON products (type);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_industry ON products (industry);
CREATE INDEX IF NOT EXISTS idx_products_active_sort ON products (is_active, sort_order);

CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  customer_email text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'completed')),
  stripe_session_id text,
  stripe_subscription_id text,
  amount_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can insert purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update purchases"
  ON purchases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT auth.jwt() ->> 'email')
      AND admin_users.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases (product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON purchases (customer_email);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases (status);
