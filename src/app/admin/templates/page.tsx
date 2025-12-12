"use client";

import { useState, useEffect, useCallback } from "react";
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
  FolderOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  FileText,
  Crown,
  Eye,
  Loader2,
  RefreshCw,
  AlertCircle,
  Upload,
  X,
  Image,
  File,
  Briefcase,
  GraduationCap,
  Mail,
  Building,
  Presentation,
  FileSpreadsheet,
  Scale,
  Heart,
  Code,
  Palette,
  Music,
  Camera,
  BookOpen,
  PenLine,
  Calculator,
  Globe,
  Sparkles,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";

interface Template {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  file_url: string | null;
  preview_url: string | null;
  file_format: string;
  file_size: number | null;
  is_premium: boolean;
  is_active: boolean;
  download_count: number;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  template_categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  display_order: number;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  file_format: string;
  file_url: string;
  preview_url: string;
  file_size: number;
  is_premium: boolean;
  is_active: boolean;
  tags: string;
}

interface UploadState {
  templateFile: File | null;
  previewFile: File | null;
  templateUploading: boolean;
  previewUploading: boolean;
}

const initialFormData: FormData = {
  name: "",
  slug: "",
  description: "",
  category_id: "",
  file_format: "docx",
  file_url: "",
  preview_url: "",
  file_size: 0,
  is_premium: false,
  is_active: true,
  tags: "",
};

// Icon options for categories
const iconOptions = [
  { name: "FileText", icon: FileText, label: "Document" },
  { name: "Briefcase", icon: Briefcase, label: "Business" },
  { name: "GraduationCap", icon: GraduationCap, label: "Education" },
  { name: "Mail", icon: Mail, label: "Email" },
  { name: "Building", icon: Building, label: "Corporate" },
  { name: "Presentation", icon: Presentation, label: "Presentation" },
  { name: "FileSpreadsheet", icon: FileSpreadsheet, label: "Spreadsheet" },
  { name: "Scale", icon: Scale, label: "Legal" },
  { name: "Heart", icon: Heart, label: "Health" },
  { name: "Code", icon: Code, label: "Developer" },
  { name: "Palette", icon: Palette, label: "Design" },
  { name: "Music", icon: Music, label: "Music" },
  { name: "Camera", icon: Camera, label: "Photography" },
  { name: "BookOpen", icon: BookOpen, label: "Academic" },
  { name: "PenLine", icon: PenLine, label: "Writing" },
  { name: "Calculator", icon: Calculator, label: "Finance" },
  { name: "Globe", icon: Globe, label: "Web" },
  { name: "FolderOpen", icon: FolderOpen, label: "General" },
];

// Color options for categories
const colorOptions = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Yellow", value: "#eab308" },
  { name: "Slate", value: "#64748b" },
];

// Get icon component by name
function getIconByName(iconName: string | null) {
  if (!iconName) return FolderOpen;
  const found = iconOptions.find(opt => opt.name.toLowerCase() === iconName.toLowerCase());
  return found?.icon || FolderOpen;
}

export default function AdminTemplatesPage() {
  // State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // File upload state
  const [uploadState, setUploadState] = useState<UploadState>({
    templateFile: null,
    previewFile: null,
    templateUploading: false,
    previewUploading: false,
  });

  // Fetch templates from API
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch templates");
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/templates/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [fetchTemplates, fetchCategories]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when name changes
      if (field === "name" && typeof value === "string" && !editingTemplate) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  // Open edit dialog
  const openEditDialog = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      slug: template.slug,
      description: template.description || "",
      category_id: template.category_id || "",
      file_format: template.file_format,
      file_url: template.file_url || "",
      preview_url: template.preview_url || "",
      file_size: template.file_size || 0,
      is_premium: template.is_premium,
      is_active: template.is_active,
      tags: template.tags?.join(", ") || "",
    });
    setUploadState({
      templateFile: null,
      previewFile: null,
      templateUploading: false,
      previewUploading: false,
    });
    setIsDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    setEditingTemplate(null);
    setFormData(initialFormData);
    setUploadState({
      templateFile: null,
      previewFile: null,
      templateUploading: false,
      previewUploading: false,
    });
    setIsDialogOpen(true);
  };

  // Handle file upload
  const uploadFile = async (file: File, type: 'template' | 'preview'): Promise<string | null> => {
    const uploadKey = type === 'template' ? 'templateUploading' : 'previewUploading';
    setUploadState(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('bucket', 'templates');
      formDataUpload.append('folder', type === 'template' ? 'files' : 'previews');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      
      if (type === 'template') {
        setFormData(prev => ({
          ...prev,
          file_url: data.url,
          file_size: data.size,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          preview_url: data.url,
        }));
      }

      toast.success(`${type === 'template' ? 'Template file' : 'Preview image'} uploaded successfully`);
      return data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      return null;
    } finally {
      setUploadState(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'template' | 'preview') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type for preview
    if (type === 'preview') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Please upload an image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 50MB');
      return;
    }

    // Update local state
    const stateKey = type === 'template' ? 'templateFile' : 'previewFile';
    setUploadState(prev => ({ ...prev, [stateKey]: file }));

    // Auto-detect file format for templates
    if (type === 'template') {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const formatMap: Record<string, string> = {
        'docx': 'docx', 'doc': 'docx',
        'xlsx': 'xlsx', 'xls': 'xlsx',
        'pptx': 'pptx', 'ppt': 'pptx',
        'pdf': 'pdf',
        'txt': 'txt',
        'zip': 'zip', 'rar': 'zip',
      };
      if (formatMap[ext]) {
        setFormData(prev => ({ ...prev, file_format: formatMap[ext] }));
      }
    }

    // Upload immediately
    await uploadFile(file, type);
  };

  // Clear uploaded file
  const clearFile = (type: 'template' | 'preview') => {
    const stateKey = type === 'template' ? 'templateFile' : 'previewFile';
    setUploadState(prev => ({ ...prev, [stateKey]: null }));
    
    if (type === 'template') {
      setFormData(prev => ({ ...prev, file_url: '', file_size: 0 }));
    } else {
      setFormData(prev => ({ ...prev, preview_url: '' }));
    }
  };

  // Save template (create or update)
  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.slug || !formData.file_format) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        category_id: formData.category_id || null,
        file_format: formData.file_format,
        file_url: formData.file_url || null,
        preview_url: formData.preview_url || null,
        file_size: formData.file_size || null,
        is_premium: formData.is_premium,
        is_active: formData.is_active,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };

      let response;
      if (editingTemplate) {
        // Update existing template
        response = await fetch(`/api/admin/templates/${editingTemplate.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new template
        response = await fetch("/api/admin/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save template");
      }

      toast.success(editingTemplate ? "Template updated successfully" : "Template created successfully");
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  // Delete template
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/templates/${templateToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete template");

      toast.success("Template deleted successfully");
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (err) {
      toast.error("Failed to delete template");
    } finally {
      setSaving(false);
    }
  };

  // Toggle template active status
  const toggleActive = async (template: Template) => {
    try {
      const response = await fetch(`/api/admin/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !template.is_active }),
      });

      if (!response.ok) throw new Error("Failed to update template");

      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, is_active: !t.is_active } : t))
      );
      toast.success(`Template ${!template.is_active ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error("Failed to update template status");
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName) {
      toast.error("Please enter a category name");
      return;
    }

    const slug = newCategorySlug || generateSlug(newCategoryName);
    
    setSaving(true);
    try {
      const response = await fetch("/api/admin/templates/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          slug: slug,
          description: newCategoryDescription || null,
          icon: newCategoryIcon || null,
          color: newCategoryColor || null,
          is_active: true,
          display_order: categories.length,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }
      
      const data = await response.json();
      setCategories((prev) => [...prev, data.category]);
      clearCategoryForm();
      toast.success("Category added successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  // Clear category form
  const clearCategoryForm = () => {
    setNewCategoryName("");
    setNewCategorySlug("");
    setNewCategoryDescription("");
    setNewCategoryIcon("");
    setNewCategoryColor("");
    setEditingCategory(null);
  };

  // Edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategorySlug(category.slug);
    setNewCategoryDescription(category.description || "");
    setNewCategoryIcon(category.icon || "");
    setNewCategoryColor(category.color || "");
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName) {
      toast.error("Please enter a category name");
      return;
    }

    const slug = newCategorySlug || generateSlug(newCategoryName);
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/templates/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          slug: slug,
          description: newCategoryDescription || null,
          icon: newCategoryIcon || null,
          color: newCategoryColor || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category");
      }
      
      const data = await response.json();
      setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? data.category : c));
      clearCategoryForm();
      toast.success("Category updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    const hasTemplates = templates.some((t) => t.category_id === categoryId);
    if (hasTemplates) {
      toast.error("Cannot delete category with templates. Move or delete templates first.");
      return;
    }
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/templates/categories/${categoryId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }
      
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format file size
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes || bytes === 0) return "N/A";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Calculate stats
  const totalDownloads = templates.reduce((acc, t) => acc + t.download_count, 0);
  const activeTemplates = templates.filter((t) => t.is_active).length;
  const premiumTemplates = templates.filter((t) => t.is_premium).length;

  // Loading state
  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchTemplates}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates Management</h1>
          <p className="text-muted-foreground">
            Manage downloadable templates and categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTemplates} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
            setIsCategoryDialogOpen(open);
            if (!open) clearCategoryForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Manage Categories"}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory 
                    ? "Update the category details below" 
                    : "Add, edit, or remove template categories"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Category Form */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  {/* Preview Card */}
                  {newCategoryName && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: newCategoryColor || '#64748b' }}
                      >
                        {(() => {
                          const IconComponent = getIconByName(newCategoryIcon);
                          return <IconComponent className="h-5 w-5 text-white" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{newCategoryName}</p>
                        <p className="text-xs text-muted-foreground">
                          {newCategorySlug || generateSlug(newCategoryName)}
                        </p>
                      </div>
                      <Badge variant="secondary">Preview</Badge>
                    </div>
                  )}

                  {/* Name & Slug */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Name *</Label>
                      <Input
                        placeholder="e.g., Business Templates"
                        value={newCategoryName}
                        onChange={(e) => {
                          setNewCategoryName(e.target.value);
                          if (!editingCategory) {
                            setNewCategorySlug(generateSlug(e.target.value));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newCategoryName) {
                            e.preventDefault();
                            editingCategory ? handleUpdateCategory() : handleAddCategory();
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Slug</Label>
                      <Input
                        placeholder="business-templates"
                        value={newCategorySlug}
                        onChange={(e) => setNewCategorySlug(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Description</Label>
                    <Textarea
                      placeholder="Brief description of this category..."
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  {/* Icon Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Icon</Label>
                    <div className="grid grid-cols-9 gap-1">
                      {iconOptions.map((opt) => {
                        const IconComp = opt.icon;
                        const isSelected = newCategoryIcon?.toLowerCase() === opt.name.toLowerCase();
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => setNewCategoryIcon(opt.name)}
                            className={`
                              p-2 rounded-lg border transition-all
                              ${isSelected 
                                ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-1' 
                                : 'border-transparent hover:bg-muted hover:border-border'
                              }
                            `}
                            title={opt.label}
                          >
                            <IconComp className={`h-4 w-4 mx-auto ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selected: {newCategoryIcon || 'None'} - Click to select an icon
                    </p>
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5 flex-wrap">
                        {colorOptions.map((color) => {
                          const isSelected = newCategoryColor?.toLowerCase() === color.value.toLowerCase();
                          return (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setNewCategoryColor(color.value)}
                              className={`
                                w-7 h-7 rounded-full transition-all flex items-center justify-center
                                ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}
                              `}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Custom: #hex"
                          value={newCategoryColor}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {editingCategory ? (
                      <>
                        <Button 
                          onClick={handleUpdateCategory} 
                          className="flex-1"
                          disabled={saving || !newCategoryName}
                        >
                          {saving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Update Category
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={clearCategoryForm}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={handleAddCategory} 
                        className="w-full"
                        disabled={saving || !newCategoryName}
                      >
                        {saving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        Add Category
                      </Button>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-xs text-muted-foreground px-2">
                    {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
                  </span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                {/* Category List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.length === 0 ? (
                    <div className="text-center py-8">
                      <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No categories yet. Add one above.
                      </p>
                    </div>
                  ) : (
                    categories.map((cat) => {
                      const templateCount = templates.filter((t) => t.category_id === cat.id).length;
                      const IconComponent = getIconByName(cat.icon);
                      return (
                        <div
                          key={cat.id}
                          className={`
                            flex items-center gap-3 p-3 border rounded-lg transition-all
                            ${editingCategory?.id === cat.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                            }
                          `}
                        >
                          {/* Icon */}
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: cat.color || '#64748b' }}
                          >
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{cat.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {templateCount}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {cat.description || cat.slug}
                            </p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditCategory(cat)}
                              disabled={saving}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCategory(cat.id)}
                              disabled={saving || templateCount > 0}
                              title={templateCount > 0 ? `Cannot delete: ${templateCount} templates` : "Delete category"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Templates
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {categories.length} categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Templates
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {templates.length - activeTemplates} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Premium Templates
            </CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{premiumTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {templates.length > 0
                ? Math.round((premiumTemplates / templates.length) * 100)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Manage all downloadable templates
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {templates.length === 0
                  ? "Get started by adding your first template."
                  : "Try adjusting your search or filter."}
              </p>
              {templates.length === 0 && (
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Template
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Download Link</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {template.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {template.template_categories?.name ||
                          categories.find((c) => c.id === template.category_id)?.name ||
                          "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="uppercase">
                        {template.file_format}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(template.file_size)}</TableCell>
                    <TableCell>
                      {template.file_url ? (
                        <a 
                          href={template.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline max-w-[150px]"
                        >
                          <Download className="h-3 w-3 shrink-0" />
                          <span className="truncate">{template.file_url.split('/').pop() || 'Download'}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">No file</span>
                      )}
                    </TableCell>
                    <TableCell>{template.download_count.toLocaleString()}</TableCell>
                    <TableCell>
                      {template.is_premium ? (
                        <Badge className="bg-amber-500">Premium</Badge>
                      ) : (
                        <Badge variant="secondary">Free</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={template.is_active}
                        onCheckedChange={() => toggleActive(template)}
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
                          {template.file_url && (
                            <DropdownMenuItem asChild>
                              <a href={template.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </a>
                            </DropdownMenuItem>
                          )}
                          {template.preview_url && (
                            <DropdownMenuItem asChild>
                              <a href={template.preview_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openEditDialog(template)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setTemplateToDelete(template);
                              setIsDeleteDialogOpen(true);
                            }}
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
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Add New Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Update the template details below"
                : "Fill in the details for the new template"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="Modern Resume Template"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="modern-resume-template"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the template..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>File Format *</Label>
                <Select
                  value={formData.file_format}
                  onValueChange={(value) => handleInputChange("file_format", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">Word (.docx)</SelectItem>
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    <SelectItem value="pptx">PowerPoint (.pptx)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    <SelectItem value="txt">Text (.txt)</SelectItem>
                    <SelectItem value="zip">Archive (.zip)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Template File Upload */}
            <div className="space-y-2">
              <Label>Template File *</Label>
              {formData.file_url ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <File className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadState.templateFile?.name || "File ready"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formatFileSize(formData.file_size)} {formData.file_size ? "•" : ""} {formData.file_format.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {formData.file_url}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => clearFile('template')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* File Upload Option */}
                  <div className="relative">
                    <input
                      type="file"
                      id="template-file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt,.pdf,.txt,.zip,.rar"
                      onChange={(e) => handleFileSelect(e, 'template')}
                      disabled={uploadState.templateUploading}
                    />
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
                      {uploadState.templateUploading ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Click to upload or drag & drop</p>
                          <p className="text-xs text-muted-foreground">
                            Word, Excel, PowerPoint, PDF, TXT, or ZIP (max 50MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>
                  {/* Direct URL Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter direct download URL (https://...)"
                      value={formData.file_url}
                      onChange={(e) => handleInputChange("file_url", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* File Size (for URL entries) */}
            {formData.file_url && !uploadState.templateFile && (
              <div className="space-y-2">
                <Label htmlFor="file_size">File Size (bytes)</Label>
                <Input
                  id="file_size"
                  type="number"
                  placeholder="e.g., 1024000 for ~1MB"
                  value={formData.file_size || ""}
                  onChange={(e) => handleInputChange("file_size", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Enter file size in bytes for display purposes
                </p>
              </div>
            )}

            {/* Preview Image Upload */}
            <div className="space-y-2">
              <Label>Preview Image</Label>
              {formData.preview_url ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <div className="relative h-16 w-16 rounded overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.preview_url}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadState.previewFile?.name || "Preview image"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formData.preview_url}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => clearFile('preview')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Image Upload Option */}
                  <div className="relative">
                    <input
                      type="file"
                      id="preview-file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileSelect(e, 'preview')}
                      disabled={uploadState.previewUploading}
                    />
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
                      {uploadState.previewUploading ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Image className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Click to upload preview image</p>
                          <p className="text-xs text-muted-foreground">
                            JPEG, PNG, GIF, or WebP (max 50MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>
                  {/* Direct URL Input */}
                  <Input
                    placeholder="Enter preview image URL (https://...)"
                    value={formData.preview_url}
                    onChange={(e) => handleInputChange("preview_url", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="resume, professional, modern"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="is-premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => handleInputChange("is_premium", checked)}
                />
                <Label htmlFor="is-premium">Premium Only</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <Label htmlFor="is-active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template &quot;{templateToDelete?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              disabled={saving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
