/*
  # Create Blog Posts Table
  
  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key) - Unique identifier
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Post title
      - `excerpt` (text) - Short summary for cards
      - `content` (text) - Full HTML content
      - `category` (text) - Post category (Strategy, Automation, AI, Design, Growth)
      - `read_time` (text) - Estimated read time
      - `published_date` (text) - Display date
      - `image_url` (text) - Featured image URL
      - `author_id` (uuid, FK) - Reference to authors table
      - `featured` (boolean) - Whether post is featured
      - `status` (text) - draft or published
      - `created_at` (timestamptz) - When post was created
      - `updated_at` (timestamptz) - When post was last updated
      
  2. Security
    - Enable RLS on `blog_posts` table
    - Public can read published posts
    - Authenticated users can manage all posts
    
  3. Indexes
    - Index on slug for URL lookups
    - Index on category for filtering
    - Index on status for separating drafts from published
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  read_time text NOT NULL,
  published_date text NOT NULL,
  image_url text NOT NULL,
  author_id uuid NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
  featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_published_date ON blog_posts(published_date DESC);
