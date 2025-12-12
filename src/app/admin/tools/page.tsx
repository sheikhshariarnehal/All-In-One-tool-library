"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { toast } from "sonner";

const categoryIcons: Record<string, React.ElementType> = {
  developer: Code,
  academic: GraduationCap,
  "ai-image": Image,
  document: FileText,
  utilities: Wrench,
};

// Mock tools data
const mockTools = [
  { id: "1", name: "JSON Formatter", slug: "json-formatter", category: "developer", isPremium: false, isActive: true, usageCount: 15234, description: "Format, validate, and beautify JSON data" },
  { id: "2", name: "Base64 Encoder", slug: "base64-encoder", category: "developer", isPremium: false, isActive: true, usageCount: 12456, description: "Encode and decode Base64 strings" },
  { id: "3", name: "Image Compressor", slug: "image-compressor", category: "ai-image", isPremium: true, isActive: true, usageCount: 9876, description: "Compress images without quality loss" },
  { id: "4", name: "Word Counter", slug: "word-counter", category: "academic", isPremium: false, isActive: true, usageCount: 8765, description: "Count words, characters, and sentences" },
  { id: "5", name: "Citation Generator", slug: "citation-generator", category: "academic", isPremium: false, isActive: true, usageCount: 7654, description: "Generate citations in APA, MLA, Chicago" },
  { id: "6", name: "QR Code Generator", slug: "qr-code-generator", category: "utilities", isPremium: false, isActive: true, usageCount: 6543, description: "Create QR codes for URLs and text" },
  { id: "7", name: "Hash Generator", slug: "hash-generator", category: "developer", isPremium: false, isActive: true, usageCount: 5432, description: "Generate MD5, SHA-1, SHA-256 hashes" },
  { id: "8", name: "Regex Tester", slug: "regex-tester", category: "developer", isPremium: true, isActive: false, usageCount: 4321, description: "Test and debug regular expressions" },
  { id: "9", name: "Lorem Ipsum", slug: "lorem-ipsum", category: "developer", isPremium: false, isActive: true, usageCount: 3210, description: "Generate placeholder text" },
  { id: "10", name: "URL Encoder", slug: "url-encoder", category: "developer", isPremium: false, isActive: true, usageCount: 2109, description: "Encode and decode URLs" },
];

type Tool = typeof mockTools[0];

const categories = [
  { value: "developer", label: "Developer" },
  { value: "academic", label: "Academic" },
  { value: "ai-image", label: "AI Image" },
  { value: "utilities", label: "Utilities" },
  { value: "document", label: "Document" },
  { value: "professional", label: "Professional" },
];

export default function ToolsManagementPage() {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "developer",
    description: "",
    isPremium: false,
    isActive: true,
  });

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || tool.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && tool.isActive) ||
      (filterStatus === "inactive" && !tool.isActive) ||
      (filterStatus === "premium" && tool.isPremium);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: tools.length,
    active: tools.filter(t => t.isActive).length,
    premium: tools.filter(t => t.isPremium).length,
    totalUsage: tools.reduce((sum, t) => sum + t.usageCount, 0),
  };

  const handleToggleActive = (tool: Tool) => {
    setTools(tools.map(t => 
      t.id === tool.id ? { ...t, isActive: !t.isActive } : t
    ));
    toast.success(tool.isActive ? "Tool disabled" : "Tool enabled");
  };

  const handleTogglePremium = (tool: Tool) => {
    setTools(tools.map(t => 
      t.id === tool.id ? { ...t, isPremium: !t.isPremium } : t
    ));
    toast.success(tool.isPremium ? "Tool set to free" : "Tool set to premium");
  };

  const handleDeleteTool = (tool: Tool) => {
    setTools(tools.filter(t => t.id !== tool.id));
    toast.success("Tool deleted successfully");
  };

  const handleAddTool = () => {
    const newTool: Tool = {
      id: String(Date.now()),
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      category: formData.category,
      description: formData.description,
      isPremium: formData.isPremium,
      isActive: formData.isActive,
      usageCount: 0,
    };
    setTools([...tools, newTool]);
    setIsAddDialogOpen(false);
    setFormData({ name: "", slug: "", category: "developer", description: "", isPremium: false, isActive: true });
    toast.success("Tool added successfully");
  };

  const handleEditTool = () => {
    if (!selectedTool) return;
    setTools(tools.map(t => 
      t.id === selectedTool.id ? {
        ...t,
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        isPremium: formData.isPremium,
        isActive: formData.isActive,
      } : t
    ));
    setIsEditDialogOpen(false);
    toast.success("Tool updated successfully");
  };

  const openEditDialog = (tool: Tool) => {
    setSelectedTool(tool);
    setFormData({
      name: tool.name,
      slug: tool.slug,
      category: tool.category,
      description: tool.description,
      isPremium: tool.isPremium,
      isActive: tool.isActive,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tools Management</h1>
          <p className="text-muted-foreground">Manage your platform tools and their settings</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Tool</DialogTitle>
              <DialogDescription>Create a new tool for your platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tool Name</Label>
                <Input 
                  id="name" 
                  placeholder="JSON Formatter"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL path)</Label>
                <Input 
                  id="slug" 
                  placeholder="json-formatter"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what this tool does..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Premium Tool</Label>
                  <p className="text-sm text-muted-foreground">Require subscription to access</p>
                </div>
                <Switch 
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">Make tool available to users</p>
                </div>
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTool}>Add Tool</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Tools</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premium}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage.toLocaleString()}</div>
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
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
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CategoryIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">/{tool.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{tool.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${tool.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                        <span className="text-sm">{tool.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tool.isPremium ? (
                        <Badge className="bg-yellow-500">Premium</Badge>
                      ) : (
                        <Badge variant="secondary">Free</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{tool.usageCount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(tool)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Tool
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(tool)}>
                            {tool.isActive ? (
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
                            {tool.isPremium ? "Make Free" : "Make Premium"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedTool(tool); setIsSettingsDialogOpen(true); }}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTool(tool)}>
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
        </CardContent>
      </Card>

      {/* Edit Tool Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Tool</DialogTitle>
            <DialogDescription>Update tool information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tool Name</Label>
              <Input 
                id="edit-name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input 
                id="edit-slug" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Premium Tool</Label>
              <Switch 
                checked={formData.isPremium}
                onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch 
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTool}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tool Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tool Settings</DialogTitle>
            <DialogDescription>Configure advanced tool settings</DialogDescription>
          </DialogHeader>
          {selectedTool && (
            <Tabs defaultValue="limits" className="py-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="limits">Usage Limits</TabsTrigger>
                <TabsTrigger value="access">Access</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="limits" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Free Tier Limit (per month)</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div className="space-y-2">
                  <Label>Pro Tier Limit (per month)</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Rate Limit (per minute)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
              </TabsContent>
              <TabsContent value="access" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Authentication</Label>
                    <p className="text-sm text-muted-foreground">Users must be logged in</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Track Usage</Label>
                    <p className="text-sm text-muted-foreground">Log tool usage analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show in Directory</Label>
                    <p className="text-sm text-muted-foreground">Display in public tools list</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Custom CSS Class</Label>
                  <Input placeholder="custom-tool-class" />
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <Input placeholder="keyword1, keyword2, keyword3" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable API Access</Label>
                    <p className="text-sm text-muted-foreground">Allow programmatic access</p>
                  </div>
                  <Switch />
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsSettingsDialogOpen(false); toast.success("Settings saved"); }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
