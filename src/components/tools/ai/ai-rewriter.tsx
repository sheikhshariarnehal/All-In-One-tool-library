"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2, Copy, CheckCircle, RefreshCw, Sparkles, ArrowRight } from "lucide-react";

export default function AIRewriter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [rewriteStyle, setRewriteStyle] = useState("transform");
  const [targetAudience, setTargetAudience] = useState("general");
  const [isRewriting, setIsRewriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState({ original: 0, rewritten: 0 });

  const rewriteStyles = [
    { value: "transform", label: "Complete Transform" },
    { value: "simplify", label: "Simplify" },
    { value: "elaborate", label: "Elaborate & Expand" },
    { value: "formal", label: "Make Formal" },
    { value: "casual", label: "Make Casual" },
    { value: "persuasive", label: "Make Persuasive" },
    { value: "story", label: "Convert to Story" },
  ];

  const audiences = [
    { value: "general", label: "General Audience" },
    { value: "academic", label: "Academic" },
    { value: "business", label: "Business Professionals" },
    { value: "children", label: "Children (Simple Language)" },
    { value: "technical", label: "Technical Experts" },
    { value: "marketing", label: "Marketing/Sales" },
  ];

  const handleRewrite = () => {
    if (!inputText.trim()) return;
    
    setIsRewriting(true);
    
    setTimeout(() => {
      const originalWords = inputText.trim().split(/\s+/).length;
      
      // Simulated AI rewriting based on style
      let rewritten = "";
      
      switch (rewriteStyle) {
        case "simplify":
          rewritten = `Here's a simpler version:\n\n${inputText
            .replace(/utilize/gi, "use")
            .replace(/implement/gi, "do")
            .replace(/approximately/gi, "about")
            .replace(/subsequently/gi, "then")
            .replace(/consequently/gi, "so")
            .replace(/facilitate/gi, "help")
            .replace(/demonstrate/gi, "show")}\n\nThis version uses everyday words and shorter sentences to make the content more accessible.`;
          break;
          
        case "elaborate":
          rewritten = `Expanded version:\n\n${inputText}\n\nTo elaborate further on these points:\n\n• The core concept presented here represents a significant development in the field, drawing upon established principles while introducing novel approaches.\n\n• When we examine the implications more closely, we find multiple layers of meaning and application that warrant further exploration.\n\n• The practical applications of these ideas extend across various domains, offering opportunities for innovation and improvement.\n\n• Future developments in this area are likely to build upon these foundations, creating new possibilities for advancement.`;
          break;
          
        case "formal":
          rewritten = `Formal version:\n\n${inputText
            .replace(/can't/gi, "cannot")
            .replace(/won't/gi, "will not")
            .replace(/don't/gi, "do not")
            .replace(/isn't/gi, "is not")
            .replace(/aren't/gi, "are not")
            .replace(/I think/gi, "It is believed")
            .replace(/you should/gi, "one should")
            .replace(/a lot of/gi, "numerous")
            .replace(/get/gi, "obtain")}\n\nThis text has been revised to employ formal language conventions suitable for academic, professional, or official contexts.`;
          break;
          
        case "casual":
          rewritten = `Casual version:\n\nSo basically, here's the deal: ${inputText.toLowerCase()}\n\nPretty straightforward, right? The main thing to remember is that this stuff isn't as complicated as it might seem at first. Just take it one step at a time and you'll be good to go!`;
          break;
          
        case "persuasive":
          rewritten = `Persuasive version:\n\nImagine this: ${inputText}\n\nBut here's what makes this truly remarkable...\n\nEvery day, countless people are discovering the transformative power of these ideas. Don't get left behind. The opportunity is right here, right now.\n\nThe question isn't whether you should act on this – it's whether you can afford not to. Take the first step today and see the difference for yourself.`;
          break;
          
        case "story":
          rewritten = `Story version:\n\nOnce upon a time, in a world much like our own, there was a discovery that would change everything.\n\n"${inputText.slice(0, 100)}..." the wise mentor explained to the eager student.\n\nThe student's eyes widened with understanding. "So you mean..."\n\n"Exactly," the mentor nodded. "And that's just the beginning of the story."\n\nFrom that day forward, everything was different. The knowledge spread, touching lives and creating ripples that would be felt for generations to come.`;
          break;
          
        default: // transform
          const sentences = inputText.split(/[.!?]+/).filter(s => s.trim());
          const transformed = sentences.map(sentence => {
            const words = sentence.trim().split(' ');
            if (words.length > 5) {
              // Restructure longer sentences
              const midpoint = Math.floor(words.length / 2);
              return words.slice(midpoint).join(' ') + ', ' + words.slice(0, midpoint).join(' ').toLowerCase();
            }
            return sentence.trim();
          });
          rewritten = `Transformed version:\n\n${transformed.join('. ')}.\n\nThe original message has been completely restructured while preserving the core meaning. This version offers a fresh perspective on the same content, making it suitable for repurposing across different platforms or contexts.`;
      }
      
      setOutputText(rewritten);
      setWordCount({
        original: originalWords,
        rewritten: rewritten.trim().split(/\s+/).length,
      });
      setIsRewriting(false);
    }, 1800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Original Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter the text you want to completely rewrite. The AI will transform it while keeping the core message intact..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            
            {inputText && (
              <div className="text-xs text-muted-foreground text-right">
                {inputText.trim().split(/\s+/).filter(w => w).length} words
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rewrite Style</Label>
                <Select value={rewriteStyle} onValueChange={setRewriteStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rewriteStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((audience) => (
                      <SelectItem key={audience.value} value={audience.value}>
                        {audience.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleRewrite} 
              className="w-full" 
              disabled={!inputText.trim() || isRewriting}
            >
              {isRewriting ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Rewrite Text
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              8 rewrites per day • Upgrade for unlimited
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Rewritten Text
              </CardTitle>
              {outputText && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRewrite}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!outputText ? (
              <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg">
                <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter text and click rewrite to transform it</p>
                <p className="text-xs mt-2">
                  Perfect for repurposing content
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  className="min-h-[280px] resize-none"
                />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex gap-4">
                    <span>Original: {wordCount.original} words</span>
                    <span>Rewritten: {wordCount.rewritten} words</span>
                  </div>
                  <Badge variant="outline">
                    {rewriteStyles.find(s => s.value === rewriteStyle)?.label}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
