import { LucideIcon, PenLine, RefreshCw, CheckCircle, FileSearch, Presentation, BookOpen, Sparkles, Brain, Wand2, MessageSquare } from "lucide-react";

export interface AITool {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  isPremium: boolean;
  dailyLimit?: number;
  color: string;
}

export const aiTools: AITool[] = [
  {
    slug: "ai-essay-writer",
    name: "AI Essay Writer",
    description: "Generate well-structured essays on any topic with proper introduction, body paragraphs, and conclusion.",
    icon: PenLine,
    features: [
      "Multiple essay types (argumentative, expository, narrative)",
      "Customizable length and tone",
      "Automatic outline generation",
      "Built-in plagiarism check",
    ],
    isPremium: false,
    dailyLimit: 5,
    color: "bg-blue-500",
  },
  {
    slug: "ai-paraphraser",
    name: "AI Paraphraser",
    description: "Rewrite text while maintaining the original meaning. Choose from multiple paraphrasing modes.",
    icon: RefreshCw,
    features: [
      "Standard, fluency, and creative modes",
      "Academic tone option",
      "Word-level and sentence-level changes",
      "Side-by-side comparison",
    ],
    isPremium: false,
    dailyLimit: 10,
    color: "bg-green-500",
  },
  {
    slug: "ai-grammar-checker",
    name: "AI Grammar & Tone Improver",
    description: "Fix grammar, spelling, and punctuation errors while improving your writing style and tone.",
    icon: CheckCircle,
    features: [
      "Advanced grammar correction",
      "Tone adjustment (formal, casual, professional)",
      "Clarity improvements",
      "Writing style suggestions",
    ],
    isPremium: false,
    dailyLimit: 20,
    color: "bg-purple-500",
  },
  {
    slug: "ai-summarizer",
    name: "AI Summarizer",
    description: "Condense long articles, papers, or documents into concise summaries without losing key information.",
    icon: FileSearch,
    features: [
      "Adjustable summary length",
      "Key points extraction",
      "Bullet point or paragraph format",
      "Multi-document summarization",
    ],
    isPremium: false,
    dailyLimit: 10,
    color: "bg-orange-500",
  },
  {
    slug: "ai-presentation-generator",
    name: "AI Presentation Generator",
    description: "Create professional presentation outlines and slide content from your topic or document.",
    icon: Presentation,
    features: [
      "Automatic slide structuring",
      "Speaker notes generation",
      "Visual layout suggestions",
      "Export to PowerPoint outline",
    ],
    isPremium: true,
    color: "bg-pink-500",
  },
  {
    slug: "ai-citation-assistant",
    name: "AI Citation Assistant",
    description: "Automatically generate citations from URLs, DOIs, or text. Smart source detection and formatting.",
    icon: BookOpen,
    features: [
      "Auto-detect source type",
      "URL to citation conversion",
      "DOI lookup and formatting",
      "Multiple citation styles",
    ],
    isPremium: false,
    dailyLimit: 15,
    color: "bg-cyan-500",
  },
  {
    slug: "ai-content-generator",
    name: "AI Content Generator",
    description: "Generate blog posts, articles, product descriptions, and marketing copy with AI assistance.",
    icon: Sparkles,
    features: [
      "Multiple content types",
      "SEO optimization",
      "Tone and style customization",
      "Keyword integration",
    ],
    isPremium: true,
    color: "bg-indigo-500",
  },
  {
    slug: "ai-research-assistant",
    name: "AI Research Assistant",
    description: "Get help organizing research, finding connections between sources, and generating literature insights.",
    icon: Brain,
    features: [
      "Source organization",
      "Theme extraction",
      "Gap analysis",
      "Research question refinement",
    ],
    isPremium: true,
    color: "bg-violet-500",
  },
  {
    slug: "ai-rewriter",
    name: "AI Text Rewriter",
    description: "Transform your text completely while keeping the core message. Perfect for content repurposing.",
    icon: Wand2,
    features: [
      "Complete text transformation",
      "Maintain key messages",
      "Multiple output versions",
      "Style adaptation",
    ],
    isPremium: false,
    dailyLimit: 8,
    color: "bg-rose-500",
  },
  {
    slug: "ai-chat-assistant",
    name: "AI Writing Assistant",
    description: "Chat with an AI to brainstorm ideas, get writing feedback, and overcome writer's block.",
    icon: MessageSquare,
    features: [
      "Interactive brainstorming",
      "Writing feedback",
      "Idea generation",
      "Outline assistance",
    ],
    isPremium: true,
    color: "bg-amber-500",
  },
];

export function getAIToolBySlug(slug: string): AITool | undefined {
  return aiTools.find((tool) => tool.slug === slug);
}

export function getFreeAITools(): AITool[] {
  return aiTools.filter((tool) => !tool.isPremium);
}

export function getPremiumAITools(): AITool[] {
  return aiTools.filter((tool) => tool.isPremium);
}
