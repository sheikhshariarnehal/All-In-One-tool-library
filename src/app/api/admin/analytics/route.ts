import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/analytics - Get analytics data
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (range) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get user count
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Get new users in range
    const { count: newUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString());

    // Get active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // Get tool usage
    const { data: toolUsage } = await supabase
      .from("tool_usage")
      .select("tool_slug")
      .gte("created_at", startDate.toISOString());

    // Aggregate tool usage
    const toolStats = (toolUsage || []).reduce((acc: Record<string, number>, usage) => {
      acc[usage.tool_slug] = (acc[usage.tool_slug] || 0) + 1;
      return acc;
    }, {});

    const topTools = Object.entries(toolStats)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalToolUsage: toolUsage?.length || 0,
      },
      topTools,
      range,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
