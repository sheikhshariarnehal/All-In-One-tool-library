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
import { Copy, Check, Download, Loader2, RefreshCw, RotateCcw, ArrowRightLeft } from "lucide-react";

type ParaphraseMode = "standard" | "fluency" | "creative" | "academic" | "simple";

export default function AIParaphraser() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ParaphraseMode>("standard");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usesRemaining, setUsesRemaining] = useState(10);

  const handleParaphrase = async () => {
    if (!input.trim() || usesRemaining <= 0) return;
    
    setIsProcessing(true);
    
    // Simulated AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const result = paraphraseText(input, mode);
    setOutput(result);
    setUsesRemaining((prev) => prev - 1);
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paraphrased-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="mode">Paraphrase Mode:</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as ParaphraseMode)}>
            <SelectTrigger id="mode" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="fluency">Fluency</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="simple">Simplify</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="secondary">{usesRemaining} uses left today</Badge>
      </div>

      {/* Input/Output Grid */}
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
              placeholder="Enter or paste your text here to paraphrase..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Paraphrased Text</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-muted-foreground">
                  {wordCount(output)} words
                </span>
                {output && (
                  <>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="min-h-[288px] rounded-md border bg-muted/50 p-3 whitespace-pre-wrap">
                {output}
              </div>
            ) : (
              <div className="min-h-[288px] rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Paraphrased text will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleParaphrase}
          disabled={!input.trim() || isProcessing || usesRemaining <= 0}
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Paraphrasing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Paraphrase
            </>
          )}
        </Button>
        <Button variant="outline" size="lg" onClick={handleSwap} disabled={!output}>
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Swap
        </Button>
        <Button variant="outline" size="lg" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Mode Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paraphrase Modes Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div>
              <h4 className="font-medium mb-1">Standard</h4>
              <p className="text-muted-foreground">
                Balanced rewriting that maintains meaning while changing structure.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Fluency</h4>
              <p className="text-muted-foreground">
                Focuses on improving readability and flow of the text.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Creative</h4>
              <p className="text-muted-foreground">
                More extensive rewording with varied vocabulary.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Academic</h4>
              <p className="text-muted-foreground">
                Formal tone suitable for academic writing.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Simplify</h4>
              <p className="text-muted-foreground">
                Makes text easier to understand with simpler words.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function paraphraseText(text: string, mode: ParaphraseMode): string {
  // This is a placeholder. In production, this would call an AI API.
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  const synonyms: Record<string, string[]> = {
    important: ["significant", "crucial", "vital", "essential"],
    good: ["excellent", "great", "positive", "beneficial"],
    bad: ["negative", "poor", "detrimental", "unfavorable"],
    big: ["large", "substantial", "considerable", "significant"],
    small: ["minor", "modest", "slight", "limited"],
    show: ["demonstrate", "indicate", "reveal", "illustrate"],
    use: ["utilize", "employ", "apply", "implement"],
    make: ["create", "produce", "develop", "generate"],
    help: ["assist", "aid", "support", "facilitate"],
    think: ["believe", "consider", "regard", "view"],
  };

  const paraphrased = sentences.map((sentence) => {
    let result = sentence;
    
    // Apply mode-specific transformations
    if (mode === "academic") {
      result = result.replace(/\bdon't\b/gi, "do not");
      result = result.replace(/\bcan't\b/gi, "cannot");
      result = result.replace(/\bwon't\b/gi, "will not");
      result = result.replace(/\bit's\b/gi, "it is");
    }
    
    // Simple word replacement
    Object.entries(synonyms).forEach(([word, replacements]) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      if (regex.test(result)) {
        const replacement = replacements[Math.floor(Math.random() * replacements.length)];
        result = result.replace(regex, replacement);
      }
    });
    
    return result;
  });

  return paraphrased.join(" ");
}
