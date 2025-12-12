import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { aiTools, getAIToolBySlug } from "@/lib/ai-tools";
import { ArrowLeft, Crown, Sparkles } from "lucide-react";
import { AIToolWrapper } from "@/components/tools/ai/ai-tool-wrapper";

interface AIToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return aiTools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: AIToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getAIToolBySlug(slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return {
    title: `${tool.name} - Free AI Tool | Tool Library`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - Free AI Tool | Tool Library`,
      description: tool.description,
    },
  };
}

export default async function AIToolPage({ params }: AIToolPageProps) {
  const { slug } = await params;
  const tool = getAIToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 mx-auto py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/ai-tools"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to AI Tools
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 ${tool.color} rounded-lg`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">{tool.name}</h1>
                  {tool.isPremium ? (
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Free
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{tool.description}</p>
              </div>
            </div>
          </div>

          {/* Tool Component */}
          {tool.isPremium ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                This AI tool is available for Pro subscribers. Upgrade to access 
                unlimited usage and all premium features.
              </p>
              <Button size="lg" asChild>
                <Link href="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Link>
              </Button>
            </div>
          ) : (
            <AIToolWrapper slug={slug} />
          )}

          {/* Features */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tool.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
