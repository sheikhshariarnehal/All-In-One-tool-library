import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { aiTools, getFreeAITools, getPremiumAITools } from "@/lib/ai-tools";
import { Sparkles, Crown, ArrowRight, Zap, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tools - AI-Powered Writing & Productivity Tools | Tool Library",
  description: "Access powerful AI tools for essay writing, paraphrasing, grammar checking, summarization, and more. Boost your productivity with AI assistance.",
  keywords: "ai tools, ai writer, ai paraphraser, ai grammar checker, ai summarizer, ai presentation generator",
};

export default function AIToolsPage() {
  const freeTools = getFreeAITools();
  const premiumTools = getPremiumAITools();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-500/10 via-primary/5 to-background py-16">
          <div className="container px-4 mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Tools
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              AI Writing & Productivity Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Supercharge your writing and research with our AI-powered tools. 
              From essay writing to grammar checking, let AI help you work smarter.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#free-tools">
                  Try Free Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  Unlock All Tools
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="border-b bg-muted/30 py-6">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Latest AI Models</span>
              </div>
            </div>
          </div>
        </section>

        {/* Free AI Tools */}
        <section id="free-tools" className="py-16">
          <div className="container px-4 mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Free AI Tools</h2>
              <p className="text-muted-foreground">
                Start using these AI tools for free with daily limits. No account required.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeTools.map((tool) => (
                <Link key={tool.slug} href={`/ai-tools/${tool.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 ${tool.color} rounded-lg`}>
                          <tool.icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {tool.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                        {tool.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {tool.dailyLimit && (
                        <Badge variant="secondary" className="text-xs">
                          {tool.dailyLimit} free uses/day
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Premium AI Tools */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold">Premium AI Tools</h2>
              </div>
              <p className="text-muted-foreground">
                Unlock advanced AI capabilities with a Pro subscription.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumTools.map((tool) => (
                <Card key={tool.slug} className="h-full relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 ${tool.color} rounded-lg opacity-75`}>
                        <tool.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {tool.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                      {tool.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant="secondary" asChild>
                      <Link href="/pricing">
                        <Lock className="h-4 w-4 mr-2" />
                        Unlock with Pro
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Using our AI tools is simple and straightforward.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Enter Your Content</h3>
                <p className="text-sm text-muted-foreground">
                  Paste your text or describe what you need help with.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Customize Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred style, tone, and output format.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get AI Results</h3>
                <p className="text-sm text-muted-foreground">
                  Review, edit, and export your AI-generated content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Transform Your Writing?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
              Join thousands of students and professionals using AI to write better, faster.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">Get Started Free</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/pricing">View Pro Plans</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
