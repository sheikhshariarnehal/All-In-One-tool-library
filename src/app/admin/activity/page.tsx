"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Search,
  User,
  Wrench,
  FileText,
  Settings,
  Shield,
  Calendar,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Crown,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock activity log data
const mockActivityLog = [
  {
    id: "1",
    admin_id: "admin-1",
    admin_name: "John Admin",
    admin_email: "john@admin.com",
    action: "user.updated",
    entity_type: "user",
    entity_id: "user-123",
    description: "Updated user subscription tier to Pro",
    old_values: { subscription_tier: "free" },
    new_values: { subscription_tier: "pro" },
    ip_address: "192.168.1.1",
    created_at: "2024-12-12T10:30:00Z",
  },
  {
    id: "2",
    admin_id: "admin-1",
    admin_name: "John Admin",
    admin_email: "john@admin.com",
    action: "tool.created",
    entity_type: "tool",
    entity_id: "tool-456",
    description: "Created new tool: PDF Merger",
    old_values: null,
    new_values: { name: "PDF Merger", category: "document" },
    ip_address: "192.168.1.1",
    created_at: "2024-12-12T09:15:00Z",
  },
  {
    id: "3",
    admin_id: "admin-2",
    admin_name: "Sarah Manager",
    admin_email: "sarah@admin.com",
    action: "blog_post.published",
    entity_type: "blog_post",
    entity_id: "post-789",
    description: "Published blog post: How to Write Better Essays",
    old_values: { status: "draft" },
    new_values: { status: "published" },
    ip_address: "192.168.1.2",
    created_at: "2024-12-12T08:45:00Z",
  },
  {
    id: "4",
    admin_id: "admin-1",
    admin_name: "John Admin",
    admin_email: "john@admin.com",
    action: "template.deleted",
    entity_type: "template",
    entity_id: "template-012",
    description: "Deleted template: Old Resume Format",
    old_values: { name: "Old Resume Format" },
    new_values: null,
    ip_address: "192.168.1.1",
    created_at: "2024-12-11T16:20:00Z",
  },
  {
    id: "5",
    admin_id: "admin-2",
    admin_name: "Sarah Manager",
    admin_email: "sarah@admin.com",
    action: "announcement.created",
    entity_type: "announcement",
    entity_id: "ann-345",
    description: "Created announcement: System Maintenance",
    old_values: null,
    new_values: { title: "System Maintenance", type: "maintenance" },
    ip_address: "192.168.1.2",
    created_at: "2024-12-11T14:10:00Z",
  },
  {
    id: "6",
    admin_id: "admin-1",
    admin_name: "John Admin",
    admin_email: "john@admin.com",
    action: "user.banned",
    entity_type: "user",
    entity_id: "user-789",
    description: "Banned user for policy violation",
    old_values: { status: "active" },
    new_values: { status: "banned", reason: "Policy violation" },
    ip_address: "192.168.1.1",
    created_at: "2024-12-11T11:30:00Z",
  },
  {
    id: "7",
    admin_id: "admin-1",
    admin_name: "John Admin",
    admin_email: "john@admin.com",
    action: "settings.updated",
    entity_type: "settings",
    entity_id: "settings",
    description: "Updated site settings",
    old_values: { registration_enabled: true },
    new_values: { registration_enabled: false },
    ip_address: "192.168.1.1",
    created_at: "2024-12-10T09:00:00Z",
  },
  {
    id: "8",
    admin_id: "admin-2",
    admin_name: "Sarah Manager",
    admin_email: "sarah@admin.com",
    action: "ai_tool.updated",
    entity_type: "ai_tool",
    entity_id: "ai-001",
    description: "Updated AI Essay Writer daily limits",
    old_values: { daily_limit_free: 3 },
    new_values: { daily_limit_free: 5 },
    ip_address: "192.168.1.2",
    created_at: "2024-12-10T08:15:00Z",
  },
];

const actionIcons: Record<string, typeof Activity> = {
  "user.updated": Edit,
  "user.created": Plus,
  "user.deleted": Trash2,
  "user.banned": Ban,
  "tool.created": Plus,
  "tool.updated": Edit,
  "tool.deleted": Trash2,
  "template.created": Plus,
  "template.updated": Edit,
  "template.deleted": Trash2,
  "blog_post.created": Plus,
  "blog_post.published": CheckCircle,
  "blog_post.updated": Edit,
  "blog_post.deleted": Trash2,
  "announcement.created": Plus,
  "announcement.updated": Edit,
  "settings.updated": Settings,
  "ai_tool.created": Plus,
  "ai_tool.updated": Edit,
};

const actionColors: Record<string, string> = {
  created: "bg-green-500/10 text-green-600",
  updated: "bg-blue-500/10 text-blue-600",
  deleted: "bg-red-500/10 text-red-600",
  published: "bg-purple-500/10 text-purple-600",
  banned: "bg-orange-500/10 text-orange-600",
};

export default function AdminActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const filteredLogs = mockActivityLog.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.admin_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEntity =
      entityFilter === "all" || log.entity_type === entityFilter;
    const matchesAction =
      actionFilter === "all" || log.action.includes(actionFilter);
    return matchesSearch && matchesEntity && matchesAction;
  });

  const getActionVerb = (action: string): string => {
    const verb = action.split(".")[1] || action;
    return verb.charAt(0).toUpperCase() + verb.slice(1);
  };

  const getActionColor = (action: string): string => {
    const verb = action.split(".")[1] || action;
    return actionColors[verb] || "bg-gray-500/10 text-gray-600";
  };

  const getIcon = (action: string) => {
    return actionIcons[action] || Activity;
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const entityTypes = [...new Set(mockActivityLog.map((l) => l.entity_type))];
  const actionVerbs = [...new Set(mockActivityLog.map((l) => l.action.split(".")[1]))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">
            Track all administrative actions and changes
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Actions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActivityLog.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Admins
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockActivityLog.map((l) => l.admin_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Made changes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today&apos;s Actions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockActivityLog.filter((l) => {
                const d = new Date(l.created_at);
                const today = new Date();
                return d.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Actions today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Actions
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockActivityLog.filter((l) => 
                l.action.includes("deleted") || l.action.includes("banned")
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Deletions & bans</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Detailed log of all administrative actions
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionVerbs.map((verb) => (
                    <SelectItem key={verb} value={verb}>
                      {verb.charAt(0).toUpperCase() + verb.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const Icon = getIcon(log.action);
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.description}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.entity_type.replace("_", " ")}
                      </Badge>
                      <Badge className={getActionColor(log.action)}>
                        {getActionVerb(log.action)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {log.admin_name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{log.admin_name}</span>
                      </div>
                      <span>•</span>
                      <span>{formatTime(log.created_at)}</span>
                      <span>•</span>
                      <span className="text-xs">{log.ip_address}</span>
                    </div>
                    {(log.old_values || log.new_values) && (
                      <div className="mt-2 text-xs">
                        {log.old_values && (
                          <span className="text-red-500 line-through mr-2">
                            {JSON.stringify(log.old_values)}
                          </span>
                        )}
                        {log.new_values && (
                          <span className="text-green-500">
                            {JSON.stringify(log.new_values)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
