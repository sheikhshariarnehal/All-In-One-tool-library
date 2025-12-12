import { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolsMetadata, getToolMetadataBySlug } from "@/lib/tools/metadata";
import { getCategoryBySlug } from "@/lib/tools/categories";
import { Badge } from "@/components/ui/badge";
import { ToolWrapperClient } from "@/components/tools/tool-wrapper-client";

interface ToolPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return toolsMetadata.map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const tool = getToolMetadataBySlug(slug);
  const category = getCategoryBySlug(categorySlug);

  if (!tool || !category) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: `${tool.name} - Free Online Tool | Tool Library`,
    description: tool.description,
    keywords: tool.keywords.join(", "),
    openGraph: {
      title: `${tool.name} - Free Online Tool | Tool Library`,
      description: tool.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - Free Online Tool`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { category: categorySlug, slug } = await params;
  const tool = getToolMetadataBySlug(slug);
  const category = getCategoryBySlug(categorySlug);

  if (!tool || !category || tool.category !== categorySlug) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Tools</span>
          <span>/</span>
          <span>{category.name}</span>
          <span>/</span>
          <span className="text-foreground">{tool.name}</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          {tool.isPremium && <Badge variant="secondary">Pro</Badge>}
        </div>

        <p className="text-muted-foreground max-w-2xl">{tool.description}</p>
      </div>

      <ToolWrapperClient slug={slug} />

      {/* Tool usage tips and related tools can be added here */}
    </div>
  );
}
