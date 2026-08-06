"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Shield, Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  _count: {
    bookings: number;
  };
}

interface Props {
  users: User[];
  onUpdate: (users: User[]) => void;
}

export default function UsersSection({ users, onUpdate }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        const updatedUsers = users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        );
        onUpdate(updatedUsers);
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id }),
      });

      if (response.ok) {
        const updatedUsers = users.filter((u) => u.id !== selectedUser.id);
        onUpdate(updatedUsers);
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <>
      <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
        <CardHeader>
          <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#7a219f]/5 dark:bg-[#efcafe]/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7a219f]/10 dark:divide-[#efcafe]/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/5">
                    <td className="px-4 py-3 text-sm text-[#7a219f] dark:text-[#efcafe]/90">
                      {user.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7a219f] dark:text-[#efcafe]/90">
                      {user.email || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-[#efcafe] text-[#7a219f]"
                            : "bg-[#7a219f]/10 text-[#7a219f] dark:bg-[#efcafe]/20 dark:text-[#efcafe]"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7a219f] dark:text-[#efcafe]/90">
                      {user._count.bookings}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7a219f] dark:text-[#efcafe]/90">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#7a219f] dark:text-[#efcafe]"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white dark:bg-[#7a219f]"
                        >
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(
                              user.id,
                              user.role === "ADMIN" ? "USER" : "ADMIN"
                            )}
                            className="cursor-pointer text-[#7a219f] dark:text-[#efcafe]/80"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make {user.role === "ADMIN" ? "User" : "Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                            className="cursor-pointer text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-[#7a219f]/60 dark:text-[#efcafe]/60"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white dark:bg-[#7a219f]">
          <DialogHeader>
            <DialogTitle className="text-[#7a219f] dark:text-[#efcafe]">
              Delete User Account
            </DialogTitle>
            <DialogDescription className="text-[#7a219f]/70 dark:text-[#efcafe]/70">
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.name || selectedUser?.email}</strong>
              ? This action cannot be undone. All associated data including bookings
              will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe]"
              asChild
            >
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
