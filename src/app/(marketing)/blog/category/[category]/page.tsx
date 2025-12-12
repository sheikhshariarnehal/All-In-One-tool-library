import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogCategories, getBlogCategory, getBlogPostsByCategory } from "@/lib/blog";
import { ArrowLeft, Clock } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return blogCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getBlogCategory(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} - Blog | Tool Library`,
    description: category.description,
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getBlogCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = getBlogPostsByCategory(categorySlug);

  return (
    <div className="min-h-screen">
      <div className="container px-4 mx-auto py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 ${category.color} rounded-lg`}>
              <category.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {post.featured && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min read
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No articles in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
