"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Eye,
  Wrench,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
} from "lucide-react";

// Mock analytics data
const overviewStats = [
  { name: "Page Views", value: "124,589", change: "+12.3%", trend: "up", icon: Eye },
  { name: "Unique Visitors", value: "45,234", change: "+8.7%", trend: "up", icon: Users },
  { name: "Tool Usage", value: "89,456", change: "+23.1%", trend: "up", icon: Wrench },
  { name: "Avg. Session", value: "4m 32s", change: "-2.1%", trend: "down", icon: Clock },
];

const dailyViews = [
  { day: "Mon", views: 12500, users: 4200 },
  { day: "Tue", views: 14200, users: 4800 },
  { day: "Wed", views: 13800, users: 4600 },
  { day: "Thu", views: 15600, users: 5200 },
  { day: "Fri", views: 14900, users: 5000 },
  { day: "Sat", views: 11200, users: 3800 },
  { day: "Sun", views: 10800, users: 3600 },
];

const topTools = [
  { name: "JSON Formatter", views: 15234, growth: 12.5 },
  { name: "Image Compressor", views: 12456, growth: 8.3 },
  { name: "Word Counter", views: 9876, growth: -2.1 },
  { name: "QR Code Generator", views: 8765, growth: 15.7 },
  { name: "Citation Generator", views: 7654, growth: 5.2 },
  { name: "Base64 Encoder", views: 6543, growth: 3.8 },
  { name: "Hash Generator", views: 5432, growth: 7.1 },
  { name: "URL Encoder", views: 4321, growth: -1.5 },
];

const topPages = [
  { page: "/", views: 32456, bounceRate: 35.2 },
  { page: "/tools", views: 28765, bounceRate: 28.5 },
  { page: "/tools/developer/json-formatter", views: 15234, bounceRate: 12.3 },
  { page: "/pricing", views: 12456, bounceRate: 45.6 },
  { page: "/tools/ai-image/image-compressor", views: 9876, bounceRate: 15.8 },
];

const deviceStats = [
  { device: "Desktop", percentage: 58, icon: Monitor },
  { device: "Mobile", percentage: 35, icon: Smartphone },
  { device: "Tablet", percentage: 7, icon: Monitor },
];

const topCountries = [
  { country: "United States", visitors: 18234, flag: "🇺🇸" },
  { country: "United Kingdom", visitors: 8765, flag: "🇬🇧" },
  { country: "Germany", visitors: 6543, flag: "🇩🇪" },
  { country: "Canada", visitors: 5432, flag: "🇨🇦" },
  { country: "Australia", visitors: 4321, flag: "🇦🇺" },
  { country: "France", visitors: 3210, flag: "🇫🇷" },
];

const trafficSources = [
  { source: "Organic Search", visitors: 25678, percentage: 45 },
  { source: "Direct", visitors: 15432, percentage: 27 },
  { source: "Social", visitors: 8765, percentage: 15 },
  { source: "Referral", visitors: 5678, percentage: 10 },
  { source: "Email", visitors: 1234, percentage: 3 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const maxViews = Math.max(...dailyViews.map(d => d.views));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traffic Chart (Simple Bar Visualization) */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Daily page views and visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyViews.map((day) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-muted-foreground">{day.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex gap-1 h-8">
                    <div 
                      className="bg-primary rounded-sm transition-all"
                      style={{ width: `${(day.views / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary" />
                <span className="text-sm text-muted-foreground">Page Views</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Top Tools</CardTitle>
            <CardDescription>Most used tools this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTools.map((tool, index) => (
                <div key={tool.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-5">
                      {index + 1}
                    </span>
                    <span className="font-medium">{tool.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {tool.views.toLocaleString()}
                    </span>
                    <Badge variant={tool.growth > 0 ? "default" : "secondary"} 
                           className={`w-16 justify-center ${tool.growth > 0 ? "bg-green-500" : ""}`}>
                      {tool.growth > 0 ? "+" : ""}{tool.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* More Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Pages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm truncate">{page.page}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                    <div className="text-right w-16">
                      <p className="font-medium">{page.bounceRate}%</p>
                      <p className="text-xs text-muted-foreground">bounce</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {deviceStats.map((device) => (
                <div key={device.device} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <device.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <span className="font-bold">{device.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geography and Sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Top Countries</CardTitle>
            </div>
            <CardDescription>Visitors by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {country.visitors.toLocaleString()}
                    </span>
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(country.visitors / topCountries[0].visitors) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle>Traffic Sources</CardTitle>
            </div>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{source.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {source.visitors.toLocaleString()}
                      </span>
                      <Badge variant="outline">{source.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Real-time Activity
              </CardTitle>
              <CardDescription>Live user activity on your platform</CardDescription>
            </div>
            <Badge variant="outline" className="text-green-500 border-green-500">
              23 users online
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">23</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Page Views (1h)</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">89</p>
              <p className="text-sm text-muted-foreground">Tool Uses (1h)</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">New Signups (1h)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
