"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Sparkles,
  Crown,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - In production, this would come from the database
const mockAITools = [
  {
    id: "1",
    slug: "ai-essay-writer",
    name: "AI Essay Writer",
    description: "Generate well-structured essays on any topic",
    is_premium: false,
    is_active: true,
    daily_limit_free: 5,
    daily_limit_pro: 50,
    usage_today: 234,
    usage_total: 15678,
  },
  {
    id: "2",
    slug: "ai-paraphraser",
    name: "AI Paraphraser",
    description: "Rewrite text while maintaining meaning",
    is_premium: false,
    is_active: true,
    daily_limit_free: 10,
    daily_limit_pro: 100,
    usage_today: 456,
    usage_total: 23456,
  },
  {
    id: "3",
    slug: "ai-grammar-checker",
    name: "AI Grammar Checker",
    description: "Fix grammar and improve writing style",
    is_premium: false,
    is_active: true,
    daily_limit_free: 20,
    daily_limit_pro: 200,
    usage_today: 789,
    usage_total: 45678,
  },
  {
    id: "4",
    slug: "ai-presentation-generator",
    name: "AI Presentation Generator",
    description: "Create presentation outlines",
    is_premium: true,
    is_active: true,
    daily_limit_free: 3,
    daily_limit_pro: 30,
    usage_today: 123,
    usage_total: 5678,
  },
  {
    id: "5",
    slug: "ai-research-assistant",
    name: "AI Research Assistant",
    description: "Organize and analyze research",
    is_premium: true,
    is_active: false,
    daily_limit_free: 3,
    daily_limit_pro: 30,
    usage_today: 0,
    usage_total: 2345,
  },
];

export default function AdminAIToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState(mockAITools);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<typeof mockAITools[0] | null>(null);

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, is_active: !tool.is_active } : tool
    ));
  };

  const togglePremium = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, is_premium: !tool.is_premium } : tool
    ));
  };

  const handleEdit = (tool: typeof mockAITools[0]) => {
    setEditingTool(tool);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this AI tool?")) {
      setTools(tools.filter(tool => tool.id !== id));
    }
  };

  const totalUsageToday = tools.reduce((acc, tool) => acc + tool.usage_today, 0);
  const activeTools = tools.filter(t => t.is_active).length;
  const premiumTools = tools.filter(t => t.is_premium).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Tools Management</h1>
          <p className="text-muted-foreground">
            Manage AI-powered tools, limits, and configurations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTool(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add AI Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTool ? "Edit AI Tool" : "Add New AI Tool"}
              </DialogTitle>
              <DialogDescription>
                Configure AI tool settings and usage limits
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tool Name</Label>
                  <Input
                    id="name"
                    defaultValue={editingTool?.name}
                    placeholder="AI Essay Writer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    defaultValue={editingTool?.slug}
                    placeholder="ai-essay-writer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={editingTool?.description}
                  placeholder="Brief description of the tool..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="free-limit">Daily Limit (Free)</Label>
                  <Input
                    id="free-limit"
                    type="number"
                    defaultValue={editingTool?.daily_limit_free || 5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pro-limit">Daily Limit (Pro)</Label>
                  <Input
                    id="pro-limit"
                    type="number"
                    defaultValue={editingTool?.daily_limit_pro || 50}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select defaultValue="gpt-4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Enter the system prompt for this AI tool..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="is-premium" />
                  <Label htmlFor="is-premium">Premium Only</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="is-active" defaultChecked />
                  <Label htmlFor="is-active">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                {editingTool ? "Save Changes" : "Create Tool"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total AI Tools
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tools.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeTools} active, {tools.length - activeTools} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Premium Tools
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{premiumTools}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((premiumTools / tools.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usage Today
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsageToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              AI generations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Usage
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tools.reduce((acc, t) => acc + t.usage_total, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time generations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tools Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Tools</CardTitle>
              <CardDescription>
                Manage all AI-powered tools and their settings
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Limits (Free/Pro)</TableHead>
                <TableHead>Usage Today</TableHead>
                <TableHead>Total Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {tool.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tool.is_premium ? (
                      <Badge className="bg-amber-500">Premium</Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {tool.daily_limit_free} / {tool.daily_limit_pro}
                    </span>
                  </TableCell>
                  <TableCell>{tool.usage_today.toLocaleString()}</TableCell>
                  <TableCell>{tool.usage_total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={tool.is_active}
                      onCheckedChange={() => toggleActive(tool.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(tool)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePremium(tool.id)}>
                          <Crown className="mr-2 h-4 w-4" />
                          {tool.is_premium ? "Make Free" : "Make Premium"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(tool.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
