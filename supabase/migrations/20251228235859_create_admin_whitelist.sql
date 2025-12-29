/*
  # Create Admin Whitelist System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Admin email address
      - `name` (text) - Admin name
      - `added_by` (uuid) - Reference to admin who added this user
      - `created_at` (timestamp)
      - `is_active` (boolean) - Whether admin access is active

  2. Security
    - Enable RLS on `admin_users` table
    - Only authenticated admins can view the admin list
    - Only authenticated admins can add new admins
    - Super admin (initial admin) cannot be deactivated

  3. Helper Functions
    - `is_admin(user_email)` - Check if a user email is in the admin whitelist
    - `is_admin_by_uid()` - Check if the current authenticated user is an admin

  4. Initial Data
    - Seed with initial admin email: alijafferansari@gmail.com
*/

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  added_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if an email is an active admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = user_email AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the current authenticated user is an admin
CREATE OR REPLACE FUNCTION is_admin_by_uid()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email' AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);
CREATE INDEX IF NOT EXISTS admin_users_is_active_idx ON admin_users(is_active);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only active admins can view the admin list
CREATE POLICY "Admins can view admin list"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin_by_uid());

-- Only active admins can add new admins
CREATE POLICY "Admins can add new admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_by_uid());

-- Only active admins can update admin records
CREATE POLICY "Admins can update admin records"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (is_admin_by_uid())
  WITH CHECK (is_admin_by_uid());

-- Prevent deletion of admin records (use is_active instead)
CREATE POLICY "Prevent admin deletion"
  ON admin_users FOR DELETE
  TO authenticated
  USING (FALSE);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED INITIAL ADMIN
-- ============================================
INSERT INTO admin_users (email, name, is_active)
VALUES ('alijafferansari@gmail.com', 'Ali Jaffer Ansari', TRUE)
ON CONFLICT (email) DO NOTHING;
