"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, ExternalLink, Crown, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  short_description: string | null;
  category: string;
  icon_url: string | null;
  site_url: string | null;
  is_external: boolean;
  is_premium: boolean;
  tags: string[];
}

interface ToolSearchWrapperProps {
  className?: string;
}

export function ToolSearchWrapper({ className }: ToolSearchWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function fetchTools() {
      if (!searchTerm.trim()) {
        setTools([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/tools?search=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setTools(data);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Error searching tools:", error);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(fetchTools, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setTools([]);
    setShowResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowResults(true)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!loading && searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchTerm && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {tools.length === 0 && !loading ? (
            <div className="p-4 text-center text-muted-foreground">
              No tools found for &quot;{searchTerm}&quot;
            </div>
          ) : (
            <div className="p-2">
              {tools.slice(0, 8).map((tool) => (
                <SearchResultItem 
                  key={tool.id} 
                  tool={tool}
                  onSelect={() => {
                    setShowResults(false);
                    setSearchTerm("");
                  }}
                />
              ))}
              {tools.length > 8 && (
                <div className="p-2 text-center text-sm text-muted-foreground border-t mt-2">
                  +{tools.length - 8} more results
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}

function SearchResultItem({ tool, onSelect }: { tool: Tool; onSelect: () => void }) {
  const isExternal = tool.is_external && tool.site_url;

  const content = (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
      {tool.icon_url ? (
        <img 
          src={tool.icon_url} 
          alt={tool.name} 
          className="h-8 w-8 rounded object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{tool.name}</span>
          {isExternal && <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
          {tool.is_premium && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Crown className="h-2.5 w-2.5" />
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {tool.short_description || tool.description}
        </p>
      </div>
      <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
        {tool.category}
      </Badge>
    </div>
  );

  if (isExternal) {
    return (
      <a 
        href={tool.site_url!} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={onSelect}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={`/tools/${tool.category}/${tool.slug}`} onClick={onSelect}>
      {content}
    </Link>
  );
}
