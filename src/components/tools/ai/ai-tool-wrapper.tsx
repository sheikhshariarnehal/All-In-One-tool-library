"use client";

import { Suspense, lazy, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load AI tool components
const AIEssayWriter = lazy(() => import("./ai-essay-writer"));
const AIParaphraser = lazy(() => import("./ai-paraphraser"));
const AIGrammarChecker = lazy(() => import("./ai-grammar-checker"));
const AISummarizer = lazy(() => import("./ai-summarizer"));
const AIPresentationGenerator = lazy(() => import("./ai-presentation-generator"));
const AICitationAssistant = lazy(() => import("./ai-citation-assistant"));
const AIContentGenerator = lazy(() => import("./ai-content-generator"));
const AIResearchAssistant = lazy(() => import("./ai-research-assistant"));
const AIRewriter = lazy(() => import("./ai-rewriter"));

const componentMap: Record<string, ComponentType> = {
  "ai-essay-writer": AIEssayWriter,
  "ai-paraphraser": AIParaphraser,
  "ai-grammar-checker": AIGrammarChecker,
  "ai-summarizer": AISummarizer,
  "ai-presentation-generator": AIPresentationGenerator,
  "ai-citation-assistant": AICitationAssistant,
  "ai-content-generator": AIContentGenerator,
  "ai-research-assistant": AIResearchAssistant,
  "ai-rewriter": AIRewriter,
  "ai-chat-assistant": AIEssayWriter, // Placeholder - uses essay writer for now
};

interface AIToolWrapperProps {
  slug: string;
}

function LoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    </div>
  );
}

export function AIToolWrapper({ slug }: AIToolWrapperProps) {
  const Component = componentMap[slug];

  if (!Component) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          This tool is coming soon. Check back later!
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}
