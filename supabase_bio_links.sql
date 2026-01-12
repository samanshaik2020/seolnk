-- =============================================
-- Bio Links Feature - Database Schema
-- Create link-in-bio pages (like Linktree)
-- =============================================

-- Bio Pages table - The main bio page for each user
CREATE TABLE bio_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'default',
  theme_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  
  -- Social links (optional quick access)
  social_links JSONB DEFAULT '{}',
  
  -- Branding
  show_branding BOOLEAN DEFAULT true,
  custom_css TEXT
);

-- Bio Links table - Individual links on the bio page
CREATE TABLE bio_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  bio_page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  icon_type TEXT DEFAULT 'emoji', -- 'emoji', 'lucide', 'custom'
  thumbnail_url TEXT,
  animation TEXT DEFAULT 'none', -- 'none', 'pulse', 'bounce', 'shake'
  button_style TEXT DEFAULT 'default', -- 'default', 'outline', 'filled', 'gradient'
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  
  -- Optional: Link to seolnk short link for tracking
  short_link_id UUID,
  short_link_type TEXT -- 'alias', 'quick', 'preview', etc.
);

-- Bio Link Analytics - Track clicks on bio links
CREATE TABLE bio_link_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES bio_links(id) ON DELETE CASCADE NOT NULL,
  bio_page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT
);

-- Bio Page Views - Track page views
CREATE TABLE bio_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio_page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT
);

-- =============================================
-- Enable Row Level Security
-- =============================================

ALTER TABLE bio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_page_views ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Bio Pages Policies
-- =============================================

-- Public can view active bio pages (for the public bio page)
CREATE POLICY "Public can view active bio pages"
  ON bio_pages FOR SELECT
  USING (is_active = true);

-- Users can insert their own bio pages
CREATE POLICY "Users can insert their own bio pages"
  ON bio_pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bio pages
CREATE POLICY "Users can update their own bio pages"
  ON bio_pages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own bio pages
CREATE POLICY "Users can delete their own bio pages"
  ON bio_pages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- Bio Links Policies
-- =============================================

-- Public can view active links on active bio pages
CREATE POLICY "Public can view bio links"
  ON bio_links FOR SELECT
  USING (true);

-- Users can insert links to their own bio pages
CREATE POLICY "Users can insert their own bio links"
  ON bio_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bio_pages 
      WHERE bio_pages.id = bio_page_id 
      AND bio_pages.user_id = auth.uid()
    )
  );

-- Users can update their own bio links
CREATE POLICY "Users can update their own bio links"
  ON bio_links FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bio_pages 
      WHERE bio_pages.id = bio_page_id 
      AND bio_pages.user_id = auth.uid()
    )
  );

-- Users can delete their own bio links
CREATE POLICY "Users can delete their own bio links"
  ON bio_links FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bio_pages 
      WHERE bio_pages.id = bio_page_id 
      AND bio_pages.user_id = auth.uid()
    )
  );

-- =============================================
-- Analytics Policies
-- =============================================

-- Public can insert analytics (for tracking)
CREATE POLICY "Public can insert bio link analytics"
  ON bio_link_analytics FOR INSERT
  WITH CHECK (true);

-- Public can insert page views
CREATE POLICY "Public can insert bio page views"
  ON bio_page_views FOR INSERT
  WITH CHECK (true);

-- Users can view analytics for their own bio pages
CREATE POLICY "Users can view their bio link analytics"
  ON bio_link_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bio_pages 
      WHERE bio_pages.id = bio_page_id 
      AND bio_pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their bio page views"
  ON bio_page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bio_pages 
      WHERE bio_pages.id = bio_page_id 
      AND bio_pages.user_id = auth.uid()
    )
  );

-- =============================================
-- Indexes for Performance
-- =============================================

CREATE INDEX idx_bio_pages_user_id ON bio_pages(user_id);
CREATE INDEX idx_bio_pages_username ON bio_pages(username);
CREATE INDEX idx_bio_pages_active ON bio_pages(is_active);

CREATE INDEX idx_bio_links_bio_page_id ON bio_links(bio_page_id);
CREATE INDEX idx_bio_links_order ON bio_links(bio_page_id, order_index);
CREATE INDEX idx_bio_links_active ON bio_links(is_active);

CREATE INDEX idx_bio_link_analytics_link_id ON bio_link_analytics(link_id);
CREATE INDEX idx_bio_link_analytics_page_id ON bio_link_analytics(bio_page_id);
CREATE INDEX idx_bio_link_analytics_clicked_at ON bio_link_analytics(clicked_at);

CREATE INDEX idx_bio_page_views_page_id ON bio_page_views(bio_page_id);
CREATE INDEX idx_bio_page_views_viewed_at ON bio_page_views(viewed_at);

-- =============================================
-- Functions
-- =============================================

-- Function to increment bio page views
CREATE OR REPLACE FUNCTION increment_bio_page_views(page_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE bio_pages SET views = views + 1 WHERE id = page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment bio link clicks
CREATE OR REPLACE FUNCTION increment_bio_link_clicks(link_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE bio_links SET clicks = clicks + 1 WHERE id = link_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
