"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { 
  Download, 
  ArrowLeft, 
  Crown, 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  FolderOpen,
  Loader2,
  File,
} from "lucide-react";
import { toast } from "sonner";

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
      return <Presentation className="h-4 w-4" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-4 w-4" />;
    case "pdf":
      return <File className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-blue-500" />;
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

export default function TemplateCategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const categoriesRes = await fetch("/api/templates/categories");
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          const categories = data.categories || [];
          const found = categories.find((c: Category) => c.slug === categorySlug);
          setCategory(found || null);
          
          if (found) {
            const templatesRes = await fetch(`/api/templates?category=${categorySlug}`);
            if (templatesRes.ok) {
              const templatesData = await templatesRes.json();
              setTemplates(templatesData.templates || []);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchData();
    }
  }, [categorySlug]);

  const handleDownload = async (template: Template) => {
    if (template.is_premium) {
      toast.info("Premium templates require a Pro subscription");
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 mx-auto py-8">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                    <Skeleton className="h-5 w-3/4 mt-3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-9 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 mx-auto py-16 text-center">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The category &quot;{categorySlug}&quot; doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/templates">Browse All Templates</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 mx-auto py-8">
          <div className="mb-6">
            <Link
              href="/templates"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
              </div>
            </div>
            {category.description && (
              <p className="text-muted-foreground max-w-2xl">{category.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {templates.length} template{templates.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {templates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="aspect-[4/3] bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                      {template.preview_url ? (
                        <Image
                          src={template.preview_url}
                          alt={template.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="text-muted-foreground flex flex-col items-center">
                          {getFormatIcon(template.file_format)}
                          <span className="text-xs mt-2 uppercase font-medium">
                            {template.file_format}
                          </span>
                        </div>
                      )}
                      {template.is_premium && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          <Crown className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1">{template.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-3 min-h-[2.5rem]">
                      {template.description || "No description available"}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        {getFormatIcon(template.file_format)}
                        <span className="uppercase">{template.file_format}</span>
                        {template.file_size && (
                          <span className="text-muted-foreground/60">
                            • {formatFileSize(template.file_size)}
                          </span>
                        )}
                      </div>
                      <span>{formatDownloads(template.download_count)} downloads</span>
                    </div>
                    <Button
                      className="w-full"
                      variant={template.is_premium ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleDownload(template)}
                      disabled={downloading === template.id}
                    >
                      {downloading === template.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {template.is_premium ? "Unlock with Pro" : "Download"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">
                Templates for this category are coming soon.
              </p>
              <Button variant="outline" asChild>
                <Link href="/templates">Browse All Templates</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
