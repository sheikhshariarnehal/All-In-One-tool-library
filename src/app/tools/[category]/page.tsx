import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Category metadata
const categoryMeta: Record<string, { name: string; description: string; icon: string; gradient: string }> = {
  document: { 
    name: "Document Tools", 
    description: "PDF editors, converters, compressors, and document management tools",
    icon: "FileText",
    gradient: "from-blue-500 to-cyan-500"
  },
  academic: { 
    name: "Academic Tools", 
    description: "Citation generators, plagiarism checkers, and research assistants",
    icon: "GraduationCap",
    gradient: "from-purple-500 to-pink-500"
  },
  developer: { 
    name: "Developer Tools", 
    description: "JSON formatters, code converters, and API testing utilities",
    icon: "Code",
    gradient: "from-green-500 to-emerald-500"
  },
  utilities: { 
    name: "Utilities", 
    description: "QR generators, unit converters, and everyday productivity tools",
    icon: "Wrench",
    gradient: "from-orange-500 to-red-500"
  },
  ai: { 
    name: "AI Tools", 
    description: "AI-powered writing, image generation, and content creation tools",
    icon: "Brain",
    gradient: "from-violet-500 to-purple-500"
  },
  "ai-image": { 
    name: "AI Image Tools", 
    description: "AI image enhancement, upscaling, and generation tools",
    icon: "ImagePlus",
    gradient: "from-pink-500 to-rose-500"
  },
  templates: { 
    name: "Templates", 
    description: "Ready-to-use templates for documents, presentations, and more",
    icon: "LayoutTemplate",
    gradient: "from-teal-500 to-cyan-500"
  },
  professional: { 
    name: "Professional Tools", 
    description: "Business tools for invoices, contracts, and professional documents",
    icon: "Briefcase",
    gradient: "from-slate-500 to-gray-500"
  },
};

// Icon mapping
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

async function getToolsByCategory(category: string) {
  const supabase = await createClient();
  
  const { data: tools, error } = await supabase
    .from("tools")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching tools:", error);
    return [];
  }

  return tools || [];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = categoryMeta[categorySlug];

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - Tool Library`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Tool Library`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = categoryMeta[categorySlug];

  if (!category) {
    notFound();
  }

  const tools = await getToolsByCategory(categorySlug);
  const IconComponent = iconMap[category.icon] || Wrench;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/tools" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Tools
      </Link>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg`}>
            <IconComponent className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {tools.length} tool{tools.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool: Tool) => (
          <ToolCard key={tool.id} tool={tool} categorySlug={categorySlug} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <IconComponent className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tools available yet</h3>
          <p className="text-muted-foreground mb-4">
            We&apos;re working on adding tools to this category. Check back soon!
          </p>
          <Link href="/tools">
            <Button variant="outline">Browse Other Categories</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool, categorySlug }: { tool: Tool; categorySlug: string }) {
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
              <CardTitle className="text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                {tool.name}
                {isExternal && (
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </CardTitle>
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
    <Link href={`/tools/${categorySlug}/${tool.slug}`} className="block">
      {cardContent}
    </Link>
  );
}
