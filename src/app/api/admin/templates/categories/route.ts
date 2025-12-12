import { NextRequest, NextResponse } from "next/server";
import { 
  getTemplateCategories, 
  createTemplateCategory,
} from "@/lib/supabase/admin";

export async function GET() {
  try {
    const categories = await getTemplateCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching template categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch template categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }
    
    const category = await createTemplateCategory({
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      color: body.color,
      is_active: body.is_active,
      display_order: body.display_order,
    });
    
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating template category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create category" },
      { status: 500 }
    );
  }
}
