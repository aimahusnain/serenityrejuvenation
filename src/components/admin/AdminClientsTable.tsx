"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Mail, Calendar, Crown, Star, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

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
}

const getClientStatus = (bookingCount: number) => {
  if (bookingCount >= 10) return { status: "VIP", color: "bg-[#efcafe] text-[#7a219f]" };
  if (bookingCount >= 5) return { status: "Regular", color: "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400" };
  if (bookingCount >= 2) return { status: "Active", color: "bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-400" };
  return { status: "New", color: "bg-gray-500/20 text-gray-700 dark:bg-gray-500/30 dark:text-gray-400" };
};

export function AdminClientsTable({ users }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "vip" | "regular" | "new">("all");

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const clientStatus = getClientStatus(user._count.bookings);
    if (statusFilter === "vip") return clientStatus.status === "VIP";
    if (statusFilter === "regular") return ["Regular", "VIP"].includes(clientStatus.status);
    if (statusFilter === "new") return clientStatus.status === "New";
    return true;
  });

  // Calculate client statistics
  const vipCount = users.filter((u) => getClientStatus(u._count.bookings).status === "VIP").length;
  const regularCount = users.filter((u) => ["Regular", "VIP"].includes(getClientStatus(u._count.bookings).status)).length;
  const newCount = users.filter((u) => getClientStatus(u._count.bookings).status === "New").length;
  const irregularCount = users.length - regularCount;

  return (
    <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
              Clients ({users.length})
            </CardTitle>
            <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
              Manage your client base
            </CardDescription>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Badge variant="outline" className="bg-[#efcafe]/10 border-[#efcafe]/20">
            <Crown className="h-3 w-3 mr-1" />
            VIP: {vipCount}
          </Badge>
          <Badge variant="outline" className="bg-[#efcafe]/10 border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe]">
            <Star className="h-3 w-3 mr-1" />
            Regular: {regularCount}
          </Badge>
          <Badge variant="outline" className="bg-[#7a219f]/10 border-[#7a219f]/30 text-[#7a219f] dark:text-[#efcafe]/80">
            New: {newCount}
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400">
            Irregular: {irregularCount}
          </Badge>
        </div>
        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "vip" ? "default" : "outline"}
              onClick={() => setStatusFilter("vip")}
            >
              VIP
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "regular" ? "default" : "outline"}
              onClick={() => setStatusFilter("regular")}
            >
              Regular
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "new" ? "default" : "outline"}
              onClick={() => setStatusFilter("new")}
            >
              New
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#7a219f]/5 dark:bg-[#efcafe]/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Visits
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Role
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
              {filteredUsers.map((user) => {
                const clientStatus = getClientStatus(user._count.bookings);
                return (
                  <tr key={user.id} className="hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/5">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]/90">
                          {user.name || "—"}
                        </p>
                        <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={clientStatus.color}>
                        {clientStatus.status === "VIP" && <Crown className="h-3 w-3 mr-1" />}
                        {clientStatus.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7a219f] dark:text-[#efcafe]/90">
                      {user._count.bookings}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          user.role === "ADMIN"
                            ? "bg-[#efcafe]/10 text-[#7a219f]"
                            : ""
                        }
                      >
                        {user.role === "ADMIN" && <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </Badge>
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
                          <DropdownMenuItem className="cursor-pointer text-[#7a219f] dark:text-[#efcafe]/80">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-[#7a219f] dark:text-[#efcafe]/80">
                            <Calendar className="h-4 w-4 mr-2" />
                            View Bookings
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-[#7a219f]/60 dark:text-[#efcafe]/60"
                  >
                    No clients found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
