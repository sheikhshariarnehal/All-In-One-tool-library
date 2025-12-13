import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToolSearchWrapper } from "@/components/tools/tool-search-wrapper";
import { 
  FileText, 
  GraduationCap, 
  Code, 
  Wrench, 
  Brain, 
  ImagePlus, 
  LayoutTemplate, 
  Briefcase,
  ExternalLink,
  Crown,
  ArrowRight,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "All Tools - Tool Library",
  description: "Browse our complete collection of free online tools for students, teachers, and professionals.",
  openGraph: {
    title: "All Tools - Tool Library",
    description: "Browse our complete collection of free online tools for students, teachers, and professionals.",
  },
};

// Icon mapping for categories
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  GraduationCap,
  Code,
  Wrench,
  Brain,
  ImagePlus,
  LayoutTemplate,
  Briefcase,
};

// Category metadata with icons and gradients
const categoryMeta: Record<string, { icon: string; gradient: string }> = {
  document: { icon: "FileText", gradient: "from-blue-500 to-cyan-500" },
  academic: { icon: "GraduationCap", gradient: "from-purple-500 to-pink-500" },
  developer: { icon: "Code", gradient: "from-green-500 to-emerald-500" },
  utilities: { icon: "Wrench", gradient: "from-orange-500 to-red-500" },
  ai: { icon: "Brain", gradient: "from-violet-500 to-purple-500" },
  "ai-image": { icon: "ImagePlus", gradient: "from-pink-500 to-rose-500" },
  templates: { icon: "LayoutTemplate", gradient: "from-teal-500 to-cyan-500" },
  professional: { icon: "Briefcase", gradient: "from-slate-500 to-gray-500" },
};

interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  short_description: string | null;
  category: string;
  icon_url: string | null;
  site_url: string | null;
  is_external: boolean;
  is_premium: boolean;
  tags: string[];
  views_count: number;
}

interface CategoryData {
  slug: string;
  name: string;
  description: string;
  toolCount: number;
}

async function getToolsAndCategories() {
  const supabase = await createClient();

  // Get all active tools
  const { data: tools, error } = await supabase
    .from("tools")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("views_count", { descending: true });

  if (error) {
    console.error("Error fetching tools:", error);
    return { tools: [], categories: [] };
  }

  // Group tools by category and count
  const categoryGroups: Record<string, Tool[]> = {};
  (tools || []).forEach((tool: Tool) => {
    if (!categoryGroups[tool.category]) {
      categoryGroups[tool.category] = [];
    }
    categoryGroups[tool.category].push(tool);
  });

  // Build categories with counts
  const categoryNames: Record<string, { name: string; description: string }> = {
    document: { name: "Document Tools", description: "PDF editors, converters, and document management" },
    academic: { name: "Academic Tools", description: "Citation generators, plagiarism checkers, and research tools" },
    developer: { name: "Developer Tools", description: "JSON formatters, code converters, and dev utilities" },
    utilities: { name: "Utilities", description: "QR generators, converters, and productivity tools" },
    ai: { name: "AI Tools", description: "AI-powered writing and content creation" },
    "ai-image": { name: "AI Image Tools", description: "AI image enhancement and generation" },
    templates: { name: "Templates", description: "Ready-to-use document templates" },
    professional: { name: "Professional", description: "Business and professional tools" },
  };

  const categories: CategoryData[] = Object.entries(categoryGroups)
    .map(([slug, catTools]) => ({
      slug,
      name: categoryNames[slug]?.name || slug,
      description: categoryNames[slug]?.description || "",
      toolCount: catTools.length,
    }))
    .sort((a, b) => b.toolCount - a.toolCount);

  return { tools: tools || [], categories };
}

export default async function ToolsPage() {
  const { tools, categories } = await getToolsAndCategories();
  
  // Get featured/popular tools (top 8 by views)
  const featuredTools = [...tools]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Discover Powerful Tools
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Explore our comprehensive collection of {tools.length}+ tools organized by category. 
          From document editing to AI-powered generators, find the perfect tool for your needs.
        </p>
        
        {/* Search */}
        <ToolSearchWrapper className="max-w-md mx-auto" />
      </div>

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Popular Tools</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const meta = categoryMeta[category.slug] || { icon: "Wrench", gradient: "from-gray-500 to-gray-600" };
            const IconComponent = iconMap[meta.icon] || Wrench;
            
            return (
              <Link key={category.slug} href={`/tools/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-lg`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {category.toolCount} tool{category.toolCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Tools Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Tools ({tools.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory />
          ))}
        </div>
      </section>
    </div>
  );
}

function ToolCard({ tool, showCategory = false }: { tool: Tool; showCategory?: boolean }) {
  const isExternal = tool.is_external && tool.site_url;
  
  const cardContent = (
    <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border hover:border-primary/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {tool.icon_url ? (
              <img 
                src={tool.icon_url} 
                alt={tool.name} 
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                {tool.name}
                {isExternal && (
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </CardTitle>
              {showCategory && (
                <p className="text-xs text-muted-foreground capitalize">{tool.category}</p>
              )}
            </div>
          </div>
          {tool.is_premium && (
            <Badge variant="secondary" className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 text-sm">
          {tool.short_description || tool.description}
        </CardDescription>
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tool.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isExternal) {
    return (
      <a 
        href={tool.site_url!} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/tools/${tool.category}/${tool.slug}`} className="block">
      {cardContent}
    </Link>
  );
}
