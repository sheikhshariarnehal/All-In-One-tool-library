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
  UserPlus,
  Mail,
  Ban,
  Trash2,
  Edit,
  Eye,
  Download,
  Filter,
  Users,
  UserCheck,
  UserX,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", plan: "Pro", status: "active", role: "user", createdAt: "2024-01-15", lastLogin: "2024-12-12", toolUsage: 156 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", plan: "Free", status: "active", role: "user", createdAt: "2024-02-20", lastLogin: "2024-12-11", toolUsage: 45 },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", plan: "Enterprise", status: "active", role: "admin", createdAt: "2024-03-10", lastLogin: "2024-12-12", toolUsage: 892 },
  { id: "4", name: "Alice Brown", email: "alice@example.com", plan: "Pro", status: "suspended", role: "user", createdAt: "2024-04-05", lastLogin: "2024-11-30", toolUsage: 234 },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com", plan: "Free", status: "active", role: "user", createdAt: "2024-05-12", lastLogin: "2024-12-10", toolUsage: 12 },
  { id: "6", name: "Diana Evans", email: "diana@example.com", plan: "Pro", status: "active", role: "user", createdAt: "2024-06-18", lastLogin: "2024-12-09", toolUsage: 567 },
  { id: "7", name: "Edward Foster", email: "edward@example.com", plan: "Free", status: "inactive", role: "user", createdAt: "2024-07-22", lastLogin: "2024-10-15", toolUsage: 8 },
  { id: "8", name: "Fiona Green", email: "fiona@example.com", plan: "Enterprise", status: "active", role: "user", createdAt: "2024-08-30", lastLogin: "2024-12-12", toolUsage: 1243 },
];

type User = typeof mockUsers[0];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "all" || user.plan.toLowerCase() === filterPlan;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    suspended: users.filter(u => u.status === "suspended").length,
    pro: users.filter(u => u.plan === "Pro" || u.plan === "Enterprise").length,
  };

  const handleSuspendUser = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u
    ));
    toast.success(user.status === "suspended" ? "User activated" : "User suspended");
  };

  const handleDeleteUser = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast.success("User deleted successfully");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setIsEditDialogOpen(false);
    toast.success("User updated successfully");
  };

  const handleExportUsers = () => {
    const csv = [
      ["Name", "Email", "Plan", "Status", "Role", "Created At", "Last Login", "Tool Usage"].join(","),
      ...filteredUsers.map(u => [u.name, u.email, u.plan, u.status, u.role, u.createdAt, u.lastLogin, u.toolUsage].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    toast.success("Users exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your platform users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account manually</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Select defaultValue="free">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="user">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("User created successfully");
                  setIsAddDialogOpen(false);
                }}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspended}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pro/Enterprise</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pro}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tool Usage</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.plan === "Enterprise" ? "default" : user.plan === "Pro" ? "secondary" : "outline"}>
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : user.status === "suspended" ? "destructive" : "secondary"} 
                           className={user.status === "active" ? "bg-green-500" : ""}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.toolUsage}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
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
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsViewDialogOpen(true); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                          <Ban className="h-4 w-4 mr-2" />
                          {user.status === "suspended" ? "Activate" : "Suspend"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
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

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedUser.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <Badge>{selectedUser.plan}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedUser.status === "active" ? "default" : "destructive"}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{selectedUser.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tool Usage</p>
                  <p className="font-medium">{selectedUser.toolUsage} uses</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{selectedUser.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">{selectedUser.lastLogin}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" defaultValue={selectedUser.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plan</Label>
                <Select defaultValue={selectedUser.plan.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedUser && handleUpdateUser(selectedUser)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
