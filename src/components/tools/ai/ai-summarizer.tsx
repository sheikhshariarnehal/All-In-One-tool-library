"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import { Copy, Check, Download, Loader2, FileSearch, List, AlignLeft } from "lucide-react";

type SummaryFormat = "paragraph" | "bullets" | "key-points";
type SummaryLength = "short" | "medium" | "detailed";

export default function AISummarizer() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<SummaryFormat>("paragraph");
  const [length, setLength] = useState<SummaryLength>("medium");
  const [output, setOutput] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usesRemaining, setUsesRemaining] = useState(10);

  const handleSummarize = async () => {
    if (!input.trim() || usesRemaining <= 0) return;
    
    setIsProcessing(true);
    
    // Simulated AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const { summary, points } = summarizeText(input, format, length);
    setOutput(summary);
    setKeyPoints(points);
    setUsesRemaining((prev) => prev - 1);
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `Summary:\n\n${output}\n\nKey Points:\n${keyPoints.map((p) => `• ${p}`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;
  const compressionRatio = output ? Math.round((1 - wordCount(output) / wordCount(input)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="format">Format:</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as SummaryFormat)}>
            <SelectTrigger id="format" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Paragraph
                </div>
              </SelectItem>
              <SelectItem value="bullets">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Bullet Points
                </div>
              </SelectItem>
              <SelectItem value="key-points">
                <div className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4" />
                  Key Points
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="length">Length:</Label>
          <Select value={length} onValueChange={(v) => setLength(v as SummaryLength)}>
            <SelectTrigger id="length" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (~25%)</SelectItem>
              <SelectItem value="medium">Medium (~40%)</SelectItem>
              <SelectItem value="detailed">Detailed (~60%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="secondary">{usesRemaining} uses left today</Badge>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Original Text</span>
              <span className="text-sm font-normal text-muted-foreground">
                {wordCount(input)} words
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your article, document, or text here to summarize..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={14}
              className="resize-none"
            />
            <div className="mt-4">
              <Button
                onClick={handleSummarize}
                disabled={!input.trim() || isProcessing || usesRemaining <= 0}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <FileSearch className="mr-2 h-4 w-4" />
                    Summarize
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Summary</span>
              {output && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{compressionRatio}% compressed</Badge>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="key-points">Key Points</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <div className="min-h-[288px] rounded-md border bg-muted/50 p-3 whitespace-pre-wrap">
                    {output}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {wordCount(output)} words
                  </div>
                </TabsContent>
                <TabsContent value="key-points">
                  <div className="min-h-[288px] rounded-md border bg-muted/50 p-3">
                    <ul className="space-y-2">
                      {keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary font-medium">{index + 1}.</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="min-h-[350px] rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Summary will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips for Better Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Use complete articles or documents for best results
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Longer texts produce more accurate summaries
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Choose &quot;Key Points&quot; format for study notes
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Use &quot;Detailed&quot; length for complex topics
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function summarizeText(
  text: string,
  format: SummaryFormat,
  length: SummaryLength
): { summary: string; points: string[] } {
  // This is a placeholder. In production, this would call an AI API.
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  
  const lengthRatio = length === "short" ? 0.25 : length === "medium" ? 0.4 : 0.6;
  const numSentences = Math.max(2, Math.floor(sentences.length * lengthRatio));
  
  const selectedSentences = sentences.slice(0, numSentences);
  
  let summary: string;
  if (format === "bullets") {
    summary = selectedSentences.map(s => `• ${s.trim()}`).join("\n\n");
  } else if (format === "key-points") {
    summary = selectedSentences.map((s, i) => `${i + 1}. ${s.trim()}`).join("\n\n");
  } else {
    summary = selectedSentences.join(" ");
  }

  const keyPoints = [
    "Main topic identified and summarized",
    "Key arguments or points preserved",
    "Supporting details condensed",
    "Conclusion or outcome highlighted",
    "Original meaning maintained throughout",
  ].slice(0, Math.min(5, numSentences));

  return { summary, points: keyPoints };
}
