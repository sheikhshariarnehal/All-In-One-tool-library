"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Key,
  Lock,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const adminUsers = [
  { id: "1", name: "Admin User", email: "admin@toollib.com", role: "super_admin", lastLogin: "2024-12-12 10:30", status: "active" },
  { id: "2", name: "John Manager", email: "john@toollib.com", role: "admin", lastLogin: "2024-12-11 15:45", status: "active" },
  { id: "3", name: "Jane Support", email: "jane@toollib.com", role: "moderator", lastLogin: "2024-12-10 09:20", status: "active" },
];

const securityLogs = [
  { id: "1", action: "Login", user: "admin@toollib.com", ip: "192.168.1.100", time: "2024-12-12 10:30", status: "success" },
  { id: "2", action: "Password Change", user: "john@toollib.com", ip: "192.168.1.101", time: "2024-12-11 15:45", status: "success" },
  { id: "3", action: "Failed Login", user: "unknown@example.com", ip: "45.67.89.123", time: "2024-12-11 14:20", status: "failed" },
  { id: "4", action: "User Deleted", user: "admin@toollib.com", ip: "192.168.1.100", time: "2024-12-10 11:00", status: "success" },
  { id: "5", action: "Settings Changed", user: "admin@toollib.com", ip: "192.168.1.100", time: "2024-12-10 09:30", status: "success" },
];

const apiKeys = [
  { id: "1", name: "Production API", key: "sk_live_****4242", created: "2024-01-15", lastUsed: "2024-12-12", status: "active" },
  { id: "2", name: "Development API", key: "sk_test_****1234", created: "2024-06-20", lastUsed: "2024-12-11", status: "active" },
  { id: "3", name: "Legacy API", key: "sk_live_****5678", created: "2023-08-10", lastUsed: "2024-10-01", status: "inactive" },
];

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security</h1>
        <p className="text-muted-foreground">Manage security settings and access control</p>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">85/100</div>
            <p className="text-xs text-muted-foreground">Good</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers.length}</div>
            <p className="text-xs text-muted-foreground">active admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.filter(k => k.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">active keys</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="access" className="space-y-6">
        <TabsList>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
        </TabsList>

        {/* Access Control */}
        <TabsContent value="access">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage admin and moderator access</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "super_admin" ? "default" : "secondary"}>
                          {user.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-500 border-green-500">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure what each role can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 font-medium text-sm">
                  <div>Permission</div>
                  <div className="text-center">Super Admin</div>
                  <div className="text-center">Admin</div>
                  <div className="text-center">Moderator</div>
                </div>
                <Separator />
                {[
                  { name: "View Dashboard", superAdmin: true, admin: true, moderator: true },
                  { name: "Manage Users", superAdmin: true, admin: true, moderator: false },
                  { name: "Manage Subscriptions", superAdmin: true, admin: true, moderator: false },
                  { name: "Edit Tools", superAdmin: true, admin: true, moderator: true },
                  { name: "Delete Tools", superAdmin: true, admin: false, moderator: false },
                  { name: "View Analytics", superAdmin: true, admin: true, moderator: true },
                  { name: "Change Settings", superAdmin: true, admin: false, moderator: false },
                  { name: "Manage Admins", superAdmin: true, admin: false, moderator: false },
                ].map((perm) => (
                  <div key={perm.name} className="grid grid-cols-4 gap-4 items-center text-sm">
                    <div>{perm.name}</div>
                    <div className="text-center">
                      {perm.superAdmin ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}
                    </div>
                    <div className="text-center">
                      {perm.admin ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}
                    </div>
                    <div className="text-center">
                      {perm.moderator ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication */}
        <TabsContent value="authentication">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Authentication Settings
                </CardTitle>
                <CardDescription>Configure login and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication (2FA)</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                  </div>
                  <Input type="number" defaultValue="30" className="w-24" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Max Login Attempts</Label>
                    <p className="text-sm text-muted-foreground">Lock account after failed attempts</p>
                  </div>
                  <Input type="number" defaultValue="5" className="w-24" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Password Policy</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label>Minimum Password Length</Label>
                    <Input type="number" defaultValue="8" className="w-24" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Special Characters</Label>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Numbers</Label>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Expiry (days)</Label>
                    </div>
                    <Input type="number" defaultValue="90" className="w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IP Allowlist</CardTitle>
                <CardDescription>Restrict admin access to specific IPs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable IP Allowlist</Label>
                    <p className="text-sm text-muted-foreground">Only allow admin access from specific IPs</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Allowed IPs</Label>
                  <Input placeholder="192.168.1.0/24, 10.0.0.1" />
                  <p className="text-xs text-muted-foreground">Comma-separated list of IPs or CIDR ranges</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage API access keys</CardDescription>
              </div>
              <Button onClick={() => toast.success("New API key generated")}>
                <Plus className="h-4 w-4 mr-2" />
                Generate New Key
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell className="font-mono text-sm">{key.key}</TableCell>
                      <TableCell className="text-muted-foreground">{key.created}</TableCell>
                      <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={key.status === "active" ? "default" : "secondary"}
                               className={key.status === "active" ? "bg-green-500" : ""}>
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => toast.success("Key regenerated")}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => toast.success("Key deleted")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Logs
              </CardTitle>
              <CardDescription>Recent security-related events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.user}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell className="text-muted-foreground">{log.time}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "success" ? "default" : "destructive"}
                               className={log.status === "success" ? "bg-green-500" : ""}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
