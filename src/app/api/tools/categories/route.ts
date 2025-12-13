import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Define category metadata
const categoryMetadata: Record<string, { name: string; description: string; icon: string; gradient: string }> = {
  document: {
    name: "Document Tools",
    description: "PDF editors, converters, compressors, and document management tools",
    icon: "FileText",
    gradient: "from-blue-500 to-cyan-500",
  },
  academic: {
    name: "Academic Tools",
    description: "Citation generators, plagiarism checkers, and research assistants",
    icon: "GraduationCap",
    gradient: "from-purple-500 to-pink-500",
  },
  developer: {
    name: "Developer Tools",
    description: "JSON formatters, code converters, and API testing utilities",
    icon: "Code",
    gradient: "from-green-500 to-emerald-500",
  },
  utilities: {
    name: "Utilities",
    description: "QR generators, unit converters, and everyday productivity tools",
    icon: "Wrench",
    gradient: "from-orange-500 to-red-500",
  },
  ai: {
    name: "AI Tools",
    description: "AI-powered writing, image generation, and content creation tools",
    icon: "Brain",
    gradient: "from-violet-500 to-purple-500",
  },
  "ai-image": {
    name: "AI Image Tools",
    description: "AI image enhancement, upscaling, and generation tools",
    icon: "ImagePlus",
    gradient: "from-pink-500 to-rose-500",
  },
  templates: {
    name: "Templates",
    description: "Ready-to-use templates for documents, presentations, and more",
    icon: "LayoutTemplate",
    gradient: "from-teal-500 to-cyan-500",
  },
  professional: {
    name: "Professional Tools",
    description: "Business tools for invoices, contracts, and professional documents",
    icon: "Briefcase",
    gradient: "from-slate-500 to-gray-500",
  },
}

// GET /api/tools/categories - Get categories with tool counts
export async function GET() {
  try {
    const supabase = await createClient()

    // Get tool counts by category
    const { data: tools, error } = await supabase
      .from("tools")
      .select("category")
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Count tools per category
    const categoryCounts: Record<string, number> = {}
    tools?.forEach((tool) => {
      categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1
    })

    // Build categories array with metadata and counts
    const categories = Object.entries(categoryMetadata).map(([slug, meta]) => ({
      slug,
      name: meta.name,
      description: meta.description,
      icon: meta.icon,
      gradient: meta.gradient,
      toolCount: categoryCounts[slug] || 0,
    }))

    // Filter out categories with no tools and sort by tool count
    const activeCategories = categories
      .filter((cat) => cat.toolCount > 0)
      .sort((a, b) => b.toolCount - a.toolCount)

    return NextResponse.json(activeCategories)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
