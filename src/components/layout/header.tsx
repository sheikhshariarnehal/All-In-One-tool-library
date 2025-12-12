"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Wrench, Search, FileText, Brain, BookOpen, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/ai-tools", label: "AI Tools", icon: Brain },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">Tool Library</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-10 w-64"
            />
          </div>
          
          <ThemeToggle />

          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
