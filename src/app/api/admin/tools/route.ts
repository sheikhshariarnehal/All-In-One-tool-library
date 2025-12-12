import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { toolsMetadata } from "@/lib/tools/metadata";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tools from metadata with mock usage data
    const tools = Object.entries(toolsMetadata).map(([id, tool]) => ({
      id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      isPremium: tool.isPremium,
      isActive: true,
      usageCount: Math.floor(Math.random() * 10000),
      usersToday: Math.floor(Math.random() * 500),
    }));

    // In production, also fetch tool usage statistics from Supabase
    // const { data: usageStats, error } = await supabase
    //   .from("tool_usage")
    //   .select("tool_id, count")
    //   .order("count", { ascending: false });

    return NextResponse.json({
      tools,
      total: tools.length,
      stats: {
        totalTools: tools.length,
        premiumTools: tools.filter(t => t.isPremium).length,
        freeTools: tools.filter(t => !t.isPremium).length,
        totalUsage: tools.reduce((sum, t) => sum + t.usageCount, 0),
      },
    });
  } catch (error) {
    console.error("Error fetching tools:", error);
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
    const { id, isActive, isPremium } = body;

    if (!id) {
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }

    // In production, update tool settings in Supabase
    // const { data, error } = await supabase
    //   .from("tool_settings")
    //   .upsert({
    //     tool_id: id,
    //     is_active: isActive,
    //     is_premium: isPremium,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .select()
    //   .single();

    return NextResponse.json({ 
      success: true, 
      id,
      message: `Tool ${id} updated successfully`,
    });
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
