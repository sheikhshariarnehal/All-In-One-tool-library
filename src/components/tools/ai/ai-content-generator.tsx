"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, CheckCircle, Download, RefreshCw, Target, PenLine } from "lucide-react";

export default function AIContentGenerator() {
  const [contentType, setContentType] = useState("blog-post");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { value: "blog-post", label: "Blog Post" },
    { value: "article", label: "Article" },
    { value: "product-description", label: "Product Description" },
    { value: "social-media", label: "Social Media Post" },
    { value: "email", label: "Email Copy" },
    { value: "landing-page", label: "Landing Page Copy" },
    { value: "ad-copy", label: "Ad Copy" },
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual & Friendly" },
    { value: "formal", label: "Formal" },
    { value: "persuasive", label: "Persuasive" },
    { value: "informative", label: "Informative" },
    { value: "humorous", label: "Humorous" },
  ];

  const lengths = [
    { value: "short", label: "Short (100-200 words)" },
    { value: "medium", label: "Medium (300-500 words)" },
    { value: "long", label: "Long (800-1200 words)" },
  ];

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const templates: Record<string, string> = {
        "blog-post": `# ${topic}

## Introduction

${topic} has become increasingly important in today's fast-paced world. In this comprehensive guide, we'll explore everything you need to know about this topic, from the basics to advanced strategies that can help you succeed.

Whether you're just getting started or looking to deepen your understanding, this article will provide valuable insights and actionable tips.

## Why ${topic} Matters

Understanding ${topic} is crucial for several reasons:

- **Increased Efficiency**: By mastering these concepts, you can significantly improve your workflow and productivity.
- **Better Results**: Implementing best practices leads to more consistent and higher-quality outcomes.
- **Competitive Advantage**: Stay ahead of the curve by embracing the latest developments in this field.

## Key Strategies for Success

### 1. Start with the Fundamentals

Before diving into advanced techniques, make sure you have a solid foundation. This includes understanding the core principles and common terminology used in the field.

### 2. Practice Consistently

Like any skill, improvement comes with regular practice. Set aside dedicated time each day or week to work on your skills.

### 3. Learn from Others

Connect with experts and peers in the field. Their experiences and insights can accelerate your learning and help you avoid common pitfalls.

## Conclusion

${topic} offers tremendous opportunities for those willing to invest the time and effort to learn. By following the strategies outlined in this guide, you'll be well on your way to achieving your goals.

${keywords ? `\n**Keywords**: ${keywords}` : ""}`,

        "product-description": `**Introducing: ${topic}**

Transform the way you work with our innovative solution designed for modern professionals.

✨ **Key Features:**

• Premium quality materials and craftsmanship
• Intuitive design that works for you
• Built to last with our satisfaction guarantee
• Perfect for beginners and experts alike

🎯 **Why Choose Us?**

We've combined cutting-edge technology with timeless design to create something truly special. Our customers consistently rate us 5 stars for quality, value, and service.

💡 **What You'll Get:**

Everything you need to get started right away. No complicated setup, no hidden fees – just a great product that delivers on its promises.

⭐ **Order Today**

Join thousands of satisfied customers who've already made the switch. Limited time offer – don't miss out!

${keywords ? `Tags: ${keywords}` : ""}`,

        "social-media": `🚀 ${topic}

Want to level up your game? Here's what you need to know 👇

The secret isn't complicated – it's about consistency, strategy, and taking action every single day.

Here's my top tip:
Start small, but start TODAY. ✅

The best time to begin was yesterday. The second best time? Right now.

Drop a 🔥 if you're ready to make it happen!

#${topic.replace(/\s+/g, '')} ${keywords ? keywords.split(',').map(k => `#${k.trim().replace(/\s+/g, '')}`).join(' ') : '#motivation #success #growth'}`,
      };

      const content = templates[contentType] || templates["blog-post"];
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType}-${topic.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const regenerate = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5" />
              Content Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Subject</Label>
              <Input
                id="topic"
                placeholder="e.g., Remote Work Productivity Tips"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (optional)</Label>
              <Input
                id="keywords"
                placeholder="productivity, remote work, efficiency"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas for SEO optimization
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full" 
              disabled={!topic.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              <Badge variant="secondary" className="mr-2">Premium</Badge>
              Unlimited content with Pro plan
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={regenerate}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadContent}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!generatedContent ? (
              <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your topic and settings to generate content</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[450px] font-mono text-sm resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
