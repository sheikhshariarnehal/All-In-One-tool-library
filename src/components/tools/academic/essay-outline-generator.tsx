"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Download, Loader2, PenTool, RotateCcw } from "lucide-react";

type EssayType = "argumentative" | "expository" | "narrative" | "persuasive" | "analytical";

interface OutlineSection {
  title: string;
  points: string[];
}

interface Outline {
  thesis: string;
  introduction: OutlineSection;
  bodyParagraphs: OutlineSection[];
  conclusion: OutlineSection;
}

export default function EssayOutlineGenerator() {
  const [topic, setTopic] = useState("");
  const [essayType, setEssayType] = useState<EssayType>("argumentative");
  const [numParagraphs, setNumParagraphs] = useState("3");
  const [outline, setOutline] = useState<Outline | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const generatedOutline = generateOutline(topic, essayType, parseInt(numParagraphs));
    setOutline(generatedOutline);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!outline) return;
    
    const text = formatOutlineAsText(outline);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outline) return;
    
    const text = formatOutlineAsText(outline);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `essay-outline-${topic.slice(0, 20).replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setTopic("");
    setOutline(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Essay Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Essay Topic or Title</Label>
              <Textarea
                id="topic"
                placeholder="Enter your essay topic, research question, or thesis idea..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="essay-type">Essay Type</Label>
                <Select value={essayType} onValueChange={(v) => setEssayType(v as EssayType)}>
                  <SelectTrigger id="essay-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="argumentative">Argumentative</SelectItem>
                    <SelectItem value="expository">Expository</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="analytical">Analytical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paragraphs">Body Paragraphs</Label>
                <Select value={numParagraphs} onValueChange={setNumParagraphs}>
                  <SelectTrigger id="paragraphs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Paragraphs</SelectItem>
                    <SelectItem value="3">3 Paragraphs</SelectItem>
                    <SelectItem value="4">4 Paragraphs</SelectItem>
                    <SelectItem value="5">5 Paragraphs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <PenTool className="mr-2 h-4 w-4" />
                    Generate Outline
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Generated Outline</span>
              {outline && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outline ? (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {/* Thesis */}
                <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <h4 className="font-semibold text-primary mb-2">Thesis Statement</h4>
                  <p className="text-sm">{outline.thesis}</p>
                </div>

                {/* Introduction */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>I</Badge>
                    {outline.introduction.title}
                  </h4>
                  <ul className="space-y-1 pl-4">
                    {outline.introduction.points.map((point, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Body Paragraphs */}
                {outline.bodyParagraphs.map((paragraph, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge>{["II", "III", "IV", "V", "VI"][index]}</Badge>
                      {paragraph.title}
                    </h4>
                    <ul className="space-y-1 pl-4">
                      {paragraph.points.map((point, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Conclusion */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>{["III", "IV", "V", "VI", "VII"][parseInt(numParagraphs) - 1]}</Badge>
                    {outline.conclusion.title}
                  </h4>
                  <ul className="space-y-1 pl-4">
                    {outline.conclusion.points.map((point, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <PenTool className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-center">
                  Enter your topic and click &quot;Generate Outline&quot; to create your essay structure.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Essay Type Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Essay Types Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={essayType}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="argumentative">Argumentative</TabsTrigger>
              <TabsTrigger value="expository">Expository</TabsTrigger>
              <TabsTrigger value="narrative">Narrative</TabsTrigger>
              <TabsTrigger value="persuasive">Persuasive</TabsTrigger>
              <TabsTrigger value="analytical">Analytical</TabsTrigger>
            </TabsList>
            <TabsContent value="argumentative" className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Argumentative essays</strong> present a debatable claim and support it with 
                evidence while addressing counterarguments. Best for topics with multiple viewpoints.
              </p>
            </TabsContent>
            <TabsContent value="expository" className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Expository essays</strong> explain or inform about a topic using facts and 
                examples. They maintain an objective tone without personal opinions.
              </p>
            </TabsContent>
            <TabsContent value="narrative" className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Narrative essays</strong> tell a story with a clear beginning, middle, and end. 
                They often include personal experiences and use descriptive language.
              </p>
            </TabsContent>
            <TabsContent value="persuasive" className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Persuasive essays</strong> aim to convince the reader to adopt a specific 
                viewpoint using emotional appeals, logic, and rhetorical techniques.
              </p>
            </TabsContent>
            <TabsContent value="analytical" className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Analytical essays</strong> break down a subject into its components and 
                examine how they work together. Common for literary analysis and critical thinking.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function generateOutline(topic: string, type: EssayType, numParagraphs: number): Outline {
  // This is a placeholder. In production, this would call an AI API.
  const bodyParagraphs: OutlineSection[] = [];
  
  const paragraphTitles = {
    argumentative: ["First Supporting Argument", "Second Supporting Argument", "Counterargument & Rebuttal", "Third Supporting Argument", "Additional Evidence"],
    expository: ["Background Information", "Key Concept Explanation", "Detailed Analysis", "Real-World Applications", "Further Implications"],
    narrative: ["Setting the Scene", "Rising Action", "Climax/Turning Point", "Falling Action", "Resolution Details"],
    persuasive: ["Emotional Appeal", "Logical Argument", "Credibility/Expert Support", "Call to Action", "Additional Persuasion"],
    analytical: ["First Element Analysis", "Second Element Analysis", "Comparative Analysis", "Synthesis of Findings", "Deeper Examination"],
  };

  for (let i = 0; i < numParagraphs; i++) {
    bodyParagraphs.push({
      title: paragraphTitles[type][i] || `Body Paragraph ${i + 1}`,
      points: [
        "Topic sentence introducing the main idea",
        "Supporting evidence or example",
        "Analysis and explanation of evidence",
        "Transition to next paragraph",
      ],
    });
  }

  return {
    thesis: `This essay will argue/explore that ${topic.toLowerCase()} through examining multiple perspectives and evidence.`,
    introduction: {
      title: "Introduction",
      points: [
        "Hook: Engaging opening statement or question",
        "Background: Context and relevant information",
        "Thesis: Clear statement of your main argument or purpose",
      ],
    },
    bodyParagraphs,
    conclusion: {
      title: "Conclusion",
      points: [
        "Restate thesis in new words",
        "Summarize main points from body paragraphs",
        "Broader implications or call to action",
        "Memorable closing statement",
      ],
    },
  };
}

function formatOutlineAsText(outline: Outline): string {
  let text = `ESSAY OUTLINE\n\n`;
  text += `THESIS STATEMENT:\n${outline.thesis}\n\n`;
  
  text += `I. ${outline.introduction.title}\n`;
  outline.introduction.points.forEach((point, i) => {
    text += `   ${String.fromCharCode(65 + i)}. ${point}\n`;
  });
  text += "\n";

  outline.bodyParagraphs.forEach((para, index) => {
    const numeral = ["II", "III", "IV", "V", "VI"][index];
    text += `${numeral}. ${para.title}\n`;
    para.points.forEach((point, i) => {
      text += `   ${String.fromCharCode(65 + i)}. ${point}\n`;
    });
    text += "\n";
  });

  const conclusionNumeral = ["III", "IV", "V", "VI", "VII"][outline.bodyParagraphs.length];
  text += `${conclusionNumeral}. ${outline.conclusion.title}\n`;
  outline.conclusion.points.forEach((point, i) => {
    text += `   ${String.fromCharCode(65 + i)}. ${point}\n`;
  });

  return text;
}
