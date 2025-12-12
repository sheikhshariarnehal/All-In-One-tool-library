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
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Download, Loader2, Sparkles, RotateCcw } from "lucide-react";

type EssayType = "argumentative" | "expository" | "narrative" | "descriptive" | "persuasive";
type ToneType = "formal" | "academic" | "casual" | "professional";

export default function AIEssayWriter() {
  const [topic, setTopic] = useState("");
  const [essayType, setEssayType] = useState<EssayType>("argumentative");
  const [tone, setTone] = useState<ToneType>("academic");
  const [wordCount, setWordCount] = useState([500]);
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usesRemaining, setUsesRemaining] = useState(5);

  const handleGenerate = async () => {
    if (!topic.trim() || usesRemaining <= 0) return;
    
    setIsGenerating(true);
    
    // Simulated AI generation (in production, this would call an AI API)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const sampleOutput = generateSampleEssay(topic, essayType, tone, wordCount[0]);
    setOutput(sampleOutput);
    setUsesRemaining((prev) => prev - 1);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `essay-${topic.slice(0, 20).replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setTopic("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Essay Settings</span>
              <Badge variant="secondary">{usesRemaining} uses left today</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Essay Topic or Prompt</Label>
              <Textarea
                id="topic"
                placeholder="Enter your essay topic, thesis statement, or prompt..."
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
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as ToneType)}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Word Count: {wordCount[0]}</Label>
              <Slider
                value={wordCount}
                onValueChange={setWordCount}
                min={250}
                max={2000}
                step={50}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>250 words</span>
                <span>2000 words</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating || usesRemaining <= 0}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Essay
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
            <CardTitle className="flex items-center justify-between">
              <span>Generated Essay</span>
              {output && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 max-h-[500px] overflow-y-auto">
                  {output}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{output.split(/\s+/).length} words</span>
                  <span>{output.length} characters</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-center">
                  Enter your topic and click &quot;Generate Essay&quot; to see AI-generated content here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Be specific with your topic or thesis statement
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Include any key points you want to be covered
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Select the appropriate essay type for your needs
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Always review and edit AI-generated content
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function generateSampleEssay(topic: string, type: EssayType, tone: ToneType, wordCount: number): string {
  // This is a placeholder. In production, this would call an AI API.
  const intro = `${topic}: An ${type.charAt(0).toUpperCase() + type.slice(1)} Essay

Introduction

${topic} is a subject that has garnered significant attention in recent years. This ${type} essay will explore various aspects of this topic, presenting ${type === "argumentative" ? "arguments and counterarguments" : type === "expository" ? "information and explanations" : type === "narrative" ? "a compelling narrative" : type === "descriptive" ? "vivid descriptions" : "persuasive points"} to provide a comprehensive understanding.`;

  const body = `

Body

The importance of ${topic.toLowerCase()} cannot be overstated. Research has shown that this subject affects many areas of our daily lives. First and foremost, it impacts how we approach problem-solving and decision-making.

Furthermore, examining ${topic.toLowerCase()} from multiple perspectives reveals its complexity. Scholars and practitioners alike have contributed to our understanding through various studies and real-world applications.

The implications extend beyond theoretical discussions. Practical applications demonstrate the relevance of this topic in contemporary society. From educational settings to professional environments, the principles discussed here find meaningful expression.`;

  const conclusion = `

Conclusion

In conclusion, ${topic.toLowerCase()} represents a multifaceted subject worthy of careful consideration. This ${type} essay has explored key aspects, providing insights that contribute to a deeper understanding. As we continue to engage with this topic, new perspectives and applications will undoubtedly emerge, enriching our collective knowledge.`;

  return intro + body + conclusion;
}
