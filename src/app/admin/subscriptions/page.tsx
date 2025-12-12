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
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// Mock subscriptions data
const mockSubscriptions = [
  { id: "sub_1", userId: "1", userName: "John Doe", userEmail: "john@example.com", plan: "Pro", status: "active", amount: 9, currency: "USD", interval: "month", startDate: "2024-01-15", renewDate: "2025-01-15", paymentMethod: "Visa •••• 4242" },
  { id: "sub_2", userId: "2", userName: "Bob Wilson", userEmail: "bob@example.com", plan: "Enterprise", status: "active", amount: 29, currency: "USD", interval: "month", startDate: "2024-03-10", renewDate: "2025-03-10", paymentMethod: "Mastercard •••• 5555" },
  { id: "sub_3", userId: "3", userName: "Alice Brown", userEmail: "alice@example.com", plan: "Pro", status: "canceled", amount: 9, currency: "USD", interval: "month", startDate: "2024-04-05", renewDate: "2024-11-05", paymentMethod: "Visa •••• 1234" },
  { id: "sub_4", userId: "4", userName: "Diana Evans", userEmail: "diana@example.com", plan: "Pro", status: "active", amount: 90, currency: "USD", interval: "year", startDate: "2024-06-18", renewDate: "2025-06-18", paymentMethod: "Visa •••• 9999" },
  { id: "sub_5", userId: "5", userName: "Fiona Green", userEmail: "fiona@example.com", plan: "Enterprise", status: "active", amount: 290, currency: "USD", interval: "year", startDate: "2024-08-30", renewDate: "2025-08-30", paymentMethod: "Amex •••• 3782" },
  { id: "sub_6", userId: "6", userName: "George Hill", userEmail: "george@example.com", plan: "Pro", status: "past_due", amount: 9, currency: "USD", interval: "month", startDate: "2024-09-15", renewDate: "2024-12-15", paymentMethod: "Visa •••• 8888" },
  { id: "sub_7", userId: "7", userName: "Helen Irving", userEmail: "helen@example.com", plan: "Pro", status: "trialing", amount: 9, currency: "USD", interval: "month", startDate: "2024-12-01", renewDate: "2024-12-14", paymentMethod: "Pending" },
];

type Subscription = typeof mockSubscriptions[0];

const mockTransactions = [
  { id: "tx_1", subscription: "sub_1", amount: 9, currency: "USD", status: "succeeded", date: "2024-12-01", description: "Pro Plan - Monthly" },
  { id: "tx_2", subscription: "sub_2", amount: 29, currency: "USD", status: "succeeded", date: "2024-12-01", description: "Enterprise Plan - Monthly" },
  { id: "tx_3", subscription: "sub_4", amount: 90, currency: "USD", status: "succeeded", date: "2024-06-18", description: "Pro Plan - Annual" },
  { id: "tx_4", subscription: "sub_6", amount: 9, currency: "USD", status: "failed", date: "2024-12-01", description: "Pro Plan - Monthly" },
  { id: "tx_5", subscription: "sub_5", amount: 290, currency: "USD", status: "succeeded", date: "2024-08-30", description: "Enterprise Plan - Annual" },
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("subscriptions");

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "all" || sub.plan.toLowerCase() === filterPlan.toLowerCase();
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const stats = {
    totalMRR: subscriptions
      .filter(s => s.status === "active")
      .reduce((sum, s) => sum + (s.interval === "month" ? s.amount : s.amount / 12), 0),
    activeSubscriptions: subscriptions.filter(s => s.status === "active").length,
    trialUsers: subscriptions.filter(s => s.status === "trialing").length,
    churnRate: 5.2, // Mock
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case "canceled":
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" /> Canceled</Badge>;
      case "past_due":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Past Due</Badge>;
      case "trialing":
        return <Badge variant="outline"><Calendar className="h-3 w-3 mr-1" /> Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCancelSubscription = (sub: Subscription) => {
    setSubscriptions(subscriptions.map(s => 
      s.id === sub.id ? { ...s, status: "canceled" } : s
    ));
    toast.success("Subscription canceled");
  };

  const handleRefundSubscription = (sub: Subscription) => {
    toast.success(`Refund initiated for ${sub.userName}`);
  };

  const handleExtendTrial = (sub: Subscription) => {
    toast.success(`Trial extended for ${sub.userName}`);
  };

  const handleExportSubscriptions = () => {
    const csv = [
      ["User", "Email", "Plan", "Status", "Amount", "Interval", "Start Date", "Renew Date"].join(","),
      ...filteredSubscriptions.map(s => 
        [s.userName, s.userEmail, s.plan, s.status, s.amount, s.interval, s.startDate, s.renewDate].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscriptions.csv";
    a.click();
    toast.success("Subscriptions exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage subscriptions and revenue</p>
        </div>
        <Button variant="outline" onClick={handleExportSubscriptions}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalMRR.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">MRR</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">paying customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trialUsers}</div>
            <p className="text-xs text-muted-foreground">in trial period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.churnRate}%</div>
            <p className="text-xs text-muted-foreground">monthly</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscriptions..."
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
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="past_due">Past Due</SelectItem>
                      <SelectItem value="trialing">Trialing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Renews</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sub.userName}</p>
                          <p className="text-sm text-muted-foreground">{sub.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={sub.plan === "Enterprise" ? "default" : "secondary"}>
                          {sub.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <span className="font-medium">${sub.amount}</span>
                        <span className="text-muted-foreground">/{sub.interval}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{sub.renewDate}</TableCell>
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
                            <DropdownMenuItem onClick={() => { setSelectedSubscription(sub); setIsViewDialogOpen(true); }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Email Customer
                            </DropdownMenuItem>
                            {sub.status === "trialing" && (
                              <DropdownMenuItem onClick={() => handleExtendTrial(sub)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Extend Trial
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {sub.status === "active" && (
                              <>
                                <DropdownMenuItem onClick={() => handleRefundSubscription(sub)}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Issue Refund
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onClick={() => handleCancelSubscription(sub)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Subscription
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Payment history and transaction logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell className="font-medium">${tx.amount}</TableCell>
                      <TableCell>
                        <Badge variant={tx.status === "succeeded" ? "default" : "destructive"} 
                               className={tx.status === "succeeded" ? "bg-green-500" : ""}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For individuals getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Basic tools access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    100 uses/month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    7-day history
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Current users: <strong>1,847</strong></p>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <Badge>Popular</Badge>
                </div>
                <CardDescription>For professionals and teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    All tools access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    1,000 uses/month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    30-day history
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Priority support
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Current subscribers: <strong>432</strong></p>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited uses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    1-year history
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Custom branding
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Current subscribers: <strong>89</strong></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Subscription Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedSubscription.userName}</h3>
                  <p className="text-muted-foreground">{selectedSubscription.userEmail}</p>
                </div>
                {getStatusBadge(selectedSubscription.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Subscription ID</p>
                  <p className="font-mono text-sm">{selectedSubscription.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <Badge>{selectedSubscription.plan}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">${selectedSubscription.amount}/{selectedSubscription.interval}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedSubscription.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{selectedSubscription.startDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Renewal Date</p>
                  <p className="font-medium">{selectedSubscription.renewDate}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Issue Refund
                  </Button>
                  {selectedSubscription.status === "active" && (
                    <Button variant="destructive" size="sm" onClick={() => { handleCancelSubscription(selectedSubscription); setIsViewDialogOpen(false); }}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
