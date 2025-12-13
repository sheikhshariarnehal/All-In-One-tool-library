"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  Wrench,
  Code,
  FileText,
  Image,
  GraduationCap,
  Crown,
  ExternalLink,
  Globe,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const categoryIcons: Record<string, React.ElementType> = {
  developer: Code,
  academic: GraduationCap,
  "ai-image": Image,
  document: FileText,
  utilities: Wrench,
  ai: Wrench,
  seo: Globe,
  social: Globe,
  marketing: Globe,
  finance: Globe,
  productivity: Globe,
  design: Image,
  other: Wrench,
};

// Tool interface matching database schema
interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  short_description: string | null;
  icon: string | null;
  icon_url: string | null;
  site_url: string | null;
  is_external: boolean;
  is_premium: boolean;
  is_active: boolean;
  usage_limit_free: number;
  usage_limit_pro: number;
  features: string[];
  tags: string[];
  sort_order: number;
  metadata: Record<string, unknown> | null;
  views_count: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface Stats {
  totalTools: number;
  activeTools: number;
  premiumTools: number;
  externalTools: number;
  totalUsage: number;
}

const categories = [
  { value: "developer", label: "Developer" },
  { value: "academic", label: "Academic" },
  { value: "ai-image", label: "AI Image" },
  { value: "utilities", label: "Utilities" },
  { value: "document", label: "Document" },
  { value: "ai", label: "AI Tools" },
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "productivity", label: "Productivity" },
  { value: "design", label: "Design" },
  { value: "other", label: "Other" },
];

export default function ToolsManagementPage() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTools: 0,
    activeTools: 0,
    premiumTools: 0,
    externalTools: 0,
    totalUsage: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch tools on mount
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/tools", { credentials: 'include' });
      const data = await response.json();
      
      if (data.tools) {
        setTools(data.tools);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to fetch tools");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || tool.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && tool.is_active) ||
      (filterStatus === "inactive" && !tool.is_active) ||
      (filterStatus === "premium" && tool.is_premium) ||
      (filterStatus === "external" && tool.is_external);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleActive = async (tool: Tool) => {
    setIsUpdating(tool.id);
    try {
      const response = await fetch("/api/admin/tools", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ id: tool.id, is_active: !tool.is_active }),
      });

      if (!response.ok) throw new Error("Failed to update tool");

      setTools(tools.map(t => 
        t.id === tool.id ? { ...t, is_active: !t.is_active } : t
      ));
      toast.success(tool.is_active ? "Tool disabled" : "Tool enabled");
    } catch (error) {
      console.error("Error updating tool:", error);
      toast.error("Failed to update tool");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleTogglePremium = async (tool: Tool) => {
    setIsUpdating(tool.id);
    try {
      const response = await fetch("/api/admin/tools", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ id: tool.id, is_premium: !tool.is_premium }),
      });

      if (!response.ok) throw new Error("Failed to update tool");

      setTools(tools.map(t => 
        t.id === tool.id ? { ...t, is_premium: !t.is_premium } : t
      ));
      toast.success(tool.is_premium ? "Tool set to free" : "Tool set to premium");
    } catch (error) {
      console.error("Error updating tool:", error);
      toast.error("Failed to update tool");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteTool = async () => {
    if (!selectedTool) return;
    
    setIsUpdating(selectedTool.id);
    try {
      const response = await fetch(`/api/admin/tools?id=${selectedTool.id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) throw new Error("Failed to delete tool");

      setTools(tools.filter(t => t.id !== selectedTool.id));
      toast.success("Tool deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedTool(null);
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast.error("Failed to delete tool");
    } finally {
      setIsUpdating(null);
    }
  };

  const openEditPage = (tool: Tool) => {
    router.push(`/admin/tools/add?id=${tool.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tools Management</h1>
          <p className="text-muted-foreground">Manage your platform tools and external redirects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTools} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/tools/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : stats.totalTools}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : stats.activeTools}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Tools</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : stats.premiumTools}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">External Tools</CardTitle>
            <ExternalLink className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : stats.externalTools}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : stats.totalUsage.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No tools found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterCategory !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding your first tool"}
              </p>
              <Button asChild>
                <Link href="/admin/tools/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tool
                </Link>
              </Button>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => {
                const CategoryIcon = categoryIcons[tool.category] || Wrench;
                return (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                          {tool.icon_url ? (
                            <img 
                              src={tool.icon_url} 
                              alt={tool.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <CategoryIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{tool.name}</p>
                            {tool.is_external && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {tool.site_url || `/${tool.slug}`}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{tool.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {tool.is_external ? (
                        <Badge variant="secondary" className="gap-1">
                          <Globe className="h-3 w-3" />
                          External
                        </Badge>
                      ) : (
                        <Badge variant="outline">Internal</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${tool.is_active ? "bg-green-500" : "bg-gray-400"}`} />
                        <span className="text-sm">{tool.is_active ? "Active" : "Inactive"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tool.is_premium ? (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Free</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{(tool.usage_count || 0).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isUpdating === tool.id}>
                            {isUpdating === tool.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditPage(tool)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Tool
                          </DropdownMenuItem>
                          {tool.is_external && tool.site_url && (
                            <DropdownMenuItem asChild>
                              <a href={tool.site_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Site
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleActive(tool)}>
                            {tool.is_active ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Enable
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePremium(tool)}>
                            <Crown className="h-4 w-4 mr-2" />
                            {tool.is_premium ? "Make Free" : "Make Premium"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedTool(tool); setIsSettingsDialogOpen(true); }}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => { setSelectedTool(tool); setIsDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tool &quot;{selectedTool?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTool}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tool Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tool Settings</DialogTitle>
            <DialogDescription>Configure advanced settings for {selectedTool?.name}</DialogDescription>
          </DialogHeader>
          {selectedTool && (
            <Tabs defaultValue="info" className="py-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="limits">Limits</TabsTrigger>
                <TabsTrigger value="access">Access</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Tool ID</Label>
                  <Input value={selectedTool.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={selectedTool.slug} disabled />
                </div>
                {selectedTool.is_external && selectedTool.site_url && (
                  <div className="space-y-2">
                    <Label>External URL</Label>
                    <div className="flex gap-2">
                      <Input value={selectedTool.site_url} disabled className="flex-1" />
                      <Button variant="outline" size="icon" asChild>
                        <a href={selectedTool.site_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Created</Label>
                  <Input value={new Date(selectedTool.created_at).toLocaleDateString()} disabled />
                </div>
              </TabsContent>
              <TabsContent value="limits" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Free Tier Limit (per month)</Label>
                  <Input type="number" value={selectedTool.usage_limit_free} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Pro Tier Limit (per month)</Label>
                  <Input type="number" value={selectedTool.usage_limit_pro} disabled />
                </div>
                <p className="text-sm text-muted-foreground">
                  Edit the tool to modify these limits.
                </p>
              </TabsContent>
              <TabsContent value="access" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Status</Label>
                    <p className="text-sm text-muted-foreground">Tool visibility</p>
                  </div>
                  <Badge variant={selectedTool.is_active ? "default" : "secondary"}>
                    {selectedTool.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Access Tier</Label>
                    <p className="text-sm text-muted-foreground">Subscription requirement</p>
                  </div>
                  <Badge variant={selectedTool.is_premium ? "default" : "secondary"}>
                    {selectedTool.is_premium ? "Premium" : "Free"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Type</Label>
                    <p className="text-sm text-muted-foreground">Tool location</p>
                  </div>
                  <Badge variant="outline">
                    {selectedTool.is_external ? "External" : "Internal"}
                  </Badge>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsSettingsDialogOpen(false); openEditPage(selectedTool!); }}>
              Edit Tool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
