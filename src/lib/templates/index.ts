import { FileText, GraduationCap, Briefcase, Presentation, FileSpreadsheet, BookOpen, FileCheck, Users, PenTool } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "academic" | "professional";
  subcategory: string;
  formats: ("docx" | "pdf" | "pptx" | "xlsx")[];
  thumbnail: string;
  downloads: number;
  isPremium: boolean;
  tags: string[];
}

export interface TemplateCategory {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  type: "academic" | "professional";
}

export const templateCategories: TemplateCategory[] = [
  // Academic Categories
  {
    slug: "research-papers",
    name: "Research Papers",
    description: "APA, MLA, Chicago, and Harvard formatted research paper templates",
    icon: FileText,
    type: "academic",
  },
  {
    slug: "thesis-dissertation",
    name: "Thesis & Dissertation",
    description: "Complete thesis and dissertation templates with proper formatting",
    icon: BookOpen,
    type: "academic",
  },
  {
    slug: "lab-reports",
    name: "Lab Reports",
    description: "Scientific lab report templates for various disciplines",
    icon: FileCheck,
    type: "academic",
  },
  {
    slug: "presentations",
    name: "Academic Presentations",
    description: "PowerPoint templates for academic presentations and defenses",
    icon: Presentation,
    type: "academic",
  },
  {
    slug: "essays",
    name: "Essays & Outlines",
    description: "Essay templates and outline structures for various essay types",
    icon: PenTool,
    type: "academic",
  },
  {
    slug: "literature-reviews",
    name: "Literature Reviews",
    description: "Templates for organizing and writing literature reviews",
    icon: GraduationCap,
    type: "academic",
  },
  // Professional Categories
  {
    slug: "resumes",
    name: "Resumes & CVs",
    description: "Professional resume and CV templates for various industries",
    icon: Users,
    type: "professional",
  },
  {
    slug: "cover-letters",
    name: "Cover Letters",
    description: "Compelling cover letter templates for job applications",
    icon: FileText,
    type: "professional",
  },
  {
    slug: "business-proposals",
    name: "Business Proposals",
    description: "Professional business proposal and pitch templates",
    icon: Briefcase,
    type: "professional",
  },
  {
    slug: "meeting-minutes",
    name: "Meeting Minutes",
    description: "Meeting minutes and agenda templates",
    icon: FileCheck,
    type: "professional",
  },
  {
    slug: "project-management",
    name: "Project Management",
    description: "Project charters, plans, and management templates",
    icon: FileSpreadsheet,
    type: "professional",
  },
  {
    slug: "content-planning",
    name: "Content Planning",
    description: "Content calendars, blog outlines, and editorial templates",
    icon: PenTool,
    type: "professional",
  },
];

export const templates: Template[] = [
  // Academic Templates - Research Papers
  {
    id: "apa-research-paper",
    name: "APA Research Paper",
    description: "Complete APA 7th edition research paper template with title page, abstract, and references",
    category: "academic",
    subcategory: "research-papers",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/apa-research.png",
    downloads: 15420,
    isPremium: false,
    tags: ["apa", "research", "academic", "paper"],
  },
  {
    id: "mla-research-paper",
    name: "MLA Research Paper",
    description: "MLA 9th edition formatted research paper template with works cited page",
    category: "academic",
    subcategory: "research-papers",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/mla-research.png",
    downloads: 12350,
    isPremium: false,
    tags: ["mla", "research", "academic", "paper"],
  },
  {
    id: "chicago-research-paper",
    name: "Chicago Style Paper",
    description: "Chicago/Turabian style research paper template with footnotes",
    category: "academic",
    subcategory: "research-papers",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/chicago-research.png",
    downloads: 8920,
    isPremium: false,
    tags: ["chicago", "turabian", "research", "academic"],
  },
  {
    id: "harvard-research-paper",
    name: "Harvard Reference Paper",
    description: "Harvard referencing style research paper template",
    category: "academic",
    subcategory: "research-papers",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/harvard-research.png",
    downloads: 7650,
    isPremium: false,
    tags: ["harvard", "research", "academic", "paper"],
  },

  // Academic Templates - Thesis & Dissertation
  {
    id: "masters-thesis",
    name: "Master's Thesis Template",
    description: "Comprehensive master's thesis template with all required sections",
    category: "academic",
    subcategory: "thesis-dissertation",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/masters-thesis.png",
    downloads: 9870,
    isPremium: true,
    tags: ["thesis", "masters", "graduate", "academic"],
  },
  {
    id: "phd-dissertation",
    name: "PhD Dissertation Template",
    description: "Complete PhD dissertation template with chapters and appendices",
    category: "academic",
    subcategory: "thesis-dissertation",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/phd-dissertation.png",
    downloads: 6540,
    isPremium: true,
    tags: ["dissertation", "phd", "doctoral", "academic"],
  },
  {
    id: "thesis-proposal",
    name: "Thesis Proposal",
    description: "Thesis proposal template with research methodology sections",
    category: "academic",
    subcategory: "thesis-dissertation",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/thesis-proposal.png",
    downloads: 11230,
    isPremium: false,
    tags: ["proposal", "thesis", "research", "academic"],
  },

  // Academic Templates - Lab Reports
  {
    id: "science-lab-report",
    name: "Science Lab Report",
    description: "Standard science lab report template with hypothesis, methods, results",
    category: "academic",
    subcategory: "lab-reports",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/science-lab.png",
    downloads: 18920,
    isPremium: false,
    tags: ["lab", "science", "experiment", "report"],
  },
  {
    id: "chemistry-lab-report",
    name: "Chemistry Lab Report",
    description: "Chemistry-specific lab report with chemical equations formatting",
    category: "academic",
    subcategory: "lab-reports",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/chemistry-lab.png",
    downloads: 14560,
    isPremium: false,
    tags: ["chemistry", "lab", "experiment", "report"],
  },
  {
    id: "biology-lab-report",
    name: "Biology Lab Report",
    description: "Biology lab report template with diagrams and data tables",
    category: "academic",
    subcategory: "lab-reports",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/biology-lab.png",
    downloads: 13450,
    isPremium: false,
    tags: ["biology", "lab", "experiment", "report"],
  },

  // Academic Templates - Presentations
  {
    id: "thesis-defense",
    name: "Thesis Defense Presentation",
    description: "Professional thesis defense PowerPoint template",
    category: "academic",
    subcategory: "presentations",
    formats: ["pptx"],
    thumbnail: "/templates/thumbnails/thesis-defense.png",
    downloads: 8970,
    isPremium: true,
    tags: ["presentation", "thesis", "defense", "slides"],
  },
  {
    id: "research-presentation",
    name: "Research Presentation",
    description: "Academic research presentation template with data visualization",
    category: "academic",
    subcategory: "presentations",
    formats: ["pptx"],
    thumbnail: "/templates/thumbnails/research-ppt.png",
    downloads: 16780,
    isPremium: false,
    tags: ["presentation", "research", "academic", "slides"],
  },
  {
    id: "conference-presentation",
    name: "Conference Presentation",
    description: "Professional conference presentation template",
    category: "academic",
    subcategory: "presentations",
    formats: ["pptx"],
    thumbnail: "/templates/thumbnails/conference-ppt.png",
    downloads: 7890,
    isPremium: false,
    tags: ["conference", "presentation", "academic", "slides"],
  },

  // Academic Templates - Essays
  {
    id: "argumentative-essay",
    name: "Argumentative Essay",
    description: "Argumentative essay template with thesis statement and counterarguments",
    category: "academic",
    subcategory: "essays",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/argumentative-essay.png",
    downloads: 21340,
    isPremium: false,
    tags: ["essay", "argumentative", "writing", "academic"],
  },
  {
    id: "compare-contrast-essay",
    name: "Compare & Contrast Essay",
    description: "Compare and contrast essay template with organizational structure",
    category: "academic",
    subcategory: "essays",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/compare-essay.png",
    downloads: 18670,
    isPremium: false,
    tags: ["essay", "compare", "contrast", "academic"],
  },
  {
    id: "essay-outline",
    name: "Essay Outline Template",
    description: "Comprehensive essay outline template for planning your essays",
    category: "academic",
    subcategory: "essays",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/essay-outline.png",
    downloads: 25890,
    isPremium: false,
    tags: ["outline", "essay", "planning", "academic"],
  },

  // Academic Templates - Literature Reviews
  {
    id: "literature-review",
    name: "Literature Review Template",
    description: "Structured literature review template with synthesis matrix",
    category: "academic",
    subcategory: "literature-reviews",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/lit-review.png",
    downloads: 12450,
    isPremium: false,
    tags: ["literature", "review", "research", "academic"],
  },
  {
    id: "annotated-bibliography",
    name: "Annotated Bibliography",
    description: "Annotated bibliography template with summary and evaluation sections",
    category: "academic",
    subcategory: "literature-reviews",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/annotated-bib.png",
    downloads: 14780,
    isPremium: false,
    tags: ["bibliography", "annotated", "research", "academic"],
  },

  // Professional Templates - Resumes
  {
    id: "modern-resume",
    name: "Modern Resume",
    description: "Clean, modern resume template for professionals",
    category: "professional",
    subcategory: "resumes",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/modern-resume.png",
    downloads: 45670,
    isPremium: false,
    tags: ["resume", "cv", "job", "professional"],
  },
  {
    id: "creative-resume",
    name: "Creative Resume",
    description: "Creative resume template for designers and creatives",
    category: "professional",
    subcategory: "resumes",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/creative-resume.png",
    downloads: 28940,
    isPremium: true,
    tags: ["resume", "creative", "design", "professional"],
  },
  {
    id: "executive-resume",
    name: "Executive Resume",
    description: "Executive-level resume template for senior professionals",
    category: "professional",
    subcategory: "resumes",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/executive-resume.png",
    downloads: 18760,
    isPremium: true,
    tags: ["resume", "executive", "leadership", "professional"],
  },
  {
    id: "academic-cv",
    name: "Academic CV",
    description: "Academic curriculum vitae template for researchers and educators",
    category: "professional",
    subcategory: "resumes",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/academic-cv.png",
    downloads: 21340,
    isPremium: false,
    tags: ["cv", "academic", "research", "professor"],
  },

  // Professional Templates - Cover Letters
  {
    id: "professional-cover-letter",
    name: "Professional Cover Letter",
    description: "Standard professional cover letter template",
    category: "professional",
    subcategory: "cover-letters",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/cover-letter.png",
    downloads: 34560,
    isPremium: false,
    tags: ["cover letter", "job", "application", "professional"],
  },
  {
    id: "entry-level-cover-letter",
    name: "Entry-Level Cover Letter",
    description: "Cover letter template for recent graduates and entry-level positions",
    category: "professional",
    subcategory: "cover-letters",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/entry-cover.png",
    downloads: 28970,
    isPremium: false,
    tags: ["cover letter", "entry level", "graduate", "job"],
  },

  // Professional Templates - Business Proposals
  {
    id: "business-proposal",
    name: "Business Proposal",
    description: "Comprehensive business proposal template with executive summary",
    category: "professional",
    subcategory: "business-proposals",
    formats: ["docx", "pdf", "pptx"],
    thumbnail: "/templates/thumbnails/business-proposal.png",
    downloads: 15670,
    isPremium: true,
    tags: ["proposal", "business", "client", "professional"],
  },
  {
    id: "project-proposal",
    name: "Project Proposal",
    description: "Project proposal template with timeline and budget sections",
    category: "professional",
    subcategory: "business-proposals",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/project-proposal.png",
    downloads: 12340,
    isPremium: false,
    tags: ["proposal", "project", "planning", "professional"],
  },
  {
    id: "swot-analysis",
    name: "SWOT Analysis",
    description: "SWOT analysis template for strategic planning",
    category: "professional",
    subcategory: "business-proposals",
    formats: ["docx", "pdf", "pptx"],
    thumbnail: "/templates/thumbnails/swot.png",
    downloads: 19870,
    isPremium: false,
    tags: ["swot", "analysis", "strategy", "business"],
  },

  // Professional Templates - Meeting Minutes
  {
    id: "meeting-minutes",
    name: "Meeting Minutes",
    description: "Professional meeting minutes template with action items",
    category: "professional",
    subcategory: "meeting-minutes",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/meeting-minutes.png",
    downloads: 23450,
    isPremium: false,
    tags: ["meeting", "minutes", "notes", "professional"],
  },
  {
    id: "meeting-agenda",
    name: "Meeting Agenda",
    description: "Meeting agenda template with time allocations",
    category: "professional",
    subcategory: "meeting-minutes",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/meeting-agenda.png",
    downloads: 18970,
    isPremium: false,
    tags: ["meeting", "agenda", "planning", "professional"],
  },

  // Professional Templates - Project Management
  {
    id: "project-charter",
    name: "Project Charter",
    description: "Project charter template with objectives and stakeholders",
    category: "professional",
    subcategory: "project-management",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/project-charter.png",
    downloads: 14560,
    isPremium: false,
    tags: ["project", "charter", "management", "professional"],
  },
  {
    id: "project-plan",
    name: "Project Plan",
    description: "Comprehensive project plan template with milestones",
    category: "professional",
    subcategory: "project-management",
    formats: ["docx", "pdf", "xlsx"],
    thumbnail: "/templates/thumbnails/project-plan.png",
    downloads: 16780,
    isPremium: true,
    tags: ["project", "plan", "timeline", "management"],
  },
  {
    id: "gantt-chart",
    name: "Gantt Chart",
    description: "Project Gantt chart template for timeline visualization",
    category: "professional",
    subcategory: "project-management",
    formats: ["xlsx", "pptx"],
    thumbnail: "/templates/thumbnails/gantt.png",
    downloads: 21340,
    isPremium: false,
    tags: ["gantt", "chart", "timeline", "project"],
  },

  // Professional Templates - Content Planning
  {
    id: "content-calendar",
    name: "Content Calendar",
    description: "Monthly content calendar template for social media and blogs",
    category: "professional",
    subcategory: "content-planning",
    formats: ["xlsx", "pdf"],
    thumbnail: "/templates/thumbnails/content-calendar.png",
    downloads: 27890,
    isPremium: false,
    tags: ["content", "calendar", "social media", "planning"],
  },
  {
    id: "blog-outline",
    name: "Blog Post Outline",
    description: "Blog post outline template with SEO considerations",
    category: "professional",
    subcategory: "content-planning",
    formats: ["docx", "pdf"],
    thumbnail: "/templates/thumbnails/blog-outline.png",
    downloads: 19450,
    isPremium: false,
    tags: ["blog", "outline", "content", "seo"],
  },
  {
    id: "editorial-calendar",
    name: "Editorial Calendar",
    description: "Editorial calendar template for content teams",
    category: "professional",
    subcategory: "content-planning",
    formats: ["xlsx"],
    thumbnail: "/templates/thumbnails/editorial-calendar.png",
    downloads: 12670,
    isPremium: true,
    tags: ["editorial", "calendar", "content", "team"],
  },
];

export function getTemplatesByCategory(category: "academic" | "professional"): Template[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplatesBySubcategory(subcategory: string): Template[] {
  return templates.filter((t) => t.subcategory === subcategory);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplateCategories(type: "academic" | "professional"): TemplateCategory[] {
  return templateCategories.filter((c) => c.type === type);
}

export function searchTemplates(query: string): Template[] {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.includes(lowerQuery))
  );
}
