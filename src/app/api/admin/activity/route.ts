import { NextRequest, NextResponse } from "next/server";
import { getActivityLogs, logActivity } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId") || undefined;
    const action = searchParams.get("action") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;
    
    const logs = await getActivityLogs({
      adminId,
      action,
      limit,
      offset,
    });
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    await logActivity(
      body.admin_id,
      body.action,
      body.entity_type,
      body.entity_id,
      body.old_values,
      body.new_values,
      body.ip_address,
      body.user_agent
    );
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
