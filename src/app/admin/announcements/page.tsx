"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  CheckCircle,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";

// Mock announcements
const mockAnnouncements = [
  { id: "1", title: "System Maintenance Scheduled", message: "We will be performing maintenance on Saturday from 2-4 AM UTC.", type: "warning", status: "active", showOnHomepage: true, createdAt: "2024-12-12" },
  { id: "2", title: "New Image Compressor Tool", message: "Check out our new AI-powered image compressor with 90% size reduction!", type: "info", status: "active", showOnHomepage: true, createdAt: "2024-12-10" },
  { id: "3", title: "Holiday Special: 50% Off Pro", message: "Get Pro plan at 50% off for the holiday season. Use code HOLIDAY50.", type: "success", status: "active", showOnHomepage: false, createdAt: "2024-12-08" },
  { id: "4", title: "Old API Deprecation", message: "The v1 API will be deprecated on Jan 15, 2025. Please migrate to v2.", type: "error", status: "inactive", showOnHomepage: false, createdAt: "2024-11-20" },
];

type Announcement = typeof mockAnnouncements[0];

const typeConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500" },
  success: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500" },
  warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500" },
  error: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500" },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    showOnHomepage: false,
  });

  const handleAddAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: String(Date.now()),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      status: "active",
      showOnHomepage: formData.showOnHomepage,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsAddDialogOpen(false);
    setFormData({ title: "", message: "", type: "info", showOnHomepage: false });
    toast.success("Announcement created");
  };

  const handleToggleStatus = (announcement: Announcement) => {
    setAnnouncements(announcements.map(a => 
      a.id === announcement.id 
        ? { ...a, status: a.status === "active" ? "inactive" : "active" }
        : a
    ));
    toast.success(announcement.status === "active" ? "Announcement hidden" : "Announcement shown");
  };

  const handleDelete = (announcement: Announcement) => {
    setAnnouncements(announcements.filter(a => a.id !== announcement.id));
    toast.success("Announcement deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Create and manage platform announcements</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>Create a new announcement for your users</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Announcement title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Announcement message..."
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        Info
                      </div>
                    </SelectItem>
                    <SelectItem value="success">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Success
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Warning
                      </div>
                    </SelectItem>
                    <SelectItem value="error">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Error/Alert
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show on Homepage</Label>
                  <p className="text-sm text-muted-foreground">Display as a banner on the homepage</p>
                </div>
                <Switch 
                  checked={formData.showOnHomepage}
                  onCheckedChange={(checked) => setFormData({ ...formData, showOnHomepage: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAnnouncement}>Create Announcement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.filter(a => a.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Homepage</CardTitle>
            <Megaphone className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.filter(a => a.showOnHomepage && a.status === "active").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => {
          const config = typeConfig[announcement.type as keyof typeof typeConfig];
          const Icon = config.icon;
          
          return (
            <Card key={announcement.id} className={announcement.status === "inactive" ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${config.bg}/10`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="mt-1">{announcement.message}</CardDescription>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant={announcement.status === "active" ? "default" : "secondary"}
                               className={announcement.status === "active" ? "bg-green-500" : ""}>
                          {announcement.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{announcement.type}</Badge>
                        {announcement.showOnHomepage && (
                          <Badge variant="outline" className="text-blue-500 border-blue-500">
                            Homepage
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">Created: {announcement.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(announcement)}>
                      {announcement.status === "active" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(announcement)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
