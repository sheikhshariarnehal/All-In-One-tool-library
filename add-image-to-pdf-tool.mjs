// Quick script to add Image to PDF tool via admin API
// Run this after logging in as admin in your browser

const toolData = {
  name: 'Image to PDF',
  slug: 'image-to-pdf',
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
  metadata: {}
};

async function addTool() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/tools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for sending cookies
      body: JSON.stringify(toolData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', result.error || 'Failed to add tool');
      console.log('Status:', response.status);
      if (response.status === 401 || response.status === 403) {
        console.log('\n⚠️  Make sure you are logged in as an admin first!');
        console.log('   1. Go to http://localhost:3000/auth/login');
        console.log('   2. Login with your admin account');
        console.log('   3. Then run this script again');
      }
      return;
    }

    console.log('✅ Tool added successfully!');
    console.log('🎉 Image to PDF is now available at:');
    console.log('   http://localhost:3000/tools/academic/image-to-pdf');
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   1. The dev server is running (npm run dev)');
    console.log('   2. You are logged in as admin in your browser');
  }
}

addTool();
