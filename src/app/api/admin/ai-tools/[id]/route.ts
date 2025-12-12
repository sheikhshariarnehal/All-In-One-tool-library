import { NextRequest, NextResponse } from "next/server";
import { 
  getAIToolBySlug, 
  updateAITool, 
  deleteAITool 
} from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Try to get by ID first, if that fails try slug
    const tool = await getAIToolBySlug(id);
    return NextResponse.json({ tool });
  } catch (error) {
    console.error("Error fetching AI tool:", error);
    return NextResponse.json(
      { error: "AI tool not found" },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const tool = await updateAITool(id, body);
    return NextResponse.json({ tool });
  } catch (error) {
    console.error("Error updating AI tool:", error);
    return NextResponse.json(
      { error: "Failed to update AI tool" },
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
    await deleteAITool(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting AI tool:", error);
    return NextResponse.json(
      { error: "Failed to delete AI tool" },
      { status: 500 }
    );
  }
}
