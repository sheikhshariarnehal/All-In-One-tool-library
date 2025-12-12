import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { toolSlug, action } = await request.json();

    if (!toolSlug) {
      return NextResponse.json({ error: "Tool slug is required" }, { status: 400 });
    }

    // Get tool ID from slug
    const { data: tool } = await supabase
      .from("tools")
      .select("id, usage_limit_free, usage_limit_pro")
      .eq("slug", toolSlug)
      .single();

    if (!tool) {
      // Tool might not be in database yet (client-side only tools)
      return NextResponse.json({ allowed: true });
    }

    // Get user's subscription tier
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const tier = profile?.subscription_tier || "free";
    const limit = tier === "pro" ? tool.usage_limit_pro : tool.usage_limit_free;

    // Check today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("tool_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("tool_id", tool.id)
      .gte("created_at", today.toISOString());

    const currentUsage = count || 0;

    if (currentUsage >= limit) {
      return NextResponse.json({
        allowed: false,
        remaining: 0,
        message: tier === "free" 
          ? "Daily limit reached. Upgrade to Pro for unlimited usage."
          : "Usage limit reached. Please try again tomorrow.",
      });
    }

    // Log the usage
    await supabase.from("tool_usage").insert({
      user_id: user.id,
      tool_id: tool.id,
      action: action || "use",
    });

    return NextResponse.json({
      allowed: true,
      remaining: limit - currentUsage - 1,
    });
  } catch (error) {
    console.error("Usage tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track usage" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const toolSlug = searchParams.get("tool");

    if (!toolSlug) {
      return NextResponse.json({ error: "Tool slug is required" }, { status: 400 });
    }

    // Get tool from database
    const { data: tool } = await supabase
      .from("tools")
      .select("id, usage_limit_free, usage_limit_pro")
      .eq("slug", toolSlug)
      .single();

    if (!tool) {
      return NextResponse.json({ limit: Infinity, used: 0, remaining: Infinity });
    }

    // Get user's subscription tier
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const tier = profile?.subscription_tier || "free";
    const limit = tier === "pro" ? tool.usage_limit_pro : tool.usage_limit_free;

    // Check today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("tool_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("tool_id", tool.id)
      .gte("created_at", today.toISOString());

    const used = count || 0;

    return NextResponse.json({
      limit,
      used,
      remaining: Math.max(0, limit - used),
      tier,
    });
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json(
      { error: "Failed to check usage" },
      { status: 500 }
    );
  }
}
