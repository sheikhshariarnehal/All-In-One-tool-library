import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategoryBySlug } from "@/lib/tools/categories";
import { getToolsMetadataByCategory } from "@/lib/tools/metadata";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

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
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const tools = getToolsMetadataByCategory(categorySlug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <category.icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${categorySlug}/${tool.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  {tool.isPremium && (
                    <Badge variant="secondary">Pro</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No tools available in this category yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
