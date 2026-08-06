"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Check, X, Clock, Calendar } from "lucide-react";

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface Props {
  bookings: Booking[];
  onUpdate: (bookings: Booking[]) => void;
}

const statusColors = {
  CONFIRMED: "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400",
  PENDING: "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400",
  CANCELLED: "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400",
  COMPLETED: "bg-[#7a219f]/10 text-[#7a219f] dark:bg-[#efcafe]/20 dark:text-[#efcafe]",
};

const statusIcons = {
  CONFIRMED: Check,
  PENDING: Clock,
  CANCELLED: X,
  COMPLETED: Check,
};

export default function BookingsSection({ bookings, onUpdate }: Props) {
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (response.ok) {
        const updatedBookings = bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus as Booking["status"] } : b
        );
        onUpdate(updatedBookings);
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    return allStatuses.filter((s) => s !== currentStatus);
  };

  return (
    <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
      <CardHeader>
        <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
          All Bookings ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#7a219f]/5 dark:bg-[#efcafe]/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Service ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#7a219f] dark:text-[#efcafe] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7a219f]/10 dark:divide-[#efcafe]/10">
              {bookings.map((booking) => {
                const StatusIcon = statusIcons[booking.status];
                return (
                  <tr key={booking.id} className="hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/5">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]/90">
                          {booking.user.name || "—"}
                        </p>
                        <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                          {booking.user.email || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7a219f] dark:text-[#efcafe]/90">
                      {booking.serviceId}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7a219f] dark:text-[#efcafe]/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-[#7a219f]/50 dark:text-[#efcafe]/50" />
                        {new Date(booking.date).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {booking.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#7a219f]/60 dark:text-[#efcafe]/60">
                      {booking.notes || "—"}
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
                          <div className="px-2 py-1.5 text-xs font-semibold text-[#7a219f]/60 dark:text-[#efcafe]/60">
                            Change Status
                          </div>
                          {getStatusOptions(booking.status).map((status) => {
                            const Icon = statusIcons[status as keyof typeof statusIcons];
                            return (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => handleStatusChange(booking.id, status)}
                                className="cursor-pointer text-[#7a219f] dark:text-[#efcafe]/80"
                              >
                                <Icon className="h-4 w-4 mr-2" />
                                Mark as {status.toLowerCase()}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-[#7a219f]/60 dark:text-[#efcafe]/60"
                  >
                    No bookings found
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
