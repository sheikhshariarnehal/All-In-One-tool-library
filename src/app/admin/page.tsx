"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Wrench,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  Eye,
  UserPlus,
  DollarSign,
  FileStack,
  Sparkles,
  Download,
  Newspaper,
  Bot,
} from "lucide-react";
import Link from "next/link";

// Mock data - in production, this would come from your API/database
const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "from last month",
  },
  {
    title: "Active Tools",
    value: "48",
    change: "+3",
    trend: "up",
    icon: Wrench,
    description: "tools available",
  },
  {
    title: "Templates",
    value: "156",
    change: "+12",
    trend: "up",
    icon: FileStack,
    description: "downloads this week",
  },
  {
    title: "AI Tool Usage",
    value: "8,432",
    change: "+24.6%",
    trend: "up",
    icon: Sparkles,
    description: "requests this month",
  },
];

const secondaryStats = [
  {
    title: "Subscriptions",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: CreditCard,
    description: "paid subscribers",
  },
  {
    title: "Monthly Revenue",
    value: "$12,456",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Blog Views",
    value: "45,678",
    change: "+18.7%",
    trend: "up",
    icon: Newspaper,
    description: "this month",
  },
  {
    title: "Template Downloads",
    value: "3,421",
    change: "+22.1%",
    trend: "up",
    icon: Download,
    description: "this month",
  },
];

const recentUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", plan: "Pro", joinedAt: "2 hours ago" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", plan: "Free", joinedAt: "5 hours ago" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", plan: "Enterprise", joinedAt: "1 day ago" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", plan: "Pro", joinedAt: "2 days ago" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", plan: "Free", joinedAt: "3 days ago" },
];

const popularTools = [
  { name: "JSON Formatter", uses: 15234, category: "Developer" },
  { name: "Image Compressor", uses: 12456, category: "AI Image" },
  { name: "Word Counter", uses: 9876, category: "Academic" },
  { name: "QR Code Generator", uses: 8765, category: "Utilities" },
  { name: "Citation Generator", uses: 7654, category: "Academic" },
];

const popularAITools = [
  { name: "AI Content Generator", uses: 3421, usagePercent: 85 },
  { name: "Research Assistant", uses: 2876, usagePercent: 72 },
  { name: "AI Rewriter", uses: 2345, usagePercent: 58 },
  { name: "Presentation Generator", uses: 1987, usagePercent: 49 },
  { name: "Citation Assistant", uses: 1654, usagePercent: 41 },
];

const topTemplates = [
  { name: "Business Plan", downloads: 876, category: "Business" },
  { name: "Resume Template", downloads: 654, category: "Resume" },
  { name: "Invoice Template", downloads: 543, category: "Business" },
  { name: "Project Proposal", downloads: 432, category: "Business" },
  { name: "Report Template", downloads: 321, category: "Academic" },
];

const recentActivity = [
  { action: "New user registered", details: "john@example.com", time: "2 min ago", icon: UserPlus },
  { action: "Subscription upgraded", details: "jane@example.com → Pro", time: "15 min ago", icon: CreditCard },
  { action: "AI Tool usage", details: "Content Generator - 50 requests", time: "30 min ago", icon: Bot },
  { action: "Template downloaded", details: "Business Plan Template", time: "1 hour ago", icon: Download },
  { action: "Tool used 1000 times", details: "JSON Formatter", time: "1 hour ago", icon: Activity },
  { action: "New user registered", details: "bob@example.com", time: "2 hours ago", icon: UserPlus },
  { action: "Page view spike", details: "Homepage +45%", time: "3 hours ago", icon: Eye },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {secondaryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid - Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.plan === "Enterprise" ? "default" : user.plan === "Pro" ? "secondary" : "outline"}>
                      {user.plan}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{user.joinedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Tools */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Popular Tools</CardTitle>
              <CardDescription>Most used tools this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/tools">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularTools.map((tool, index) => (
                <div key={tool.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.category}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tool.uses.toLocaleString()} uses
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Row 2: AI Tools & Templates */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular AI Tools */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Popular AI Tools
              </CardTitle>
              <CardDescription>AI tool usage this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/ai-tools">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularAITools.map((tool) => (
                <div key={tool.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{tool.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {tool.uses.toLocaleString()} uses
                    </span>
                  </div>
                  <Progress value={tool.usagePercent} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Templates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileStack className="h-5 w-5 text-blue-500" />
                Top Templates
              </CardTitle>
              <CardDescription>Most downloaded templates</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/templates">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTemplates.map((template, index) => (
                <div key={template.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Download className="h-3 w-3" />
                    {template.downloads.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events on your platform</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/activity">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
