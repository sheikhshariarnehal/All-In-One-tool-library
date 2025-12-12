"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wrench,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Bell,
  Shield,
  Home,
  Brain,
  FolderOpen,
  Download,
  Activity,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Activity Log", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Tools", href: "/admin/tools", icon: Wrench },
      { name: "AI Tools", href: "/admin/ai-tools", icon: Brain },
      { name: "Templates", href: "/admin/templates", icon: FolderOpen },
      { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    ],
  },
  {
    title: "Content",
    items: [
      { name: "Blog Posts", href: "/admin/blog", icon: FileText },
      { name: "Announcements", href: "/admin/announcements", icon: Bell },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Security", href: "/admin/security", icon: Shield },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background flex flex-col">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold">Tool Library</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
