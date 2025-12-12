import { LucideIcon, PenLine, Search, Briefcase, FileText, Zap, BookOpen } from "lucide-react";

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
  featured: boolean;
  thumbnail: string;
  tags: string[];
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "academic-writing",
    name: "Academic Writing",
    description: "Tips and guides for essays, research papers, and scholarly writing",
    icon: PenLine,
    color: "bg-blue-500",
  },
  {
    slug: "research-skills",
    name: "Research Skills",
    description: "Learn effective research methods and source evaluation",
    icon: Search,
    color: "bg-green-500",
  },
  {
    slug: "professional-communication",
    name: "Professional Communication",
    description: "Business writing, emails, and workplace communication",
    icon: Briefcase,
    color: "bg-purple-500",
  },
  {
    slug: "templates-tools",
    name: "Templates & Tools",
    description: "Guides on using our templates and tools effectively",
    icon: FileText,
    color: "bg-orange-500",
  },
  {
    slug: "productivity",
    name: "Productivity Tips",
    description: "Work smarter with productivity hacks and time management",
    icon: Zap,
    color: "bg-pink-500",
  },
  {
    slug: "study-guides",
    name: "Study Guides",
    description: "Study techniques, exam prep, and learning strategies",
    icon: BookOpen,
    color: "bg-cyan-500",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-write-research-paper",
    title: "How to Write a Research Paper: A Complete Guide",
    excerpt: "Learn the step-by-step process of writing an effective research paper, from choosing a topic to formatting your citations.",
    content: "",
    category: "academic-writing",
    author: { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg" },
    publishedAt: "2024-12-10",
    readTime: 12,
    featured: true,
    thumbnail: "/blog/research-paper.jpg",
    tags: ["research", "academic", "writing", "paper"],
  },
  {
    slug: "apa-vs-mla-citation-guide",
    title: "APA vs MLA: Which Citation Style Should You Use?",
    excerpt: "A comprehensive comparison of APA and MLA citation styles to help you choose the right format for your paper.",
    content: "",
    category: "academic-writing",
    author: { name: "Michael Chen", avatar: "/avatars/michael.jpg" },
    publishedAt: "2024-12-08",
    readTime: 8,
    featured: true,
    thumbnail: "/blog/citations.jpg",
    tags: ["citation", "apa", "mla", "formatting"],
  },
  {
    slug: "effective-literature-review",
    title: "How to Write an Effective Literature Review",
    excerpt: "Master the art of synthesizing research sources into a cohesive literature review for your thesis or dissertation.",
    content: "",
    category: "research-skills",
    author: { name: "Emily Davis", avatar: "/avatars/emily.jpg" },
    publishedAt: "2024-12-05",
    readTime: 15,
    featured: true,
    thumbnail: "/blog/literature-review.jpg",
    tags: ["literature review", "research", "thesis"],
  },
  {
    slug: "professional-email-templates",
    title: "Professional Email Templates for Every Situation",
    excerpt: "Ready-to-use email templates for job applications, follow-ups, networking, and business communication.",
    content: "",
    category: "professional-communication",
    author: { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg" },
    publishedAt: "2024-12-03",
    readTime: 6,
    featured: false,
    thumbnail: "/blog/email-templates.jpg",
    tags: ["email", "templates", "professional", "business"],
  },
  {
    slug: "using-ai-tools-ethically",
    title: "Using AI Writing Tools Ethically in Academia",
    excerpt: "Guidelines for using AI tools responsibly while maintaining academic integrity in your work.",
    content: "",
    category: "templates-tools",
    author: { name: "Dr. Robert Wilson", avatar: "/avatars/robert.jpg" },
    publishedAt: "2024-12-01",
    readTime: 10,
    featured: true,
    thumbnail: "/blog/ai-ethics.jpg",
    tags: ["ai", "ethics", "academic integrity", "tools"],
  },
  {
    slug: "pomodoro-technique-guide",
    title: "The Pomodoro Technique: Boost Your Study Productivity",
    excerpt: "Learn how to use the Pomodoro Technique to stay focused and accomplish more in less time.",
    content: "",
    category: "productivity",
    author: { name: "Emily Davis", avatar: "/avatars/emily.jpg" },
    publishedAt: "2024-11-28",
    readTime: 7,
    featured: false,
    thumbnail: "/blog/pomodoro.jpg",
    tags: ["productivity", "focus", "study", "time management"],
  },
  {
    slug: "resume-writing-tips",
    title: "10 Resume Writing Tips That Get You Hired",
    excerpt: "Expert tips for crafting a resume that stands out to recruiters and lands you more interviews.",
    content: "",
    category: "professional-communication",
    author: { name: "Michael Chen", avatar: "/avatars/michael.jpg" },
    publishedAt: "2024-11-25",
    readTime: 9,
    featured: false,
    thumbnail: "/blog/resume-tips.jpg",
    tags: ["resume", "job search", "career", "professional"],
  },
  {
    slug: "exam-preparation-strategies",
    title: "Proven Exam Preparation Strategies for Success",
    excerpt: "Science-backed study techniques and exam strategies to help you perform your best on test day.",
    content: "",
    category: "study-guides",
    author: { name: "Dr. Robert Wilson", avatar: "/avatars/robert.jpg" },
    publishedAt: "2024-11-22",
    readTime: 11,
    featured: false,
    thumbnail: "/blog/exam-prep.jpg",
    tags: ["exams", "study", "preparation", "success"],
  },
  {
    slug: "grammar-mistakes-to-avoid",
    title: "15 Common Grammar Mistakes to Avoid in Your Writing",
    excerpt: "Identify and fix the most common grammar errors that undermine your writing credibility.",
    content: "",
    category: "academic-writing",
    author: { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg" },
    publishedAt: "2024-11-20",
    readTime: 8,
    featured: false,
    thumbnail: "/blog/grammar-mistakes.jpg",
    tags: ["grammar", "writing", "mistakes", "tips"],
  },
  {
    slug: "find-credible-sources",
    title: "How to Find and Evaluate Credible Research Sources",
    excerpt: "A guide to identifying reliable academic sources and evaluating their credibility for your research.",
    content: "",
    category: "research-skills",
    author: { name: "Emily Davis", avatar: "/avatars/emily.jpg" },
    publishedAt: "2024-11-18",
    readTime: 10,
    featured: false,
    thumbnail: "/blog/credible-sources.jpg",
    tags: ["research", "sources", "credibility", "evaluation"],
  },
  {
    slug: "thesis-statement-guide",
    title: "How to Write a Strong Thesis Statement",
    excerpt: "Learn to craft compelling thesis statements that anchor your essays and research papers.",
    content: "",
    category: "academic-writing",
    author: { name: "Dr. Robert Wilson", avatar: "/avatars/robert.jpg" },
    publishedAt: "2024-11-15",
    readTime: 6,
    featured: false,
    thumbnail: "/blog/thesis-statement.jpg",
    tags: ["thesis", "writing", "academic", "essay"],
  },
  {
    slug: "cover-letter-guide",
    title: "The Ultimate Guide to Writing Cover Letters",
    excerpt: "Step-by-step instructions for writing cover letters that get you noticed by hiring managers.",
    content: "",
    category: "professional-communication",
    author: { name: "Michael Chen", avatar: "/avatars/michael.jpg" },
    publishedAt: "2024-11-12",
    readTime: 12,
    featured: false,
    thumbnail: "/blog/cover-letter.jpg",
    tags: ["cover letter", "job application", "career"],
  },
];

export function getBlogCategory(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === categorySlug);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getRecentPosts(limit: number = 6): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function searchPosts(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.includes(lowerQuery))
  );
}
