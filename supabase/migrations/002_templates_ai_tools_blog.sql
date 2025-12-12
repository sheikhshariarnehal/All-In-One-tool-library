-- Migration: Add Templates, AI Tools, Blog Posts, and Admin Features
-- Version: 002
-- Date: 2024-12-12

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create templates storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'templates',
  'templates',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'application/zip', 'application/x-rar-compressed', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for templates bucket
CREATE POLICY "Allow public read access on templates bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'templates');

CREATE POLICY "Allow authenticated uploads to templates bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'templates');

CREATE POLICY "Allow service role full access to templates bucket"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'templates');

-- ============================================
-- TEMPLATES SYSTEM
-- ============================================

-- Template Categories
CREATE TABLE IF NOT EXISTS public.template_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.template_categories(id) ON DELETE SET NULL,
  file_url TEXT,
  preview_url TEXT,
  file_format TEXT NOT NULL, -- docx, xlsx, pptx, pdf, etc.
  file_size INTEGER, -- in bytes
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template Downloads tracking
CREATE TABLE IF NOT EXISTS public.template_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI TOOLS SYSTEM
-- ============================================

-- AI Tools catalog
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  features TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  daily_limit_free INTEGER DEFAULT 5,
  daily_limit_pro INTEGER DEFAULT 100,
  monthly_limit_enterprise INTEGER,
  model_provider TEXT DEFAULT 'openai', -- openai, anthropic, etc.
  model_name TEXT,
  system_prompt TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Tool Usage tracking
CREATE TABLE IF NOT EXISTS public.ai_tool_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ai_tool_id UUID REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  processing_time_ms INTEGER,
  status TEXT CHECK (status IN ('success', 'error', 'rate_limited')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User AI Tool Daily Limits
CREATE TABLE IF NOT EXISTS public.user_ai_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ai_tool_id UUID REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  UNIQUE(user_id, ai_tool_id, usage_date)
);

-- ============================================
-- BLOG SYSTEM
-- ============================================

-- Blog Categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Comments (optional)
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANNOUNCEMENTS SYSTEM
-- ============================================

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'maintenance')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'free', 'pro', 'enterprise', 'admin')),
  is_active BOOLEAN DEFAULT TRUE,
  is_dismissible BOOLEAN DEFAULT TRUE,
  display_location TEXT DEFAULT 'banner' CHECK (display_location IN ('banner', 'modal', 'toast', 'dashboard')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Dismissed Announcements
CREATE TABLE IF NOT EXISTS public.user_dismissed_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, announcement_id)
);

-- ============================================
-- ADMIN & ANALYTICS
-- ============================================

-- Admin Roles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'super_admin'));

-- Admin Activity Log
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT, -- 'user', 'tool', 'template', 'blog_post', etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Analytics Aggregation
CREATE TABLE IF NOT EXISTS public.daily_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_tool_uses INTEGER DEFAULT 0,
  total_ai_tool_uses INTEGER DEFAULT 0,
  total_template_downloads INTEGER DEFAULT 0,
  total_blog_views INTEGER DEFAULT 0,
  revenue_amount DECIMAL(10, 2) DEFAULT 0,
  new_subscriptions INTEGER DEFAULT 0,
  canceled_subscriptions INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (key-value store)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_active ON public.templates(is_active);
CREATE INDEX IF NOT EXISTS idx_template_downloads_template ON public.template_downloads(template_id);
CREATE INDEX IF NOT EXISTS idx_template_downloads_user ON public.template_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_template_downloads_date ON public.template_downloads(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON public.ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_active ON public.ai_tools(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_tool_usage_tool ON public.ai_tool_usage(ai_tool_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_usage_user ON public.ai_tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_usage_date ON public.ai_tool_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_user_ai_limits_lookup ON public.user_ai_limits(user_id, ai_tool_id, usage_date);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON public.announcements(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_admin_activity_admin ON public.admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_entity ON public.admin_activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_date ON public.admin_activity_log(created_at);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON public.daily_analytics(date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dismissed_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view active template categories"
  ON public.template_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view active templates"
  ON public.templates FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view active AI tools"
  ON public.ai_tools FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view active blog categories"
  ON public.blog_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Anyone can view active announcements"
  ON public.announcements FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND start_date <= NOW() AND (end_date IS NULL OR end_date >= NOW()));

-- Authenticated user policies
CREATE POLICY "Users can insert template downloads"
  ON public.template_downloads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own template downloads"
  ON public.template_downloads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own AI tool usage"
  ON public.ai_tool_usage FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own AI tool usage"
  ON public.ai_tool_usage FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own AI limits"
  ON public.user_ai_limits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own AI limits"
  ON public.user_ai_limits FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own dismissed announcements"
  ON public.user_dismissed_announcements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can dismiss announcements"
  ON public.user_dismissed_announcements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert approved comments"
  ON public.blog_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view approved comments"
  ON public.blog_comments FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Admin policies (using helper function)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('moderator', 'admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin full access policies
CREATE POLICY "Admins can manage template categories"
  ON public.template_categories FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage templates"
  ON public.templates FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage AI tools"
  ON public.ai_tools FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage blog categories"
  ON public.blog_categories FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Moderators can manage blog comments"
  ON public.blog_comments FOR ALL
  TO authenticated
  USING (public.is_moderator_or_admin());

CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can view all template downloads"
  ON public.template_downloads FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can view all AI usage"
  ON public.ai_tool_usage FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can view admin activity log"
  ON public.admin_activity_log FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert admin activity log"
  ON public.admin_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view daily analytics"
  ON public.daily_analytics FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at for new tables
CREATE TRIGGER update_template_categories_updated_at
  BEFORE UPDATE ON public.template_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ai_tools_updated_at
  BEFORE UPDATE ON public.ai_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to increment template download count
CREATE OR REPLACE FUNCTION public.increment_template_downloads()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.templates 
  SET download_count = download_count + 1 
  WHERE id = NEW.template_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_template_download
  AFTER INSERT ON public.template_downloads
  FOR EACH ROW EXECUTE FUNCTION public.increment_template_downloads();

-- Function to increment blog view count
CREATE OR REPLACE FUNCTION public.increment_blog_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.blog_posts 
  SET view_count = view_count + 1 
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA
-- ============================================

-- Seed Template Categories
INSERT INTO public.template_categories (slug, name, description, icon, color, display_order) VALUES
  ('research-papers', 'Research Papers', 'Academic research paper templates', 'FileText', 'blue', 1),
  ('thesis-dissertation', 'Thesis & Dissertation', 'Graduate-level document templates', 'GraduationCap', 'purple', 2),
  ('lab-reports', 'Lab Reports', 'Scientific lab report templates', 'FlaskConical', 'green', 3),
  ('essays', 'Essays', 'Essay templates for various formats', 'PenLine', 'orange', 4),
  ('resumes', 'Resumes & CVs', 'Professional resume and CV templates', 'Briefcase', 'indigo', 5),
  ('cover-letters', 'Cover Letters', 'Job application cover letters', 'Mail', 'cyan', 6),
  ('business-plans', 'Business Plans', 'Business plan and proposal templates', 'Building', 'pink', 7),
  ('presentations', 'Presentations', 'Slide deck templates', 'Presentation', 'amber', 8),
  ('reports', 'Business Reports', 'Professional report templates', 'FileBarChart', 'slate', 9),
  ('spreadsheets', 'Spreadsheets', 'Excel and calculation templates', 'Table', 'emerald', 10),
  ('legal', 'Legal Documents', 'Contracts and legal templates', 'Scale', 'red', 11),
  ('personal', 'Personal Documents', 'Personal and lifestyle templates', 'Heart', 'rose', 12)
ON CONFLICT (slug) DO NOTHING;

-- Seed AI Tools
INSERT INTO public.ai_tools (slug, name, description, icon, color, features, is_premium, daily_limit_free, daily_limit_pro) VALUES
  ('ai-essay-writer', 'AI Essay Writer', 'Generate well-structured essays on any topic', 'PenLine', 'bg-blue-500', ARRAY['Multiple essay types', 'Customizable length', 'Auto outline generation'], false, 5, 50),
  ('ai-paraphraser', 'AI Paraphraser', 'Rewrite text while maintaining meaning', 'RefreshCw', 'bg-green-500', ARRAY['Multiple modes', 'Academic tone', 'Side-by-side comparison'], false, 10, 100),
  ('ai-grammar-checker', 'AI Grammar & Tone Improver', 'Fix grammar and improve writing style', 'CheckCircle', 'bg-purple-500', ARRAY['Advanced correction', 'Tone adjustment', 'Clarity improvements'], false, 20, 200),
  ('ai-summarizer', 'AI Summarizer', 'Condense long content into summaries', 'FileSearch', 'bg-orange-500', ARRAY['Adjustable length', 'Key points extraction', 'Multiple formats'], false, 10, 100),
  ('ai-presentation-generator', 'AI Presentation Generator', 'Create presentation outlines', 'Presentation', 'bg-pink-500', ARRAY['Slide structuring', 'Speaker notes', 'Export options'], true, 3, 30),
  ('ai-citation-assistant', 'AI Citation Assistant', 'Generate citations from URLs and DOIs', 'BookOpen', 'bg-cyan-500', ARRAY['Auto source detection', 'Multiple styles', 'Batch processing'], false, 15, 150),
  ('ai-content-generator', 'AI Content Generator', 'Generate blog posts and marketing copy', 'Sparkles', 'bg-indigo-500', ARRAY['Multiple content types', 'SEO optimization', 'Tone customization'], true, 3, 30),
  ('ai-research-assistant', 'AI Research Assistant', 'Organize and analyze research', 'Brain', 'bg-violet-500', ARRAY['Theme extraction', 'Gap analysis', 'Question refinement'], true, 3, 30),
  ('ai-rewriter', 'AI Text Rewriter', 'Transform text completely', 'Wand2', 'bg-rose-500', ARRAY['Complete transformation', 'Multiple versions', 'Style adaptation'], false, 8, 80),
  ('ai-chat-assistant', 'AI Writing Assistant', 'Interactive writing help', 'MessageSquare', 'bg-amber-500', ARRAY['Brainstorming', 'Writing feedback', 'Idea generation'], true, 5, 50)
ON CONFLICT (slug) DO NOTHING;

-- Seed Blog Categories
INSERT INTO public.blog_categories (slug, name, description, icon, color, display_order) VALUES
  ('academic-writing', 'Academic Writing', 'Tips and guides for academic writing', 'GraduationCap', 'blue', 1),
  ('research-skills', 'Research Skills', 'Research methodologies and techniques', 'Search', 'purple', 2),
  ('professional-communication', 'Professional Communication', 'Business writing and communication', 'Briefcase', 'green', 3),
  ('productivity', 'Productivity', 'Tools and techniques for productivity', 'Zap', 'orange', 4),
  ('career-development', 'Career Development', 'Career tips and job search advice', 'TrendingUp', 'pink', 5),
  ('technology', 'Technology & Tools', 'Tech tutorials and tool guides', 'Cpu', 'cyan', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', '"Tool Library"', 'The name of the website'),
  ('site_description', '"Your All-in-One Academic & Professional Toolkit"', 'Site meta description'),
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
  ('registration_enabled', 'true', 'Allow new user registration'),
  ('free_tier_limits', '{"tools": 10, "ai_tools": 5, "templates": 5}', 'Daily limits for free tier'),
  ('pro_tier_limits', '{"tools": 1000, "ai_tools": 100, "templates": 100}', 'Daily limits for pro tier'),
  ('smtp_configured', 'false', 'Whether SMTP is configured for emails'),
  ('analytics_enabled', 'true', 'Enable analytics tracking')
ON CONFLICT (key) DO NOTHING;


-- Allow authenticated users to upload to templates bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'templates');

-- Allow public to read template files
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'templates');


-- Create templates storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('templates', 'templates', true, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read files
CREATE POLICY "Allow public read access on templates bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'templates');

-- Allow service role full access (for admin uploads)
CREATE POLICY "Allow service role full access to templates bucket"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'templates');