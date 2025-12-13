"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  Menu,
  Wrench,
  Search,
  FileText,
  Brain,
  BookOpen,
  CreditCard,
  X,
  ChevronRight,
  Sparkles,
  Command,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { 
    href: "/tools", 
    label: "Tools", 
    icon: Wrench,
    description: "50+ free online tools"
  },
  { 
    href: "/templates", 
    label: "Templates", 
    icon: FileText,
    description: "Ready-to-use templates"
  },
  { 
    href: "/ai-tools", 
    label: "AI Tools", 
    icon: Brain,
    badge: "New",
    description: "AI-powered tools"
  },
  { 
    href: "/blog", 
    label: "Blog", 
    icon: BookOpen,
    description: "Tips & tutorials"
  },
  { 
    href: "/pricing", 
    label: "Pricing", 
    icon: CreditCard,
    description: "Plans & pricing"
  },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/tools?search=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "border-b bg-background/80 backdrop-blur-lg shadow-sm"
            : "border-b border-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
      >
        {/* Announcement Banner - Optional */}
        {/* <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b">
          <div className="container flex items-center justify-center gap-2 py-2 px-4 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Introducing AI Tools - 
            </span>
            <Link href="/ai-tools" className="font-medium text-primary hover:underline">
              Try now →
            </Link>
          </div>
        </div> */}

        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left Section: Logo & Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="border-b px-6 py-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Wrench className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="font-bold">Tool Library</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>
                
                {/* Mobile Search */}
                <div className="p-4 border-b">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tools..."
                      className="pl-10 w-full bg-muted/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col p-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Navigation
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between gap-3 px-3 py-3 rounded-lg transition-all",
                        pathname.startsWith(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          pathname.startsWith(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full justify-center" asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button className="w-full justify-center" asChild>
                      <Link href="/auth/register">
                        Get Started Free
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
                <Wrench className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none hidden sm:block">
                  Tool Library
                </span>
                <span className="text-[10px] text-muted-foreground hidden md:block leading-none mt-0.5">
                  50+ Free Tools
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="h-5 text-[10px] px-1.5 bg-primary/10 text-primary border-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {pathname.startsWith(item.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section: Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search */}
            <div className="hidden md:flex">
              <Button
                variant="outline"
                className="relative h-9 w-9 lg:w-64 lg:justify-start lg:px-3 lg:py-2 text-muted-foreground"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline-flex">Search tools...</span>
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <Command className="h-3 w-3" />K
                </kbd>
              </Button>
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 shadow-sm"
                asChild
              >
                <Link href="/auth/register">
                  <span className="hidden lg:inline">Get Started</span>
                  <span className="lg:hidden">Start</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Auth - Only show icon on very small screens */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden shrink-0"
              asChild
            >
              <Link href="/auth/login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Search Modal/Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          
          {/* Search Dialog */}
          <div className="relative flex items-start justify-center pt-[15vh]">
            <div className="w-full max-w-lg mx-4 bg-background border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
              {/* Search Input */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tools, templates, and more..."
                  className="w-full h-14 pl-12 pr-12 border-0 border-b rounded-none text-lg focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>

              {/* Quick Links */}
              <div className="p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Links
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {navItems.slice(0, 4).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted border">Enter</kbd> to search</span>
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted border">Esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
