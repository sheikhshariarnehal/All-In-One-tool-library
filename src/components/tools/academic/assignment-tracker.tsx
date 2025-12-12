"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Download,
  Upload,
  FileText
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "in-progress" | "submitted" | "graded";
  priority: "low" | "medium" | "high";
  grade?: string;
  notes?: string;
}

export default function AssignmentTracker() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Research Paper Draft",
      course: "English 101",
      dueDate: "2024-12-15",
      status: "in-progress",
      priority: "high",
      notes: "Focus on thesis statement",
    },
    {
      id: "2",
      title: "Math Problem Set 5",
      course: "Calculus II",
      dueDate: "2024-12-12",
      status: "pending",
      priority: "medium",
    },
    {
      id: "3",
      title: "Lab Report - Experiment 3",
      course: "Chemistry 201",
      dueDate: "2024-12-10",
      status: "submitted",
      priority: "high",
    },
    {
      id: "4",
      title: "History Essay",
      course: "World History",
      dueDate: "2024-12-08",
      status: "graded",
      priority: "low",
      grade: "A-",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");

  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: "",
    course: "",
    dueDate: "",
    status: "pending",
    priority: "medium",
    notes: "",
  });

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.course || !newAssignment.dueDate) return;

    const assignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newAssignment.title,
      course: newAssignment.course,
      dueDate: newAssignment.dueDate,
      status: newAssignment.status as Assignment["status"],
      priority: newAssignment.priority as Assignment["priority"],
      notes: newAssignment.notes,
    };

    setAssignments((prev) => [...prev, assignment]);
    setNewAssignment({
      title: "",
      course: "",
      dueDate: "",
      status: "pending",
      priority: "medium",
      notes: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleUpdateAssignment = () => {
    if (!editingAssignment) return;
    
    setAssignments((prev) =>
      prev.map((a) => (a.id === editingAssignment.id ? editingAssignment : a))
    );
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleStatusChange = (id: string, status: Assignment["status"]) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const getStatusBadge = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500"><Edit className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "submitted":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Submitted</Badge>;
      case "graded":
        return <Badge className="bg-purple-500"><FileText className="h-3 w-3 mr-1" />Graded</Badge>;
    }
  };

  const getPriorityBadge = (priority: Assignment["priority"]) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="text-red-600 border-red-600">High</Badge>;
    }
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDueDateDisplay = (dueDate: string, status: Assignment["status"]) => {
    if (status === "submitted" || status === "graded") {
      return new Date(dueDate).toLocaleDateString();
    }
    
    const days = getDaysUntilDue(dueDate);
    if (days < 0) {
      return <span className="text-red-500 font-medium">Overdue by {Math.abs(days)} days</span>;
    } else if (days === 0) {
      return <span className="text-orange-500 font-medium">Due today!</span>;
    } else if (days <= 3) {
      return <span className="text-yellow-600">{days} days left</span>;
    }
    return `${days} days left`;
  };

  const filteredAssignments = assignments
    .filter((a) => filterStatus === "all" || a.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    inProgress: assignments.filter((a) => a.status === "in-progress").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
    overdue: assignments.filter(
      (a) => getDaysUntilDue(a.dueDate) < 0 && a.status !== "submitted" && a.status !== "graded"
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.submitted}</div>
            <div className="text-xs text-muted-foreground">Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.graded}</div>
            <div className="text-xs text-muted-foreground">Graded</div>
          </CardContent>
        </Card>
        {stats.overdue > 0 && (
          <Card className="border-red-500">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-xs text-red-600">Overdue!</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="filter">Filter:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filter" className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="sort">Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Assignment</DialogTitle>
              <DialogDescription>
                Track a new assignment or task.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Assignment title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={newAssignment.course}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({ ...prev, course: e.target.value }))
                  }
                  placeholder="Course name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newAssignment.priority}
                    onValueChange={(v) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        priority: v as Assignment["priority"],
                      }))
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newAssignment.notes}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAssignment}>Add Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredAssignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        {assignment.notes && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {assignment.notes}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.course}</TableCell>
                    <TableCell>{getDueDateDisplay(assignment.dueDate, assignment.status)}</TableCell>
                    <TableCell>{getPriorityBadge(assignment.priority)}</TableCell>
                    <TableCell>
                      <Select
                        value={assignment.status}
                        onValueChange={(v) =>
                          handleStatusChange(assignment.id, v as Assignment["status"])
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          {getStatusBadge(assignment.status)}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="graded">Graded</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {assignment.grade ? (
                        <Badge className="bg-purple-100 text-purple-800">
                          {assignment.grade}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingAssignment(assignment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assignments found. Add one to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import from CSV
        </Button>
      </div>
    </div>
  );
}
