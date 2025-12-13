-- Add external tool support to tools table
-- This migration adds fields for external tools that redirect to other websites

-- Add new columns to tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS site_url TEXT,
ADD COLUMN IF NOT EXISTS is_external BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for external tools
CREATE INDEX IF NOT EXISTS idx_tools_is_external ON public.tools(is_external);
CREATE INDEX IF NOT EXISTS idx_tools_sort_order ON public.tools(sort_order);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_tools_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tools_updated_at ON public.tools;
CREATE TRIGGER trigger_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION update_tools_updated_at();

-- RLS policy for admin to manage tools
DROP POLICY IF EXISTS "Admins can manage all tools" ON public.tools;
CREATE POLICY "Admins can manage all tools"
  ON public.tools FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Demo data: insert some sample tools (internal + external). Use ON CONFLICT DO NOTHING to avoid duplicate inserts.
INSERT INTO public.tools (
  slug, name, description, short_description, category, icon, icon_url, site_url, is_external, is_premium, is_active, usage_limit_free, usage_limit_pro, features, tags, sort_order, views_count, metadata
) VALUES
  (
    'json-formatter',
    'JSON Formatter',
    'Format, validate, and beautify JSON data online',
    'Fast JSON formatting & validation',
    'developer',
    'Code',
    NULL,
    NULL,
    false,
    false,
    true,
    10,
    1000,
    '["Format JSON","Validate JSON","Beautify JSON"]'::jsonb,
    '{formatter,json,developer}',
    1,
    15234,
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tools (
  slug, name, description, short_description, category, icon, icon_url, site_url, is_external, is_premium, is_active, usage_limit_free, usage_limit_pro, features, tags, sort_order, views_count, metadata
) VALUES
  (
    'image-compressor',
    'Image Compressor',
    'Compress images and reduce file size without visible quality loss',
    'Compress images quickly',
    'ai-image',
    'Image',
    NULL,
    'https://imagecompressor.example.com',
    true,
    true,
    true,
    5,
    1000,
    '["Lossless compression","Batch compression","Resize images"]'::jsonb,
    '{images,compress,ai}',
    2,
    9876,
    '{"provider":"demo","notes":"External tool demo"}'::jsonb
  ) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tools (
  slug, name, description, short_description, category, icon, icon_url, site_url, is_external, is_premium, is_active, usage_limit_free, usage_limit_pro, features, tags, sort_order, views_count, metadata
) VALUES
  (
    'qr-code-generator',
    'QR Code Generator',
    'Create QR codes for URLs and text (PNG/SVG)',
    'Generate QR codes',
    'utilities',
    'Link',
    NULL,
    NULL,
    false,
    false,
    true,
    50,
    5000,
    '["URL QR","Text QR","PNG/SVG"]'::jsonb,
    '{qr,utilities,code}',
    3,
    6543,
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tools (
  slug, name, description, short_description, category, icon, icon_url, site_url, is_external, is_premium, is_active, usage_limit_free, usage_limit_pro, features, tags, sort_order, views_count, metadata
) VALUES
  (
    'citation-generator',
    'Citation Generator',
    'Generate citations in APA, MLA, Chicago, and more',
    'Cite sources quickly',
    'academic',
    'GraduationCap',
    NULL,
    NULL,
    false,
    false,
    true,
    25,
    1000,
    '["APA","MLA","Chicago"]'::jsonb,
    '{citation,academic,bibliography}',
    4,
    7654,
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tools (
  slug, name, description, short_description, category, icon, icon_url, site_url, is_external, is_premium, is_active, usage_limit_free, usage_limit_pro, features, tags, sort_order, views_count, metadata
) VALUES
  (
    'seo-audit',
    'SEO Audit',
    'Run a quick SEO audit to find on-page issues and performance improvements',
    'SEO insights & suggestions',
    'seo',
    'Search',
    NULL,
    'https://seo-audit.example.com',
    true,
    true,
    true,
    10,
    10000,
    '["Site scan","Meta tag check","Page speed analysis"]'::jsonb,
    '{seo,analysis,marketing}',
    5,
    2300,
    '{"demo":true}'::jsonb
  ) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tools (
  slug, name, description, short_description, category, icon, icon_url, site_url, is_external, is_premium, is_active, usage_limit_free, usage_limit_pro, features, tags, sort_order, views_count, metadata
) VALUES
  (
    'ai-upscaler',
    'AI Upscaler',
    'Upscale images using AI to increase resolution with minimal quality loss',
    'AI image upscaling',
    'ai',
    'Zap',
    NULL,
    'https://ai-upscaler.example.com',
    true,
    true,
    true,
    2,
    500,
    '["Upscale images","Batch processing","Face enhancement"]'::jsonb,
    '{ai,image,upscale}',
    6,
    1024,
    '{"provider":"demo-ai"}'::jsonb
  ) ON CONFLICT (slug) DO NOTHING;

-- End of demo data
