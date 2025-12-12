import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { blogPosts, getBlogPost, getBlogCategory, getRecentPosts } from "@/lib/blog";
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Tool Library Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const category = getBlogCategory(post.category);
  const relatedPosts = getRecentPosts(4).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <article className="container px-4 mx-auto py-8">
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <header className="mb-8">
              {category && (
                <Link href={`/blog/category/${category.slug}`}>
                  <Badge className={`${category.color} text-white mb-4`}>
                    {category.name}
                  </Badge>
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {post.author.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{post.author.name}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min read
                </span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video bg-muted rounded-lg mb-8" />

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                This is where the full article content would be displayed. In a production environment,
                this would be rendered from markdown or a CMS.
              </p>
              <h2>Introduction</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h2>Main Points</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <ul>
                <li>First important point about the topic</li>
                <li>Second consideration to keep in mind</li>
                <li>Third aspect worth exploring</li>
                <li>Fourth element of the discussion</li>
              </ul>
              <h2>Conclusion</h2>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share this article
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium">
                        {post.author.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{post.author.name}</p>
                      <p className="text-sm text-muted-foreground">Content Writer</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expert in academic writing and research methodology with years of experience 
                    helping students succeed.
                  </p>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {relatedPost.readTime} min read
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
