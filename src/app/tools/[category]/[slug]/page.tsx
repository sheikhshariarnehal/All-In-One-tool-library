import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolWrapperClient } from "@/components/tools/tool-wrapper-client";
import { 
  ArrowLeft, 
  ExternalLink, 
  Crown, 
  Eye, 
  Share2,
  Star,
  Clock
} from "lucide-react";

interface ToolPageProps {
  params: Promise<{ category: string; slug: string }>;
}

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
  is_active: boolean;
  features: string[];
  tags: string[];
  views_count: number;
  created_at: string;
  updated_at: string;
}

// Category names mapping
const categoryNames: Record<string, string> = {
  document: "Document Tools",
  academic: "Academic Tools",
  developer: "Developer Tools",
  utilities: "Utilities",
  ai: "AI Tools",
  "ai-image": "AI Image Tools",
  templates: "Templates",
  professional: "Professional Tools",
};

async function getToolBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data: tool, error } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching tool:", error);
    return null;
  }

  // Increment view count asynchronously
  supabase
    .from("tools")
    .update({ views_count: (tool?.views_count || 0) + 1 })
    .eq("slug", slug)
    .then(() => {});

  return tool as Tool;
}

async function getRelatedTools(category: string, currentSlug: string) {
  const supabase = await createClient();
  
  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, slug, name, short_description, icon_url, is_premium, is_external, site_url")
    .eq("category", category)
    .eq("is_active", true)
    .neq("slug", currentSlug)
    .order("views_count", { descending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching related tools:", error);
    return [];
  }

  return tools || [];
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: `${tool.name} - Free Online Tool | Tool Library`,
    description: tool.description || tool.short_description || `Use ${tool.name} for free online`,
    keywords: tool.tags?.join(", ") || "",
    openGraph: {
      title: `${tool.name} - Free Online Tool | Tool Library`,
      description: tool.description || tool.short_description || `Use ${tool.name} for free online`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - Free Online Tool`,
      description: tool.description || tool.short_description || `Use ${tool.name} for free online`,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { category: categorySlug, slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool || tool.category !== categorySlug) {
    notFound();
  }

  // If tool is external, redirect to the external site
  if (tool.is_external && tool.site_url) {
    redirect(tool.site_url);
  }

  const categoryName = categoryNames[categorySlug] || categorySlug;
  const relatedTools = await getRelatedTools(categorySlug, slug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground transition-colors">
          Tools
        </Link>
        <span>/</span>
        <Link href={`/tools/${categorySlug}`} className="hover:text-foreground transition-colors">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-foreground">{tool.name}</span>
      </div>

      {/* Tool Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            {tool.icon_url ? (
              <img 
                src={tool.icon_url} 
                alt={tool.name} 
                className="h-16 w-16 rounded-xl object-cover shadow-lg"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {tool.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                {tool.is_premium && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {tool.description || tool.short_description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Tool Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {tool.views_count > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{tool.views_count.toLocaleString()} views</span>
            </div>
          )}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tool Component */}
      <div className="mb-12">
        <ToolWrapperClient slug={slug} />
      </div>

      {/* Features Section */}
      {tool.features && tool.features.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tool.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Related Tools</h2>
            <Link href={`/tools/${categorySlug}`} className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((relatedTool) => {
              const isExternal = relatedTool.is_external && relatedTool.site_url;
              
              const cardContent = (
                <Card className="h-full hover:shadow-md transition-all cursor-pointer group border hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      {relatedTool.icon_url ? (
                        <img 
                          src={relatedTool.icon_url} 
                          alt={relatedTool.name} 
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">{relatedTool.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {relatedTool.name}
                          {isExternal && (
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                        </CardTitle>
                      </div>
                      {relatedTool.is_premium && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                          <Crown className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 text-sm">
                      {relatedTool.short_description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );

              if (isExternal) {
                return (
                  <a 
                    key={relatedTool.id}
                    href={relatedTool.site_url!} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <Link key={relatedTool.id} href={`/tools/${categorySlug}/${relatedTool.slug}`} className="block">
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
