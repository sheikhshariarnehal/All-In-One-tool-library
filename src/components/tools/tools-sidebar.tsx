"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/tools/categories";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ToolsSidebar() {
  const pathname = usePathname();

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
            All Tools
          </Link>

          <div className="py-4">
            <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </h4>
            {categories.map((category) => {
              const isActive = pathname.startsWith(`/tools/${category.slug}`);
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
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
