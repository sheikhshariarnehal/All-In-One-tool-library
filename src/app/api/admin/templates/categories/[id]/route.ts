import { NextRequest, NextResponse } from "next/server";
import { 
  updateTemplateCategory, 
  deleteTemplateCategory 
} from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const category = await updateTemplateCategory(id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      color: body.color,
      is_active: body.is_active,
      display_order: body.display_order,
    });
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error updating template category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await deleteTemplateCategory(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}
