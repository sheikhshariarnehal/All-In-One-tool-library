import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { categories } from "@/lib/tools/categories";
import { toolsMetadata } from "@/lib/tools/metadata";
import { ArrowRight, Zap, Shield, Globe, Sparkles, Wrench, FileText, Brain, BookOpen } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "All tools run directly in your browser for instant results with no upload delays.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your files never leave your device. We don't store or access your data.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Access our tools from any device with a modern browser. No installation required.",
  },
  {
    icon: Sparkles,
    title: "Always Free",
    description: "Core tools are free forever. Upgrade for unlimited usage and premium features.",
  },
];

const platformSections = [
  {
    icon: Wrench,
    title: "Online Tools",
    description: "PDF editors, converters, image compressors, and developer utilities",
    href: "/tools",
    count: "50+",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: FileText,
    title: "Templates",
    description: "Academic papers, resumes, business documents, and more",
    href: "/templates",
    count: "100+",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: Brain,
    title: "AI Tools",
    description: "Essay writer, paraphraser, grammar checker, and summarizer",
    href: "/ai-tools",
    count: "10+",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: BookOpen,
    title: "Blog & Guides",
    description: "Tutorials, tips, and resources for students and professionals",
    href: "/blog",
    count: "50+",
    color: "bg-orange-500/10 text-orange-600",
  },
];

export default function HomePage() {
  const popularTools = toolsMetadata.slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container px-4 mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Your All-in-One Academic & Professional Toolkit
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Tools, Templates & AI
              <br />
              <span className="text-primary">All in One Place</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Free online tools for PDF editing, writing assistance, and file conversion. 
              Download academic and professional templates. Access AI-powered writing tools. 
              Read helpful guides and tutorials.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link href="/tools">
                  Explore All Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/templates">Browse Templates</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/ai-tools">Try AI Tools</Link>
              </Button>
            </div>
            
            {/* Platform Sections Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {platformSections.map((section) => (
                <Link key={section.href} href={section.href}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer text-left">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          <section.icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline">{section.count}</Badge>
                      </div>
                      <CardTitle className="text-base mt-2">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Tool Library?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built for students, professionals, and developers who need reliable tools without the hassle.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-2">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find the perfect tool for your needs across our organized categories.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.slug} href={`/tools/${category.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">
                        {category.toolCount} tools
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Tools Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Popular Tools</h2>
                <p className="text-muted-foreground">
                  Most-used tools by our community
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/tools">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.category}/${tool.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                        {tool.isPremium && (
                          <Badge variant="secondary" className="text-xs">Pro</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Boost Your Productivity?
                </h2>
                <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                  Join thousands of students and professionals who use Tool Library daily. 
                  Create a free account to save favorites, track history, and unlock more features.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/auth/register">Create Free Account</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
