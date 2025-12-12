import { NextRequest, NextResponse } from "next/server";
import { getAITools, createAITool } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive") === "true" ? true : 
                     searchParams.get("isActive") === "false" ? false : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    
    const tools = await getAITools({
      isActive,
      limit,
    });
    
    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Error fetching AI tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI tools" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const tool = await createAITool({
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      color: body.color,
      features: body.features || [],
      is_premium: body.is_premium || false,
      is_active: body.is_active !== false,
      daily_limit_free: body.daily_limit_free || 10,
      daily_limit_pro: body.daily_limit_pro || 100,
      monthly_limit_enterprise: body.monthly_limit_enterprise,
      model_provider: body.model_provider || "openai",
      model_name: body.model_name,
      system_prompt: body.system_prompt,
      metadata: body.metadata || null,
    });
    
    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    console.error("Error creating AI tool:", error);
    return NextResponse.json(
      { error: "Failed to create AI tool" },
      { status: 500 }
    );
  }
}
