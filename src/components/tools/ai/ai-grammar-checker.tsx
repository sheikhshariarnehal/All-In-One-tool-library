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
import { Copy, Check, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToneType = "formal" | "casual" | "professional" | "friendly" | "confident";

interface Correction {
  type: "grammar" | "spelling" | "punctuation" | "style";
  original: string;
  suggestion: string;
  explanation: string;
}

export default function AIGrammarChecker() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<ToneType>("professional");
  const [output, setOutput] = useState("");
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usesRemaining, setUsesRemaining] = useState(20);

  const handleCheck = async () => {
    if (!input.trim() || usesRemaining <= 0) return;
    
    setIsProcessing(true);
    
    // Simulated AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const { correctedText, foundCorrections } = checkGrammar(input, tone);
    setOutput(correctedText);
    setCorrections(foundCorrections);
    setUsesRemaining((prev) => prev - 1);
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeColor = (type: Correction["type"]) => {
    switch (type) {
      case "grammar":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "spelling":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "punctuation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "style":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="tone">Target Tone:</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as ToneType)}>
            <SelectTrigger id="tone" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="confident">Confident</SelectItem>
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
            <CardTitle className="text-base">Your Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your text here to check for grammar, spelling, and style issues..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              className="resize-none"
            />
            <div className="mt-4">
              <Button
                onClick={handleCheck}
                disabled={!input.trim() || isProcessing || usesRemaining <= 0}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check Grammar & Style
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
              <span>Corrected Text</span>
              {output && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
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
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Corrected text will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Corrections Panel */}
      {corrections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {corrections.length} Issue{corrections.length !== 1 ? "s" : ""} Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {corrections.map((correction, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <Badge className={getTypeColor(correction.type)}>
                      {correction.type}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="line-through text-red-500">
                          {correction.original}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-green-600 font-medium">
                          {correction.suggestion}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                        {correction.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score Card */}
      {output && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Writing Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="text-2xl font-bold text-green-600">92</div>
                <div className="text-xs text-muted-foreground">Overall Score</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="text-2xl font-bold text-blue-600">A</div>
                <div className="text-xs text-muted-foreground">Readability</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-xs text-muted-foreground">Grammar</div>
              </div>
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                <div className="text-2xl font-bold text-orange-600">Good</div>
                <div className="text-xs text-muted-foreground">Clarity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function checkGrammar(text: string, tone: ToneType): { correctedText: string; foundCorrections: Correction[] } {
  // This is a placeholder. In production, this would call an AI API.
  const corrections: Correction[] = [];
  let corrected = text;

  // Simple grammar rules for demonstration
  const rules = [
    {
      pattern: /\bi\b/g,
      replacement: "I",
      type: "grammar" as const,
      explanation: "The pronoun 'I' should always be capitalized.",
    },
    {
      pattern: /\s{2,}/g,
      replacement: " ",
      type: "style" as const,
      explanation: "Remove extra spaces between words.",
    },
    {
      pattern: /\bteh\b/gi,
      replacement: "the",
      type: "spelling" as const,
      explanation: "Common typo corrected.",
    },
    {
      pattern: /\btheir\s+(is|are)\b/gi,
      replacement: "there $1",
      type: "grammar" as const,
      explanation: "'There' should be used with 'is/are', not 'their'.",
    },
    {
      pattern: /,([^\s])/g,
      replacement: ", $1",
      type: "punctuation" as const,
      explanation: "Add space after comma.",
    },
  ];

  rules.forEach((rule) => {
    const matches = text.match(rule.pattern);
    if (matches) {
      matches.forEach((match) => {
        corrections.push({
          type: rule.type,
          original: match,
          suggestion: match.replace(rule.pattern, rule.replacement),
          explanation: rule.explanation,
        });
      });
      corrected = corrected.replace(rule.pattern, rule.replacement);
    }
  });

  return { correctedText: corrected, foundCorrections: corrections };
}
