import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Mock data for development
const mockPosts = [
  { id: "1", title: "Getting Started with JSON Formatting", slug: "getting-started-json-formatting", status: "published", author: "Admin", category: "Tutorial", views: 1234, content: "Learn how to format JSON...", createdAt: "2024-12-01", publishedAt: "2024-12-01" },
  { id: "2", title: "Best Practices for Image Compression", slug: "image-compression-best-practices", status: "published", author: "Admin", category: "Guide", views: 987, content: "Optimize your images...", createdAt: "2024-11-28", publishedAt: "2024-11-28" },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Verify admin role

    // In production, fetch from Supabase
    // const { data: posts, error } = await supabase
    //   .from("blog_posts")
    //   .select("*")
    //   .order("created_at", { ascending: false });

    return NextResponse.json({
      posts: mockPosts,
      total: mockPosts.length,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
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
    const { title, slug, content, category, status, excerpt } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In production, insert into Supabase
    // const { data, error } = await supabase
    //   .from("blog_posts")
    //   .insert({
    //     title,
    //     slug,
    //     content,
    //     category,
    //     status,
    //     excerpt,
    //     author_id: user.id,
    //     published_at: status === "published" ? new Date().toISOString() : null,
    //   })
    //   .select()
    //   .single();

    const newPost = {
      id: String(Date.now()),
      title,
      slug,
      content,
      category,
      status,
      author: "Admin",
      views: 0,
      createdAt: new Date().toISOString(),
      publishedAt: status === "published" ? new Date().toISOString() : null,
    };

    return NextResponse.json({ post: newPost });
  } catch (error) {
    console.error("Error creating blog post:", error);
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
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // In production, update in Supabase
    // const { data, error } = await supabase
    //   .from("blog_posts")
    //   .update(updates)
    //   .eq("id", id)
    //   .select()
    //   .single();

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error updating blog post:", error);
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
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // In production, delete from Supabase
    // const { error } = await supabase
    //   .from("blog_posts")
    //   .delete()
    //   .eq("id", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
