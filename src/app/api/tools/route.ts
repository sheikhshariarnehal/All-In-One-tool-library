import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/tools - Get all active tools (public endpoint)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const slug = searchParams.get("slug")
    const search = searchParams.get("search")

    const supabase = await createClient()

    // Filter by slug (for single tool)
    if (slug) {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json({ error: "Tool not found" }, { status: 404 })
        }
        console.error("Error fetching tool:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Increment view count (fire and forget)
      supabase
        .from("tools")
        .update({ views_count: (data?.views_count || 0) + 1 })
        .eq("slug", slug)
        .then(() => {})

      return NextResponse.json(data)
    }

    // Build query for list
    let query = supabase
      .from("tools")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })

    // Filter by category
    if (category) {
      query = query.eq("category", category)
    }

    // Search by name or description
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching tools:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/tools/categories - Get categories with tool counts
export async function OPTIONS() {
  return NextResponse.json({ message: "OK" })
}
