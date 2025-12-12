import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  blogCategories,
  getFeaturedPosts,
  getRecentPosts,
  getBlogCategory,
} from "@/lib/blog";
import { Search, Clock, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Tips, Tutorials & Guides | Tool Library",
  description: "Expert tips on academic writing, research skills, productivity, and professional communication. Learn how to use our tools effectively.",
  keywords: "academic writing tips, research skills, productivity, professional communication, writing guides",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(9);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container px-4 mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="h-3 w-3 mr-1" />
            Tool Library Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tips, Tutorials & Guides
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Expert advice on academic writing, research skills, productivity, 
            and getting the most from our tools.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {blogCategories.map((category) => (
              <Link key={category.slug} href={`/blog/category/${category.slug}`}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post) => {
              const category = getBlogCategory(post.category);
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        {category && (
                          <Badge className={`${category.color} text-white`}>
                            {category.name}
                          </Badge>
                        )}
                      </div>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-12 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => {
              const category = getBlogCategory(post.category);
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-2">
                      {category && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 ${category.color} rounded`}>
                            <category.icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {category.name}
                          </span>
                        </div>
                      )}
                      <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2 text-sm mb-3">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogCategories.map((category) => (
              <Link key={category.slug} href={`/blog/category/${category.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${category.color} rounded-lg`}>
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="p-0">
                      View articles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
            Get the latest tips, tutorials, and updates delivered straight to your inbox.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
