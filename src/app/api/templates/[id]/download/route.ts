import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user (optional)
    const { data: { user } } = await supabase.auth.getUser();

    // Get current download count and increment
    const { data: template } = await supabase
      .from("templates")
      .select("download_count")
      .eq("id", id)
      .single();

    if (template) {
      await supabase
        .from("templates")
        .update({ download_count: (template.download_count || 0) + 1 })
        .eq("id", id);
    }

    // Log download if user is authenticated
    if (user) {
      try {
        await supabase.from("template_downloads").insert({
          template_id: id,
          user_id: user.id,
        });
      } catch {
        // Ignore if table doesn't exist
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Download tracking error:", error);
    // Don't fail the request for tracking errors
    return NextResponse.json({ success: true });
  }
}
