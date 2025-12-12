"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// Mock blog posts
const mockPosts = [
  { id: "1", title: "Getting Started with JSON Formatting", slug: "getting-started-json-formatting", status: "published", author: "Admin", category: "Tutorial", views: 1234, createdAt: "2024-12-01", publishedAt: "2024-12-01" },
  { id: "2", title: "Best Practices for Image Compression", slug: "image-compression-best-practices", status: "published", author: "Admin", category: "Guide", views: 987, createdAt: "2024-11-28", publishedAt: "2024-11-28" },
  { id: "3", title: "How to Write Academic Citations", slug: "academic-citations-guide", status: "draft", author: "Admin", category: "Tutorial", views: 0, createdAt: "2024-12-10", publishedAt: null },
  { id: "4", title: "New Tools Coming in 2025", slug: "new-tools-2025", status: "scheduled", author: "Admin", category: "News", views: 0, createdAt: "2024-12-12", publishedAt: "2025-01-01" },
  { id: "5", title: "Understanding Regular Expressions", slug: "regex-guide", status: "published", author: "Admin", category: "Tutorial", views: 756, createdAt: "2024-11-15", publishedAt: "2024-11-15" },
];

type Post = typeof mockPosts[0];

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === "published").length,
    drafts: posts.filter(p => p.status === "draft").length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  };

  const handleDeletePost = (post: Post) => {
    setPosts(posts.filter(p => p.id !== post.id));
    toast.success("Post deleted");
  };

  const handleTogglePublish = (post: Post) => {
    setPosts(posts.map(p => 
      p.id === post.id 
        ? { ...p, status: p.status === "published" ? "draft" : "published" }
        : p
    ));
    toast.success(post.status === "published" ? "Post unpublished" : "Post published");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>Write a new blog post</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter post title..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="post-url-slug" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select defaultValue="tutorial">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" placeholder="Brief description of the post..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Write your post content here..." rows={8} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured Post</Label>
                <Switch />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={() => { setIsAddDialogOpen(false); toast.success("Post created"); }}>
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">/{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>{post.views.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{post.createdAt}</TableCell>
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
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublish(post)}>
                          {post.status === "published" ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePost(post)}>
                          <Trash2 className="h-4 w-4 mr-2" />
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
