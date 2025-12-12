import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: categories, error } = await supabase
      .from("template_categories")
      .select(`
        *,
        templates:templates(count)
      `)
      .eq("is_active", true)
      .order("name", { ascending: true });
    
    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }
    
    // Transform to include template count
    const categoriesWithCount = (categories || []).map(cat => ({
      ...cat,
      template_count: cat.templates?.[0]?.count || 0
    }));
    
    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
