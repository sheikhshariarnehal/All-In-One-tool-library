"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Star, 
  History, 
  Settings, 
  CreditCard,
  User 
} from "lucide-react";

const sidebarItems = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/favorites", label: "Favorites", icon: Star },
      { href: "/history", label: "History", icon: History },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/settings/profile", label: "Profile", icon: User },
      { href: "/settings/billing", label: "Billing", icon: CreditCard },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 border-r bg-muted/30">
      <ScrollArea className="flex-1 py-6 px-4">
        {sidebarItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
}
