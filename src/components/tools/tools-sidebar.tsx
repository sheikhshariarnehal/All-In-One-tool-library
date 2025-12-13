"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  GraduationCap, 
  Code, 
  Wrench, 
  Brain, 
  ImagePlus, 
  LayoutTemplate, 
  Briefcase,
  LayoutGrid,
  Star
} from "lucide-react";

// Static category metadata with icons
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  document: FileText,
  academic: GraduationCap,
  developer: Code,
  utilities: Wrench,
  ai: Brain,
  "ai-image": ImagePlus,
  templates: LayoutTemplate,
  professional: Briefcase,
};

const categoryNames: Record<string, string> = {
  document: "Document Tools",
  academic: "Academic Tools",
  developer: "Developer Tools",
  utilities: "Utilities",
  ai: "AI Tools",
  "ai-image": "AI Image",
  templates: "Templates",
  professional: "Professional",
};

interface Category {
  slug: string;
  name: string;
  toolCount: number;
}

export function ToolsSidebar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/tools/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <aside className="hidden md:flex w-64 border-r bg-muted/30">
      <ScrollArea className="flex-1 py-6 px-4">
        <div className="space-y-1">
          <Link
            href="/tools"
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === "/tools"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            All Tools
          </Link>

          <div className="py-4">
            <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </h4>
            {loading ? (
              <div className="space-y-2 px-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            ) : (
              categories.map((category) => {
                const isActive = pathname.startsWith(`/tools/${category.slug}`);
                const IconComponent = categoryIcons[category.slug] || Wrench;
                return (
                  <Link
                    key={category.slug}
                    href={`/tools/${category.slug}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="flex-1">{categoryNames[category.slug] || category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {category.toolCount}
                    </span>
                  </Link>
                );
              })
            )}
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t">
            <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Links
            </h4>
            <Link
              href="/favorites"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                pathname === "/favorites"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Star className="h-4 w-4" />
              <span>Favorites</span>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
