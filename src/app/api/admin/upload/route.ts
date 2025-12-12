import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Create admin client with service role for storage operations
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is not set");
    return null;
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Upload file to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string || "templates";
    const folder = formData.get("folder") as string || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = folder ? `${folder}/${timestamp}-${sanitizedName}` : `${timestamp}-${sanitizedName}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use admin client for storage operations (bypasses RLS)
    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: "Storage service not configured. Please set SUPABASE_SERVICE_ROLE_KEY." },
        { status: 500 }
      );
    }

    // Upload to Supabase Storage
    const { data, error } = await adminClient.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = adminClient.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      path: data.path,
      url: urlData.publicUrl,
      size: file.size,
      name: file.name,
      type: file.type,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
