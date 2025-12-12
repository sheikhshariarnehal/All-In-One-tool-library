import { NextRequest, NextResponse } from "next/server";
import { 
  getTemplates, 
  createTemplate, 
  getTemplateCategories 
} from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isPremium = searchParams.get("isPremium") === "true" ? true : 
                      searchParams.get("isPremium") === "false" ? false : undefined;
    const isActive = searchParams.get("isActive") === "true" ? true : 
                     searchParams.get("isActive") === "false" ? false : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;
    
    const templates = await getTemplates({
      categoryId,
      isPremium,
      isActive,
      limit,
      offset,
    });
    
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const template = await createTemplate({
      category_id: body.category_id,
      name: body.name,
      slug: body.slug,
      description: body.description,
      file_url: body.file_url,
      preview_url: body.preview_url,
      file_format: body.file_format || "pdf",
      file_size: body.file_size,
      is_premium: body.is_premium || false,
      is_active: body.is_active !== false,
      tags: body.tags || [],
      metadata: body.metadata || null,
    });
    
    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
