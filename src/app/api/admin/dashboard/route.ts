import { NextResponse } from "next/server";
import { 
  getDashboardStats, 
  getPopularTemplates, 
  getPopularAITools 
} from "@/lib/supabase/admin";

export async function GET() {
  try {
    const [stats, popularTemplates, popularAITools] = await Promise.all([
      getDashboardStats(),
      getPopularTemplates(5),
      getPopularAITools(5),
    ]);
    
    return NextResponse.json({ 
      stats,
      popularTemplates,
      popularAITools,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
