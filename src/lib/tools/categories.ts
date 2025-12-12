import { LucideIcon, FileText, GraduationCap, Briefcase, Sparkles, Code, Image, Layout, Wrench } from "lucide-react";

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  toolCount: number;
}

export const categories: Category[] = [
  {
    slug: "document",
    name: "Document Tools",
    description: "PDF editing, conversion, compression, and document management tools.",
    icon: FileText,
    toolCount: 8,
  },
  {
    slug: "academic",
    name: "Academic & Writing",
    description: "Citation generators, plagiarism checkers, and writing assistance tools.",
    icon: GraduationCap,
    toolCount: 12,
  },
  {
    slug: "templates",
    name: "Templates Library",
    description: "Research papers, resumes, reports, and professional document templates.",
    icon: Layout,
    toolCount: 15,
  },
  {
    slug: "professional",
    name: "Professional Tools",
    description: "Business documents, invoices, contracts, and productivity tools.",
    icon: Briefcase,
    toolCount: 10,
  },
  {
    slug: "ai-image",
    name: "AI Image Tools",
    description: "Background removal, image enhancement, compression, and AI-powered editing.",
    icon: Image,
    toolCount: 8,
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "JSON formatters, code beautifiers, encoders, and development utilities.",
    icon: Code,
    toolCount: 15,
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    description: "AI-powered text generation, summarization, and smart assistance.",
    icon: Sparkles,
    toolCount: 6,
  },
  {
    slug: "utilities",
    name: "General Utilities",
    description: "QR codes, link shorteners, calculators, and everyday tools.",
    icon: Wrench,
    toolCount: 10,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return categories.map((category) => category.slug);
}
