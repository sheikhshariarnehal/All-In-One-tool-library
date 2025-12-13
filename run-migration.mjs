// Script to apply the Image to PDF migration
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🔄 Running Image to PDF migration...');
  
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', '005_add_image_to_pdf_academic.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql doesn't exist, try direct insert
      console.log('⚠️ RPC not available, using direct insert...');
      
      const { error: insertError } = await supabase.from('tools').upsert({
        slug: 'image-to-pdf',
        name: 'Image to PDF',
        description: 'Upload multiple images and create a PDF. Drag & drop to reorder, adjust size, and rotate images. Perfect for creating documents from photos or scanned images.',
        short_description: 'Convert multiple images to PDF',
        category: 'academic',
        icon: 'FileImage',
        is_external: false,
        is_premium: false,
        is_active: true,
        usage_limit_free: 50,
        usage_limit_pro: 1000,
        features: [
          "Upload multiple images",
          "Drag & drop reordering",
          "Rotate images",
          "Zoom in/out",
          "Multiple page sizes",
          "Portrait/Landscape orientation",
          "Custom filename"
        ],
        tags: ['image', 'pdf', 'convert', 'jpg', 'png', 'photo', 'combine', 'merge', 'academic', 'document'],
        sort_order: 10,
        views_count: 0,
        metadata: {}
      });
      
      if (insertError) {
        console.error('❌ Error inserting tool:', insertError);
        process.exit(1);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('🎉 Image to PDF tool added to academic category');
    console.log('🔗 Access it at: http://localhost:3000/tools/academic/image-to-pdf');
  } catch (err) {
    console.error('❌ Error running migration:', err);
    process.exit(1);
  }
}

runMigration();
