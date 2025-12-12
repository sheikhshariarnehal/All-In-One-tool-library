"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Presentation, Download, Sparkles, Plus, Trash2, Copy, CheckCircle } from "lucide-react";

interface Slide {
  title: string;
  content: string[];
  notes: string;
}

export default function AIPresentationGenerator() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [slideCount, setSlideCount] = useState([8]);
  const [style, setStyle] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [copied, setCopied] = useState(false);

  const styles = [
    { value: "professional", label: "Professional" },
    { value: "academic", label: "Academic" },
    { value: "creative", label: "Creative" },
    { value: "minimalist", label: "Minimalist" },
    { value: "sales", label: "Sales Pitch" },
  ];

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulated AI generation
    setTimeout(() => {
      const generatedSlides: Slide[] = [
        {
          title: "Title Slide",
          content: [topic, "Presented by [Your Name]", new Date().toLocaleDateString()],
          notes: "Welcome the audience and introduce yourself briefly.",
        },
        {
          title: "Agenda",
          content: [
            "Introduction & Background",
            "Key Concepts",
            "Main Findings",
            "Case Studies",
            "Conclusions & Recommendations",
          ],
          notes: "Give a brief overview of what you'll cover in the presentation.",
        },
        {
          title: "Introduction",
          content: [
            "Background context for " + topic,
            "Why this topic matters",
            "Key questions we'll address",
          ],
          notes: "Establish the importance of the topic and engage your audience.",
        },
        {
          title: "Key Concepts",
          content: [
            "Definition and scope",
            "Historical development",
            "Current state of the field",
            "Key terminology",
          ],
          notes: "Ensure everyone has the foundational knowledge to follow along.",
        },
        {
          title: "Main Findings",
          content: [
            "Finding 1: Primary insight",
            "Finding 2: Supporting data",
            "Finding 3: Comparative analysis",
            "Key statistics and evidence",
          ],
          notes: "Present your main points with supporting evidence.",
        },
        {
          title: "Case Study",
          content: [
            "Real-world example",
            "Application of concepts",
            "Lessons learned",
            "Best practices identified",
          ],
          notes: "Use a concrete example to illustrate your points.",
        },
        {
          title: "Recommendations",
          content: [
            "Actionable recommendation 1",
            "Actionable recommendation 2",
            "Implementation considerations",
            "Expected outcomes",
          ],
          notes: "Provide clear, actionable next steps for your audience.",
        },
        {
          title: "Questions & Discussion",
          content: [
            "Thank you for your attention",
            "Open floor for questions",
            "Contact: [your email]",
          ],
          notes: "Invite questions and provide your contact information.",
        },
      ];
      
      setSlides(generatedSlides.slice(0, slideCount[0]));
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    const text = slides.map((slide, i) => 
      `Slide ${i + 1}: ${slide.title}\n${slide.content.map(c => `  • ${c}`).join('\n')}\nNotes: ${slide.notes}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportOutline = () => {
    const text = slides.map((slide, i) => 
      `# Slide ${i + 1}: ${slide.title}\n\n${slide.content.map(c => `- ${c}`).join('\n')}\n\n**Speaker Notes:** ${slide.notes}`
    ).join('\n\n---\n\n');
    
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation-outline-${topic.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Presentation className="h-5 w-5" />
              Presentation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Presentation Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Digital Marketing Strategies for 2024"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Additional Details (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any specific points you want to cover, target audience, or other requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Slides: {slideCount[0]}</Label>
              <Slider
                value={slideCount}
                onValueChange={setSlideCount}
                min={5}
                max={20}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 8-12 slides for a 15-20 minute presentation
              </p>
            </div>

            <div className="space-y-2">
              <Label>Presentation Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full" 
              disabled={!topic.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Generating Presentation...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Presentation Outline
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              <Badge variant="secondary" className="mr-2">Premium</Badge>
              Unlimited presentations with Pro plan
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Outline</CardTitle>
              {slides.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportOutline}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {slides.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg">
                <Presentation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your topic and click generate to create a presentation outline</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {slides.map((slide, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Slide {index + 1}
                      </Badge>
                      <h4 className="font-semibold text-sm">{slide.title}</h4>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                      {slide.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      <span className="font-medium">Notes:</span> {slide.notes}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
