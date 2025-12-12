import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Mock data for development
const mockAnnouncements = [
  { id: "1", title: "System Maintenance Scheduled", message: "We will be performing maintenance on Saturday from 2-4 AM UTC.", type: "warning", status: "active", showOnHomepage: true, createdAt: "2024-12-12" },
  { id: "2", title: "New Image Compressor Tool", message: "Check out our new AI-powered image compressor with 90% size reduction!", type: "info", status: "active", showOnHomepage: true, createdAt: "2024-12-10" },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, fetch from Supabase
    // const { data: announcements, error } = await supabase
    //   .from("announcements")
    //   .select("*")
    //   .order("created_at", { ascending: false });

    return NextResponse.json({
      announcements: mockAnnouncements,
      total: mockAnnouncements.length,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type, showOnHomepage } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In production, insert into Supabase
    // const { data, error } = await supabase
    //   .from("announcements")
    //   .insert({
    //     title,
    //     message,
    //     type: type || "info",
    //     show_on_homepage: showOnHomepage || false,
    //     status: "active",
    //     created_by: user.id,
    //   })
    //   .select()
    //   .single();

    const newAnnouncement = {
      id: String(Date.now()),
      title,
      message,
      type: type || "info",
      status: "active",
      showOnHomepage: showOnHomepage || false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json({ announcement: newAnnouncement });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 });
    }

    // In production, update in Supabase
    // const { data, error } = await supabase
    //   .from("announcements")
    //   .update(updates)
    //   .eq("id", id)
    //   .select()
    //   .single();

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 });
    }

    // In production, delete from Supabase
    // const { error } = await supabase
    //   .from("announcements")
    //   .delete()
    //   .eq("id", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
