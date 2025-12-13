-- ==================================================================
-- Quick SQL to add Image to PDF tool to academic category
-- ==================================================================
-- 
-- How to use:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Paste this entire script and click "Run"
-- 5. Refresh your app at http://localhost:3000/tools/academic/image-to-pdf
--
-- ==================================================================

INSERT INTO public.tools (
  slug, 
  name, 
  description, 
  short_description, 
  category, 
  icon, 
  icon_url, 
  site_url, 
  is_external, 
  is_premium, 
  is_active, 
  usage_limit_free, 
  usage_limit_pro, 
  features, 
  tags, 
  sort_order, 
  views_count, 
  metadata,
  created_at
) VALUES (
  'image-to-pdf',
  'Image to PDF',
  'Upload multiple images and create a PDF. Drag & drop to reorder, adjust size, and rotate images. Perfect for creating documents from photos or scanned images.',
  'Convert multiple images to PDF',
  'academic',
  'FileImage',
  NULL,
  NULL,
  false,
  false,
  true,
  50,
  1000,
  '["Upload multiple images","Drag & drop reordering","Rotate images","Zoom in/out","Multiple page sizes","Portrait/Landscape orientation","Custom filename"]'::jsonb,
  '{image,pdf,convert,jpg,png,photo,combine,merge,academic,document}',
  10,
  0,
  '{}'::jsonb,
  NOW()
) 
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  is_external = EXCLUDED.is_external,
  is_premium = EXCLUDED.is_premium,
  is_active = EXCLUDED.is_active,
  features = EXCLUDED.features,
  tags = EXCLUDED.tags,
  usage_limit_free = EXCLUDED.usage_limit_free,
  usage_limit_pro = EXCLUDED.usage_limit_pro,
  updated_at = NOW();

-- Verify the tool was added
SELECT 
  slug, 
  name, 
  category, 
  is_active,
  created_at
FROM public.tools 
WHERE slug = 'image-to-pdf';
