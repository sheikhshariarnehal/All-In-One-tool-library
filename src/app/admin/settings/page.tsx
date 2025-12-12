"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  Settings,
  Globe,
  Mail,
  Bell,
  Palette,
  Database,
  Shield,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your platform settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="Tool Library" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input id="siteUrl" defaultValue="https://toollib.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea 
                  id="siteDescription" 
                  defaultValue="Your complete tool library for work and study. 50+ free online tools."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Features</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Show maintenance page to visitors</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Limits</h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Free Tier Usage Limit</Label>
                    <Input type="number" defaultValue="100" />
                    <p className="text-xs text-muted-foreground">Uses per month</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Pro Tier Usage Limit</Label>
                    <Input type="number" defaultValue="1000" />
                    <p className="text-xs text-muted-foreground">Uses per month</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Rate Limit</Label>
                    <Input type="number" defaultValue="60" />
                    <p className="text-xs text-muted-foreground">Requests per minute</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Email Provider</Label>
                <Select defaultValue="smtp">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="postmark">Postmark</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" placeholder="587" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Username</Label>
                  <Input id="smtpUser" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPass">Password</Label>
                  <Input id="smtpPass" type="password" placeholder="••••••••" />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input id="fromEmail" defaultValue="noreply@toollib.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input id="fromName" defaultValue="Tool Library" />
                </div>
              </div>

              <Button variant="outline">
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure admin notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a new user signs up</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Subscription</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone subscribes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Subscription Canceled</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone cancels</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Failed</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a payment fails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Alert Thresholds</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>High Usage Alert (%)</Label>
                    <Input type="number" defaultValue="90" />
                  </div>
                  <div className="space-y-2">
                    <Label>Error Rate Alert (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Admin Email Recipients</Label>
                <Textarea 
                  placeholder="admin@example.com&#10;team@example.com"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">One email per line</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  {["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"].map((color) => (
                    <button
                      key={color}
                      className="h-8 w-8 rounded-full border-2 border-transparent hover:border-foreground/50 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Branding</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input placeholder="https://example.com/logo.png" />
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon URL</Label>
                    <Input placeholder="https://example.com/favicon.ico" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Powered By</Label>
                  <p className="text-sm text-muted-foreground">Display "Powered by Tool Library" in footer</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Technical and advanced configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">API Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Public API</Label>
                    <p className="text-sm text-muted-foreground">Allow external API access</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>API Rate Limit</Label>
                  <Input type="number" defaultValue="1000" />
                  <p className="text-xs text-muted-foreground">Requests per hour per API key</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data & Privacy</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics Collection</Label>
                    <p className="text-sm text-muted-foreground">Collect anonymous usage analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Input type="number" defaultValue="90" />
                  <p className="text-xs text-muted-foreground">How long to keep user activity data</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Danger Zone</h3>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">Clear Cache</Button>
                  <Button variant="outline">Rebuild Search Index</Button>
                  <Button variant="destructive">Reset Analytics</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
