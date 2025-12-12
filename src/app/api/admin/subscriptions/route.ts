import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/subscriptions - Get all subscriptions
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const plan = searchParams.get("plan") || "";

    let query = supabase
      .from("subscriptions")
      .select("*, profiles(*)", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    if (plan) {
      query = query.eq("plan", plan);
    }

    const { data: subscriptions, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Calculate MRR
    const { data: activeSubscriptions } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("status", "active");

    const mrr = (activeSubscriptions || []).reduce((sum, sub) => {
      if (sub.plan === "pro") return sum + 9;
      if (sub.plan === "enterprise") return sum + 29;
      return sum;
    }, 0);

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
      stats: {
        mrr,
        total: count,
        active: activeSubscriptions?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/admin/subscriptions - Update subscription
export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { subscriptionId, action } = body;

    if (action === "cancel") {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled", canceled_at: new Date().toISOString() })
        .eq("id", subscriptionId);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
