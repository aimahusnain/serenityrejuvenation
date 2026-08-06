"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus, MoreVertical, Edit, Trash2, UserCog, Star, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  rating: number;
  isActive: boolean;
  clientsServed: number;
  revenueGenerated: number;
}

interface StaffManagementSectionProps {
  initialStaff?: StaffMember[];
}

export function StaffManagementSection({ initialStaff = [] }: StaffManagementSectionProps) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    rating: 0,
  });

  // Fetch staff on mount
  useEffect(() => {
    if (initialStaff.length === 0) {
      fetch("/api/admin/staff")
        .then((res) => res.json())
        .then((data) => {
          if (data.staff) {
            setStaff(data.staff);
          }
        })
        .catch((error) => console.error("Error fetching staff:", error));
    }
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      rating: 0,
    });
    setEditingStaff(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email || "",
      phone: member.phone || "",
      rating: member.rating,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const url = "/api/admin/staff";
        const method = editingStaff ? "PATCH" : "POST";

        const body = editingStaff
          ? { ...formData, id: editingStaff.id }
          : formData;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          if (editingStaff) {
            setStaff((prev) =>
              prev.map((s) => (s.id === editingStaff.id ? data.staff : s))
            );
          } else {
            setStaff((prev) => [...prev, data.staff]);
          }
          setIsDialogOpen(false);
          resetForm();
        } else {
          const error = await res.json().catch(() => ({ error: "Operation failed" }));
          alert(error.error || "Operation failed");
        }
      } catch (error) {
        console.error("Staff operation error:", error);
        alert("Network error. Please try again.");
      }
    });
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/staff", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: staffToDelete.id }),
        });

        if (res.ok) {
          setStaff((prev) => prev.filter((s) => s.id !== staffToDelete.id));
          setDeleteDialogOpen(false);
          setStaffToDelete(null);
        } else {
          const error = await res.json().catch(() => ({ error: "Delete failed" }));
          alert(error.error || "Delete failed");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Network error. Please try again.");
      }
    });
  };

  const confirmDelete = (member: StaffMember) => {
    setStaffToDelete(member);
    setDeleteDialogOpen(true);
  };

  const toggleActive = async (member: StaffMember) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/staff", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: member.id, isActive: !member.isActive }),
        });

        if (res.ok) {
          setStaff((prev) =>
            prev.map((s) =>
              s.id === member.id ? { ...s, isActive: !member.isActive } : s
            )
          );
        }
      } catch (error) {
        console.error("Toggle active error:", error);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe]">
            Staff & Technicians
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your team and track performance
          </p>
        </div>
        <Button onClick={openCreateDialog} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Staff
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <UserCog className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No staff members found. Add your first team member.</p>
            </CardContent>
          </Card>
        ) : (
          staff.map((member) => (
            <Card
              key={member.id}
              className={cn(
                "border-border/60 hover:shadow-md transition-shadow",
                !member.isActive && "opacity-60"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserCog className="size-4 text-primary" />
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{member.role}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(member)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(member)}>
                        {member.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => confirmDelete(member)}
                        className="text-red-600 focus:text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    Rating
                  </span>
                  <span className="font-medium">{member.rating.toFixed(1)} ★</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Clients
                  </span>
                  <span className="font-medium">{member.clientsServed}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Revenue
                  </span>
                  <span className="font-medium">${member.revenueGenerated.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        member.isActive
                          ? "bg-green-500/15 text-green-700 dark:text-green-400"
                          : "bg-gray-500/15 text-gray-700 dark:text-gray-400"
                      )}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
            <DialogDescription>
              {editingStaff
                ? "Update the staff member details below."
                : "Fill in the details to add a new team member."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dr. Jane Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role/Title *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Lead Aesthetician"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., jane@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Initial Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : editingStaff ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{staffToDelete?.name}&quot; from the team?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
