"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Link2, FileText, Copy, CheckCircle, Sparkles, Plus, Trash2 } from "lucide-react";

interface Citation {
  id: string;
  type: string;
  formatted: string;
  raw: {
    authors?: string;
    title?: string;
    year?: string;
    source?: string;
    url?: string;
  };
}

export default function AICitationAssistant() {
  const [inputType, setInputType] = useState("url");
  const [urlInput, setUrlInput] = useState("");
  const [doiInput, setDoiInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [citationStyle, setCitationStyle] = useState("apa7");
  const [isProcessing, setIsProcessing] = useState(false);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const citationStyles = [
    { value: "apa7", label: "APA 7th Edition" },
    { value: "mla9", label: "MLA 9th Edition" },
    { value: "chicago", label: "Chicago" },
    { value: "harvard", label: "Harvard" },
    { value: "ieee", label: "IEEE" },
    { value: "vancouver", label: "Vancouver" },
  ];

  const formatCitation = (raw: Citation["raw"], style: string): string => {
    const authors = raw.authors || "Unknown Author";
    const title = raw.title || "Untitled";
    const year = raw.year || "n.d.";
    const source = raw.source || "";
    const url = raw.url || "";

    switch (style) {
      case "apa7":
        return `${authors}. (${year}). ${title}. ${source}${url ? `. Retrieved from ${url}` : ""}`;
      case "mla9":
        return `${authors}. "${title}." ${source}, ${year}${url ? `. ${url}` : ""}.`;
      case "chicago":
        return `${authors}. "${title}." ${source} (${year})${url ? `. ${url}` : ""}.`;
      case "harvard":
        return `${authors} (${year}) '${title}', ${source}${url ? `. Available at: ${url}` : ""}.`;
      case "ieee":
        return `${authors}, "${title}," ${source}, ${year}${url ? `. [Online]. Available: ${url}` : ""}.`;
      case "vancouver":
        return `${authors}. ${title}. ${source}. ${year}${url ? `. Available from: ${url}` : ""}.`;
      default:
        return `${authors}. (${year}). ${title}. ${source}`;
    }
  };

  const handleGenerate = () => {
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      let newCitation: Citation;
      const id = Date.now().toString();

      if (inputType === "url" && urlInput) {
        const raw = {
          authors: "Smith, J., & Johnson, M.",
          title: "Understanding Modern Web Development",
          year: "2024",
          source: "Tech Blog",
          url: urlInput,
        };
        newCitation = {
          id,
          type: "website",
          formatted: formatCitation(raw, citationStyle),
          raw,
        };
      } else if (inputType === "doi" && doiInput) {
        const raw = {
          authors: "Williams, R., Chen, L., & Davis, K.",
          title: "Advances in Machine Learning Applications",
          year: "2023",
          source: "Journal of Computer Science, 45(3), 234-256",
          url: `https://doi.org/${doiInput}`,
        };
        newCitation = {
          id,
          type: "journal",
          formatted: formatCitation(raw, citationStyle),
          raw,
        };
      } else if (inputType === "text" && textInput) {
        const raw = {
          authors: "Brown, A.",
          title: textInput.slice(0, 50) + (textInput.length > 50 ? "..." : ""),
          year: "2024",
          source: "Detected Source",
        };
        newCitation = {
          id,
          type: "text",
          formatted: formatCitation(raw, citationStyle),
          raw,
        };
      } else {
        setIsProcessing(false);
        return;
      }

      setCitations([newCitation, ...citations]);
      setUrlInput("");
      setDoiInput("");
      setTextInput("");
      setIsProcessing(false);
    }, 1500);
  };

  const copyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeCitation = (id: string) => {
    setCitations(citations.filter((c) => c.id !== id));
  };

  const updateCitationStyle = (newStyle: string) => {
    setCitationStyle(newStyle);
    setCitations(citations.map((c) => ({
      ...c,
      formatted: formatCitation(c.raw, newStyle),
    })));
  };

  const copyAllCitations = () => {
    const text = citations.map((c) => c.formatted).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Add Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={inputType} onValueChange={setInputType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="url">
                  <Link2 className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="doi">
                  <FileText className="h-4 w-4 mr-2" />
                  DOI
                </TabsTrigger>
                <TabsTrigger value="text">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/article"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste any URL and we'll extract the citation information
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="doi" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="doi">DOI (Digital Object Identifier)</Label>
                  <Input
                    id="doi"
                    placeholder="10.1000/xyz123"
                    value={doiInput}
                    onChange={(e) => setDoiInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a DOI to automatically fetch publication details
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Source Information</Label>
                  <Textarea
                    id="text"
                    placeholder="Paste citation text, bibliography entry, or source description..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Our AI will parse and format the citation for you
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>Citation Style</Label>
              <Select value={citationStyle} onValueChange={updateCitationStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {citationStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={isProcessing || (!urlInput && !doiInput && !textInput)}
            >
              {isProcessing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Citation
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              15 citations per day • Upgrade for unlimited
            </div>
          </CardContent>
        </Card>

        {/* Citations List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Citations ({citations.length})</CardTitle>
              {citations.length > 0 && (
                <Button variant="outline" size="sm" onClick={copyAllCitations}>
                  {copiedId === "all" ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  Copy All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {citations.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Add sources to generate citations</p>
                <p className="text-xs mt-2">
                  Supports URLs, DOIs, and text input
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {citation.type}
                        </Badge>
                        <p className="text-sm leading-relaxed">
                          {citation.formatted}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyCitation(citation.id, citation.formatted)}
                        >
                          {copiedId === citation.id ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeCitation(citation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
