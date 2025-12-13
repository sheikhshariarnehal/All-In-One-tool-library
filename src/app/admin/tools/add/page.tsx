"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Loader2,
  Link as LinkIcon,
  Globe,
  Image,
  Tag,
  Settings,
  Info,
  X,
  Plus,
  ExternalLink,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  { value: "developer", label: "Developer Tools" },
  { value: "academic", label: "Academic Tools" },
  { value: "ai-image", label: "AI Image Tools" },
  { value: "utilities", label: "Utilities" },
  { value: "document", label: "Document Tools" },
  { value: "ai", label: "AI Tools" },
  { value: "seo", label: "SEO Tools" },
  { value: "social", label: "Social Media" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "productivity", label: "Productivity" },
  { value: "design", label: "Design Tools" },
  { value: "other", label: "Other" },
];

const iconOptions = [
  "Code", "FileText", "Image", "Globe", "Calculator", "Palette", "Video", 
  "Music", "Database", "Lock", "Search", "Settings", "Star", "Heart",
  "Zap", "Shield", "Clock", "Calendar", "Mail", "MessageSquare",
  "Users", "BarChart", "TrendingUp", "Download", "Upload", "Share",
];

interface ToolFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  icon: string;
  icon_url: string;
  site_url: string;
  is_external: boolean;
  is_premium: boolean;
  is_active: boolean;
  usage_limit_free: number;
  usage_limit_pro: number;
  features: string[];
  tags: string[];
  sort_order: number;
  metadata: Record<string, string>;
}

const defaultFormData: ToolFormData = {
  name: "",
  slug: "",
  description: "",
  short_description: "",
  category: "utilities",
  icon: "Globe",
  icon_url: "",
  site_url: "",
  is_external: true,
  is_premium: false,
  is_active: true,
  usage_limit_free: 10,
  usage_limit_pro: 1000,
  features: [],
  tags: [],
  sort_order: 0,
  metadata: {},
};

export default function AddEditToolPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolId = searchParams.get("id");
  const isEditing = !!toolId;

  const [formData, setFormData] = useState<ToolFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newMetaKey, setNewMetaKey] = useState("");
  const [newMetaValue, setNewMetaValue] = useState("");

  useEffect(() => {
    if (isEditing && toolId) {
      fetchTool(toolId);
    }
  }, [isEditing, toolId]);

  const fetchTool = async (id: string) => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/admin/tools?id=${id}`, { credentials: 'include' });
      const data = await response.json();
      
      if (data.tools) {
        const tool = data.tools.find((t: ToolFormData & { id: string }) => t.id === id);
        if (tool) {
          setFormData({
            name: tool.name || "",
            slug: tool.slug || "",
            description: tool.description || "",
            short_description: tool.short_description || "",
            category: tool.category || "utilities",
            icon: tool.icon || "Globe",
            icon_url: tool.icon_url || "",
            site_url: tool.site_url || "",
            is_external: tool.is_external ?? true,
            is_premium: tool.is_premium ?? false,
            is_active: tool.is_active ?? true,
            usage_limit_free: tool.usage_limit_free || 10,
            usage_limit_pro: tool.usage_limit_pro || 1000,
            features: tool.features || [],
            tags: tool.tags || [],
            sort_order: tool.sort_order || 0,
            metadata: tool.metadata || {},
          });
        }
      }
    } catch (error) {
      console.error("Error fetching tool:", error);
      toast.error("Failed to load tool data");
    } finally {
      setIsFetching(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.is_external && !formData.site_url) {
      toast.error("External tools require a site URL");
      return;
    }

    setIsLoading(true);
    try {
      const method = isEditing ? "PATCH" : "POST";
      const body = isEditing ? { id: toolId, ...formData } : formData;

      const response = await fetch("/api/admin/tools", {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save tool");
      }

      toast.success(isEditing ? "Tool updated successfully" : "Tool created successfully");
      router.push("/admin/tools");
    } catch (error) {
      console.error("Error saving tool:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save tool");
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addMetadata = () => {
    if (newMetaKey.trim() && newMetaValue.trim()) {
      setFormData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [newMetaKey.trim()]: newMetaValue.trim() },
      }));
      setNewMetaKey("");
      setNewMetaValue("");
    }
  };

  const removeMetadata = (key: string) => {
    setFormData(prev => {
      const { [key]: _, ...rest } = prev.metadata;
      return { ...prev, metadata: rest };
    });
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Tool" : "Add New Tool"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? "Update tool information and settings" 
              : "Create a new tool with external URL redirect"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="basic">
              <Info className="h-4 w-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Image className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="features">
              <Tag className="h-4 w-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of the tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Tool Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., JSON Formatter Pro"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      URL Slug <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="slug"
                      placeholder="e.g., json-formatter-pro"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Will be used in URL: /tools/{formData.slug || "tool-slug"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    placeholder="A brief one-line description"
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of what this tool does..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  External Tool Settings
                </CardTitle>
                <CardDescription>
                  Configure the external website URL and redirect settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>External Tool</Label>
                    <p className="text-sm text-muted-foreground">
                      Tool redirects to an external website
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_external}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_external: checked }))}
                  />
                </div>

                {formData.is_external && (
                  <div className="space-y-2">
                    <Label htmlFor="site_url">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Website URL <span className="text-destructive">*</span>
                      </div>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="site_url"
                        type="url"
                        placeholder="https://example.com/tool"
                        value={formData.site_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, site_url: e.target.value }))}
                        className="flex-1"
                      />
                      {formData.site_url && (
                        <Button type="button" variant="outline" size="icon" asChild>
                          <a href={formData.site_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Users will be redirected to this URL when they click on the tool
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Icon & Branding</CardTitle>
                <CardDescription>
                  Customize how the tool appears in listings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Icon Name (Lucide)</Label>
                  <Select 
                    value={formData.icon} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, icon: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="icon_url">Custom Icon URL</Label>
                  <Input
                    id="icon_url"
                    type="url"
                    placeholder="https://example.com/icon.png"
                    value={formData.icon_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_url: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Use a custom image instead of a Lucide icon
                  </p>
                </div>

                {formData.icon_url && (
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={formData.icon_url} 
                      alt="Tool icon preview" 
                      className="h-12 w-12 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-icon.png";
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium">Icon Preview</p>
                      <p className="text-xs text-muted-foreground">
                        This is how the icon will appear
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                  List the key features of this tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <span className="flex-1 text-sm">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No features added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to help users find this tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No tags added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Metadata</CardTitle>
                <CardDescription>
                  Add custom key-value pairs for additional information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Key"
                    value={newMetaKey}
                    onChange={(e) => setNewMetaKey(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={newMetaValue}
                    onChange={(e) => setNewMetaValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addMetadata}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(formData.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <span className="font-medium text-sm">{key}:</span>
                      <span className="flex-1 text-sm text-muted-foreground">{value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeMetadata(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {Object.keys(formData.metadata).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No custom metadata added
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Access</CardTitle>
                <CardDescription>
                  Configure tool visibility and access settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this tool visible to users
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Premium Tool</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a subscription to access
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_premium}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_premium: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <CardDescription>
                  Set usage limits for different subscription tiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usage_limit_free">Free Tier Limit</Label>
                    <Input
                      id="usage_limit_free"
                      type="number"
                      min="0"
                      value={formData.usage_limit_free}
                      onChange={(e) => setFormData(prev => ({ ...prev, usage_limit_free: parseInt(e.target.value) || 0 }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Uses per month for free users
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage_limit_pro">Pro Tier Limit</Label>
                    <Input
                      id="usage_limit_pro"
                      type="number"
                      min="0"
                      value={formData.usage_limit_pro}
                      onChange={(e) => setFormData(prev => ({ ...prev, usage_limit_pro: parseInt(e.target.value) || 0 }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Uses per month for pro users
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Order</CardTitle>
                <CardDescription>
                  Control the position of this tool in listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first (0 = highest priority)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>
          <div className="flex gap-2">
            {formData.is_external && formData.site_url && (
              <Button type="button" variant="outline" asChild>
                <a href={formData.site_url} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Site
                </a>
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Save Changes" : "Create Tool"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
