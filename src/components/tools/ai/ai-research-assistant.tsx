"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, BookOpen, Lightbulb, Target, Users, Copy, CheckCircle, Plus } from "lucide-react";

interface ResearchInsight {
  category: string;
  title: string;
  description: string;
  sources?: string[];
}

export default function AIResearchAssistant() {
  const [researchQuestion, setResearchQuestion] = useState("");
  const [sources, setSources] = useState("");
  const [analysisType, setAnalysisType] = useState("themes");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<ResearchInsight[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const analysisTypes = [
    { value: "themes", label: "Theme Extraction" },
    { value: "gaps", label: "Gap Analysis" },
    { value: "connections", label: "Source Connections" },
    { value: "questions", label: "Research Questions" },
    { value: "synthesis", label: "Literature Synthesis" },
  ];

  const handleAnalyze = () => {
    if (!researchQuestion.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockInsights: ResearchInsight[] = [
        {
          category: "Key Theme",
          title: "Emerging Trends in the Field",
          description: "Based on your research question, there's a clear trend toward integration of technology and traditional methods. Multiple sources indicate a shift in methodology over the past 5 years.",
          sources: ["Source 1", "Source 3", "Source 5"],
        },
        {
          category: "Research Gap",
          title: "Underexplored Area Identified",
          description: "Current literature lacks substantial research on the long-term effects and cross-cultural applications. This presents an opportunity for original contribution.",
          sources: ["Source 2", "Source 4"],
        },
        {
          category: "Methodology Note",
          title: "Common Research Approaches",
          description: "The majority of existing studies use quantitative methods. Consider incorporating qualitative approaches for a more comprehensive analysis.",
        },
        {
          category: "Key Finding",
          title: "Consensus in Literature",
          description: "There appears to be general agreement among researchers that the fundamental principles remain valid, though applications vary significantly by context.",
          sources: ["Source 1", "Source 2", "Source 3"],
        },
        {
          category: "Recommendation",
          title: "Suggested Focus Areas",
          description: "Based on the analysis, focusing on practical applications and case studies would strengthen your research. Consider narrowing scope to a specific industry or demographic.",
        },
        {
          category: "Question Refinement",
          title: "Alternative Research Questions",
          description: "Consider reframing your question to: 'How does [X] impact [Y] in the context of [Z]?' This provides clearer scope and measurable outcomes.",
        },
      ];
      
      setInsights(mockInsights);
      setIsAnalyzing(false);
    }, 2500);
  };

  const copyInsight = (index: number) => {
    const insight = insights[index];
    const text = `${insight.category}: ${insight.title}\n\n${insight.description}${insight.sources ? `\n\nRelevant sources: ${insight.sources.join(', ')}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Research Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Research Question or Topic</Label>
              <Textarea
                id="question"
                placeholder="e.g., What are the effects of social media usage on adolescent mental health?"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sources">Your Sources (optional)</Label>
              <Textarea
                id="sources"
                placeholder="Paste your source notes, abstracts, or key findings here. Separate different sources with a blank line."
                value={sources}
                onChange={(e) => setSources(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Adding sources helps the AI provide more relevant insights
              </p>
            </div>

            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAnalyze} 
              className="w-full" 
              disabled={!researchQuestion.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Analyzing Research...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Research
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              <Badge variant="secondary" className="mr-2">Premium</Badge>
              Advanced research analysis with Pro plan
            </div>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Research Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your research question to get AI-powered insights</p>
                <p className="text-xs mt-2">
                  Get theme extraction, gap analysis, and more
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge
                        variant={
                          insight.category === "Research Gap"
                            ? "destructive"
                            : insight.category === "Key Theme"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {insight.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyInsight(index)}
                      >
                        {copiedIndex === index ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                    {insight.sources && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {insight.sources.map((source, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <Target className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-medium text-sm">Refine Question</div>
                  <div className="text-xs text-muted-foreground">
                    Narrow your research scope
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <BookOpen className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-medium text-sm">Find More Sources</div>
                  <div className="text-xs text-muted-foreground">
                    Discover related literature
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <Users className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-medium text-sm">Compare Studies</div>
                  <div className="text-xs text-muted-foreground">
                    Analyze methodology differences
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
