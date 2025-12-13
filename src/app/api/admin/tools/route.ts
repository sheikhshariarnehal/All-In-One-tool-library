import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper to check admin access
async function checkAdminAccess(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error("Auth error:", authError);
    return { authorized: false, error: "Authentication error", status: 401 };
  }
  
  if (!user) {
    console.log("No user found in session");
    return { authorized: false, error: "Not authenticated. Please log in.", status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    return { authorized: false, error: "Failed to fetch user profile", status: 500 };
  }

  if (!profile) {
    console.log("No profile found for user:", user.id);
    return { authorized: false, error: "User profile not found", status: 403 };
  }

  const isAdmin = ["admin", "super_admin"].includes(profile.role);
  
  if (!isAdmin) {
    console.log("User role is not admin:", profile.role);
    return { authorized: false, error: `Access denied. Admin role required. Your role: ${profile.role}`, status: 403 };
  }

  return { authorized: true, user, profile };
}

// GET - Fetch all tools
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const auth = await checkAdminAccess(supabase);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Fetch all tools
    const { data: tools, error } = await supabase
      .from("tools")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tools:", error);
      return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }

    // Get usage counts separately
    const { data: usageCounts } = await supabase
      .from("tool_usage")
      .select("tool_id")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        data?.forEach(usage => {
          counts[usage.tool_id] = (counts[usage.tool_id] || 0) + 1;
        });
        return { data: counts };
      });

    // Transform the data
    const transformedTools = tools?.map(tool => ({
      ...tool,
      usage_count: usageCounts?.[tool.id] || 0,
    })) || [];

    const stats = {
      totalTools: transformedTools.length,
      activeTools: transformedTools.filter(t => t.is_active).length,
      premiumTools: transformedTools.filter(t => t.is_premium).length,
      externalTools: transformedTools.filter(t => t.is_external).length,
      totalUsage: Object.values(usageCounts || {}).reduce((a: number, b: number) => a + b, 0),
    };

    return NextResponse.json({ tools: transformedTools, stats });
  } catch (error) {
    console.error("Error in tools API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new tool
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const auth = await checkAdminAccess(supabase);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug || !body.category) {
      return NextResponse.json({ error: "Missing required fields: name, slug, category" }, { status: 400 });
    }

    // Check if slug already exists
    const { data: existingTool } = await supabase
      .from("tools")
      .select("id")
      .eq("slug", body.slug)
      .single();

    if (existingTool) {
      return NextResponse.json({ error: "Tool with this slug already exists" }, { status: 409 });
    }

    // Create the tool
    const { data: tool, error } = await supabase
      .from("tools")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        short_description: body.short_description || null,
        category: body.category,
        icon: body.icon || null,
        icon_url: body.icon_url || null,
        site_url: body.site_url || null,
        is_external: body.is_external || false,
        is_premium: body.is_premium || false,
        is_active: body.is_active ?? true,
        usage_limit_free: body.usage_limit_free || 10,
        usage_limit_pro: body.usage_limit_pro || 1000,
        features: body.features || [],
        tags: body.tags || [],
        sort_order: body.sort_order || 0,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating tool:", error);
      return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
    }

    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    console.error("Error in tools API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update a tool
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const auth = await checkAdminAccess(supabase);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }

    // If slug is being updated, check it doesn't exist
    if (updateData.slug) {
      const { data: existingTool } = await supabase
        .from("tools")
        .select("id")
        .eq("slug", updateData.slug)
        .neq("id", id)
        .single();

      if (existingTool) {
        return NextResponse.json({ error: "Another tool with this slug already exists" }, { status: 409 });
      }
    }

    // Update the tool
    const { data: tool, error } = await supabase
      .from("tools")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating tool:", error);
      return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
    }

    return NextResponse.json({ tool });
  } catch (error) {
    console.error("Error in tools API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a tool
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const auth = await checkAdminAccess(supabase);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }

    // Delete the tool
    const { error } = await supabase
      .from("tools")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting tool:", error);
      return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Tool deleted successfully" });
  } catch (error) {
    console.error("Error in tools API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
