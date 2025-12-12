"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { 
  Download, 
  Search, 
  Crown, 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  FolderOpen,
  File,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  ArrowRight,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Template {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  file_url: string | null;
  preview_url: string | null;
  file_format: string;
  file_size: number | null;
  is_premium: boolean;
  is_active: boolean;
  download_count: number;
  tags: string[] | null;
  created_at: string;
  template_categories?: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  } | null;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
}

function getFormatIcon(format: string) {
  switch (format?.toLowerCase()) {
    case "pptx":
    case "ppt":
      return <Presentation className="h-4 w-4 text-orange-500" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    case "pdf":
      return <File className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-blue-500" />;
  }
}

function getFormatColor(format: string) {
  switch (format?.toLowerCase()) {
    case "pptx":
    case "ppt":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
    case "xlsx":
    case "xls":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "pdf":
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    default:
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  }
}

function formatDownloads(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes === 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getCategoryIcon(iconName: string | null | undefined) {
  const icons: Record<string, React.ReactNode> = {
    FileText: <FileText className="h-4 w-4" />,
    GraduationCap: <FileText className="h-4 w-4" />,
    FlaskConical: <FileText className="h-4 w-4" />,
    PenLine: <FileText className="h-4 w-4" />,
    Briefcase: <FileText className="h-4 w-4" />,
    Mail: <FileText className="h-4 w-4" />,
    Building: <FileText className="h-4 w-4" />,
    Presentation: <Presentation className="h-4 w-4" />,
    FileBarChart: <FileSpreadsheet className="h-4 w-4" />,
    Table: <FileSpreadsheet className="h-4 w-4" />,
    Scale: <FileText className="h-4 w-4" />,
    Heart: <FileText className="h-4 w-4" />,
  };
  return icons[iconName || "FileText"] || <FolderOpen className="h-4 w-4" />;
}

export default function TemplatesPage() {
  // State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [showPremiumOnly, setShowPremiumOnly] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch templates
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const [templatesRes, categoriesRes] = await Promise.all([
          fetch("/api/templates"),
          fetch("/api/templates/categories"),
        ]);

        if (templatesRes.ok) {
          const data = await templatesRes.json();
          setTemplates(data.templates || []);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((t) => t.category_id === selectedCategory);
    }

    if (selectedFormat !== "all") {
      result = result.filter((t) => t.file_format.toLowerCase() === selectedFormat);
    }

    if (showPremiumOnly === "free") {
      result = result.filter((t) => !t.is_premium);
    } else if (showPremiumOnly === "premium") {
      result = result.filter((t) => t.is_premium);
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.download_count - a.download_count);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [templates, searchQuery, selectedCategory, selectedFormat, showPremiumOnly, sortBy]);

  // Get unique formats
  const availableFormats = useMemo(() => {
    const formats = new Set(templates.map((t) => t.file_format.toLowerCase()));
    return Array.from(formats).sort();
  }, [templates]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedFormat !== "all") count++;
    if (showPremiumOnly !== "all") count++;
    return count;
  }, [selectedCategory, selectedFormat, showPremiumOnly]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedFormat("all");
    setShowPremiumOnly("all");
    setSortBy("newest");
  };

  // Handle download
  const handleDownload = async (template: Template) => {
    if (template.is_premium) {
      toast.info("Premium templates require a Pro subscription", {
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/pricing",
        },
      });
      return;
    }

    if (!template.file_url) {
      toast.error("Download link not available");
      return;
    }

    setDownloading(template.id);
    try {
      fetch(`/api/templates/${template.id}/download`, { method: "POST" }).catch(() => {});
      window.open(template.file_url, "_blank");
      toast.success("Download started!");
    } catch {
      toast.error("Failed to start download");
    } finally {
      setDownloading(null);
    }
  };

  // Stats
  const totalTemplates = templates.length;
  const freeTemplates = templates.filter((t) => !t.is_premium).length;
  const totalDownloads = templates.reduce((sum, t) => sum + t.download_count, 0);
  const premiumTemplates = templates.filter((t) => t.is_premium).length;

  // Filter Panel Component
  const FilterPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? "space-y-6 p-4" : "flex flex-wrap items-center gap-3"}>
      {/* Format Filter */}
      <div className={isMobile ? "" : "flex items-center gap-2"}>
        {isMobile && <label className="text-sm font-medium mb-2 block">File Format</label>}
        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
          <SelectTrigger className={isMobile ? "w-full" : "w-36 h-9"}>
            <SelectValue placeholder="All Formats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {availableFormats.map((format) => (
              <SelectItem key={format} value={format}>
                <div className="flex items-center gap-2">
                  {getFormatIcon(format)}
                  <span className="uppercase">{format}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div className={isMobile ? "" : "flex items-center gap-2"}>
        {isMobile && <label className="text-sm font-medium mb-2 block">Access Type</label>}
        <Select value={showPremiumOnly} onValueChange={setShowPremiumOnly}>
          <SelectTrigger className={isMobile ? "w-full" : "w-36 h-9"}>
            <SelectValue placeholder="All Templates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="free">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Free Only</span>
              </div>
            </SelectItem>
            <SelectItem value="premium">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span>Premium Only</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className={isMobile ? "" : "flex items-center gap-2"}>
        {isMobile && <label className="text-sm font-medium mb-2 block">Sort By</label>}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className={isMobile ? "w-full" : "w-40 h-9"}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Newest First</span>
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Oldest First</span>
              </div>
            </SelectItem>
            <SelectItem value="popular">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </SelectItem>
            <SelectItem value="name">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Name (A-Z)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter - Mobile Only */}
      {isMobile && (
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.icon)}
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {activeFiltersCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          className={isMobile ? "w-full mt-4" : ""}
          onClick={() => {
            clearFilters();
            if (isMobile) setMobileFiltersOpen(false);
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  // Categories Sidebar Component
  const CategoriesSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-1">
      <button
        onClick={() => {
          setSelectedCategory("all");
          if (isMobile) setMobileFiltersOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          selectedCategory === "all"
            ? "bg-primary text-primary-foreground shadow-md"
            : "hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:translate-x-1"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${
            selectedCategory === "all" 
              ? "bg-primary-foreground/20" 
              : "bg-muted"
          }`}>
            <FolderOpen className="h-4 w-4" />
          </div>
          <span>All Templates</span>
        </div>
        <Badge 
          variant={selectedCategory === "all" ? "secondary" : "outline"} 
          className="text-xs font-semibold min-w-[2rem] justify-center"
        >
          {templates.length}
        </Badge>
      </button>
      
      {categories.map((category) => {
        const count = templates.filter((t) => t.category_id === category.id).length;
        const isSelected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              if (isMobile) setMobileFiltersOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:translate-x-1"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${
                isSelected 
                  ? "bg-primary-foreground/20" 
                  : "bg-muted"
              }`}>
                {getCategoryIcon(category.icon)}
              </div>
              <span className="truncate">{category.name}</span>
            </div>
            <Badge 
              variant={isSelected ? "secondary" : "outline"} 
              className="text-xs font-semibold min-w-[2rem] justify-center shrink-0"
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 py-12 md:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="container px-4 mx-auto relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {totalTemplates}+ Professional Templates
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Templates Library
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed px-4">
                Professional-quality templates for academic papers, resumes, business documents, 
                presentations, and more. Ready to download in multiple formats.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
                <div className="bg-card/60 backdrop-blur-sm border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-card/80">
                  <div className="p-2 sm:p-2.5 bg-primary/10 rounded-xl w-fit mx-auto mb-2 sm:mb-3">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg sm:text-xl md:text-2xl block">{formatDownloads(totalDownloads)}</span>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Downloads</p>
                </div>
                <div className="bg-card/60 backdrop-blur-sm border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-card/80">
                  <div className="p-2 sm:p-2.5 bg-blue-500/10 rounded-xl w-fit mx-auto mb-2 sm:mb-3">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  <span className="font-bold text-lg sm:text-xl md:text-2xl block">{totalTemplates}</span>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Templates</p>
                </div>
                <div className="bg-card/60 backdrop-blur-sm border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-card/80">
                  <div className="p-2 sm:p-2.5 bg-green-500/10 rounded-xl w-fit mx-auto mb-2 sm:mb-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <span className="font-bold text-lg sm:text-xl md:text-2xl block">{freeTemplates}</span>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Free</p>
                </div>
                <div className="bg-card/60 backdrop-blur-sm border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-card/80">
                  <div className="p-2 sm:p-2.5 bg-yellow-500/10 rounded-xl w-fit mx-auto mb-2 sm:mb-3">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  </div>
                  <span className="font-bold text-lg sm:text-xl md:text-2xl block">{premiumTemplates}</span>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Premium</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="search"
                    placeholder="Search templates by name, description, or tags..."
                    className="pl-12 pr-4 h-12 md:h-14 text-base md:text-lg rounded-xl border-2 focus:border-primary/50 bg-background/80 backdrop-blur-sm shadow-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar - Top */}
        <section className="py-4 border-b bg-card/50 sticky top-0 z-40 backdrop-blur-md">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filters:</span>
                </div>
                <FilterPanel />
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
                  <SheetHeader className="p-4 pb-0">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters & Categories
                    </SheetTitle>
                    <SheetDescription>
                      Refine your template search
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)] px-4">
                    <div className="py-4">
                      <FilterPanel isMobile />
                      <Separator className="my-6" />
                      <div className="flex items-center gap-2 mb-4">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold">Categories</h4>
                      </div>
                      <CategoriesSidebar isMobile />
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* View Toggle & Results */}
              <div className="flex items-center gap-2 sm:gap-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredTemplates.length}</span>
                  <span className="hidden xs:inline"> templates</span>
                  <span className="xs:hidden"> items</span>
                  {searchQuery && <span className="hidden sm:inline"> for &ldquo;{searchQuery}&rdquo;</span>}
                </p>

                {/* View Toggle */}
                <div className="flex border rounded-lg overflow-hidden shadow-sm">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Category: {categories.find(c => c.id === selectedCategory)?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedCategory("all")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedFormat !== "all" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Format: {selectedFormat.toUpperCase()}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedFormat("all")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {showPremiumOnly !== "all" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {showPremiumOnly === "free" ? "Free Only" : "Premium Only"}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setShowPremiumOnly("all")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="py-6 md:py-10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Categories Sidebar */}
              <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24 bg-card/80 backdrop-blur-sm border rounded-2xl shadow-sm">
                  <div className="p-5 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">Categories</h3>
                        <p className="text-xs text-muted-foreground">{categories.length} categories</p>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-14rem)]">
                    <div className="p-3">
                      <CategoriesSidebar />
                    </div>
                  </ScrollArea>
                </div>
              </aside>

              {/* Templates Grid */}
              <div className="flex-1 min-w-0">

                {/* Loading State */}
                {loading && (
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6" 
                    : "space-y-2 sm:space-y-3"
                  }>
                    {[...Array(8)].map((_, i) => (
                      viewMode === "grid" ? (
                        <Card key={i} className="overflow-hidden">
                          <div className="p-0">
                            <Skeleton className="aspect-[4/3] w-full" />
                          </div>
                          <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                            <Skeleton className="h-4 sm:h-5 w-1/3" />
                            <Skeleton className="h-5 sm:h-6 w-3/4" />
                            <Skeleton className="h-3 sm:h-4 w-full" />
                            <Skeleton className="h-3 sm:h-4 w-2/3" />
                            <Skeleton className="h-9 sm:h-10 w-full mt-3 sm:mt-4" />
                          </CardContent>
                        </Card>
                      ) : (
                        <Card key={i}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                              <Skeleton className="h-20 w-full xs:w-20 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-xl shrink-0" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                              <Skeleton className="h-9 sm:h-10 w-full sm:w-28 shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loading && filteredTemplates.length === 0 && (
                  <div className="text-center py-16 px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                      <FolderOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {searchQuery
                        ? `We couldn't find any templates matching "${searchQuery}". Try adjusting your search or filters.`
                        : "No templates available yet. Check back soon!"}
                    </p>
                    {(searchQuery || activeFiltersCount > 0) && (
                      <Button variant="outline" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                )}

                {/* Grid View */}
                {!loading && viewMode === "grid" && filteredTemplates.length > 0 && (
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {filteredTemplates.map((template) => (
                      <Card 
                        key={template.id} 
                        className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 hover:border-primary/20"
                      >
                        {/* Preview Image */}
                        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                          {template.preview_url ? (
                            <Image
                              src={template.preview_url}
                              alt={template.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                              <div className={`p-4 rounded-xl ${getFormatColor(template.file_format)}`}>
                                {getFormatIcon(template.file_format)}
                              </div>
                            </div>
                          )}
                          
                          {/* Premium Badge - Top Right */}
                          {template.is_premium && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md font-semibold">
                                <Crown className="h-3 w-3 mr-1" />
                                PRO
                              </Badge>
                            </div>
                          )}

                          {/* Format Badge - Bottom Left */}
                          <div className="absolute bottom-3 left-3">
                            <Badge 
                              variant="secondary" 
                              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm font-medium"
                            >
                              {getFormatIcon(template.file_format)}
                              <span className="ml-1.5 uppercase text-[11px]">{template.file_format}</span>
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          {/* Category Tag */}
                          {template.template_categories && (
                            <span className="inline-block text-xs text-muted-foreground mb-2">
                              {template.template_categories.name}
                            </span>
                          )}

                          {/* Title */}
                          <CardTitle className="text-base font-semibold line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
                            {template.name}
                          </CardTitle>
                          
                          {/* Description */}
                          <CardDescription className="line-clamp-2 text-sm text-muted-foreground mb-4 min-h-[2.5rem]">
                            {template.description || "Professional template ready for download"}
                          </CardDescription>
                          
                          {/* Meta Info Row */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-3">
                              {template.file_size && (
                                <span className="font-medium">{formatFileSize(template.file_size)}</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Download className="h-3.5 w-3.5" />
                                {formatDownloads(template.download_count)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              <span className="font-semibold">4.9</span>
                            </div>
                          </div>

                          {/* Download Button */}
                          <Button
                            className="w-full h-10 font-medium"
                            variant={template.is_premium ? "outline" : "default"}
                            onClick={() => handleDownload(template)}
                            disabled={downloading === template.id}
                          >
                            {downloading === template.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : template.is_premium ? (
                              <Crown className="h-4 w-4 mr-2" />
                            ) : (
                              <Download className="h-4 w-4 mr-2" />
                            )}
                            {template.is_premium ? "Unlock with Pro" : "Download Free"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* List View */}
                {!loading && viewMode === "list" && filteredTemplates.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    {filteredTemplates.map((template) => (
                      <Card 
                        key={template.id} 
                        className="group transition-all duration-200 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 bg-card/80 backdrop-blur-sm"
                      >
                        <CardContent className="p-3 sm:p-4 md:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            {/* Icon/Preview */}
                            <div className={`shrink-0 w-full xs:w-20 sm:w-16 md:w-20 h-20 xs:h-20 sm:h-16 md:h-20 rounded-xl flex items-center justify-center ${getFormatColor(template.file_format)} transition-transform duration-300 group-hover:scale-105`}>
                              <div className="flex flex-col items-center gap-1">
                                <div className="scale-110">
                                  {getFormatIcon(template.file_format)}
                                </div>
                                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider">{template.file_format}</span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-semibold text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors">
                                  {template.name}
                                </h3>
                                {template.is_premium && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 border-0 text-[10px] sm:text-xs shadow-sm">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Pro
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mb-2">
                                {template.description || "Professional template ready for download"}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                                {template.template_categories && (
                                  <Badge variant="outline" className="text-[10px] sm:text-xs font-medium">
                                    {template.template_categories.name}
                                  </Badge>
                                )}
                                {template.file_size && (
                                  <span className="hidden xs:inline font-medium">{formatFileSize(template.file_size)}</span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  <span className="font-medium">{formatDownloads(template.download_count)}</span>
                                </span>
                                <span className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-full">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">4.9</span>
                                </span>
                              </div>
                            </div>

                            {/* Download Button */}
                            <Button
                              variant={template.is_premium ? "outline" : "default"}
                              size="default"
                              onClick={() => handleDownload(template)}
                              disabled={downloading === template.id}
                              className="shrink-0 w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
                            >
                              {downloading === template.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : template.is_premium ? (
                                <>
                                  <Crown className="h-4 w-4 mr-2" />
                                  <span className="hidden sm:inline">Unlock</span>
                                  <span className="sm:hidden">Unlock with Pro</span>
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container px-4 mx-auto relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <Crown className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                Unlock Premium
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                Get Access to All Premium Templates
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8">
                Upgrade to Pro for unlimited access to all {premiumTemplates}+ premium templates, 
                priority support, and exclusive new releases.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-base">
                  <Link href="/pricing">
                    View Pro Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base">
                  <Link href="/auth/register">
                    Create Free Account
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
