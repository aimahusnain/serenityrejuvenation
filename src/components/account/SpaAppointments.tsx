"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Sparkles } from "lucide-react";

interface Booking {
  id: string;
  date: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
}

interface Props {
  bookings: Booking[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400 border-green-500/20";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400 border-yellow-500/20";
    case "CANCELLED":
      return "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400 border-red-500/20";
    case "COMPLETED":
      return "bg-[#7a219f]/10 text-[#7a219f] dark:bg-[#efcafe]/20 dark:text-[#efcafe] border-[#7a219f]/20 dark:border-[#efcafe]/30";
    default:
      return "";
  }
};

export function SpaAppointments({ bookings }: Props) {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingBookings = bookings.filter(
    (b) => b.status === "PENDING" || b.status === "CONFIRMED"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "CANCELLED"
  );

  const displayBookings = selectedTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
              Appointments
            </CardTitle>
            <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
              Your spa treatment history
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab("upcoming")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedTab === "upcoming"
                  ? "bg-[#7a219f] text-white dark:bg-[#efcafe] dark:text-[#7a219f]"
                  : "text-[#7a219f]/60 hover:text-[#7a219f] dark:text-[#efcafe]/60 dark:hover:text-[#efcafe]"
              }`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setSelectedTab("past")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedTab === "past"
                  ? "bg-[#7a219f] text-white dark:bg-[#efcafe] dark:text-[#7a219f]"
                  : "text-[#7a219f]/60 hover:text-[#7a219f] dark:text-[#efcafe]/60 dark:hover:text-[#efcafe]"
              }`}
            >
              Past ({pastBookings.length})
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-[#7a219f]/30 dark:text-[#efcafe]/30 mb-4" />
            <h3 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe] mb-2">
              No {selectedTab} appointments
            </h3>
            <p className="text-sm text-[#7a219f]/60 dark:text-[#efcafe]/65">
              {selectedTab === "upcoming"
                ? "Schedule your next treatment to see it here"
                : "Your completed appointments will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-[#7a219f]/10 dark:border-[#efcafe]/15 bg-[#7a219f]/5 dark:bg-[#efcafe]/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#7a219f]/10 dark:bg-[#efcafe]/20">
                  <Calendar className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]/90">
                      Spa Treatment
                    </span>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#7a219f]/60 dark:text-[#efcafe]/60">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(booking.date).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-[#7a219f]/50 dark:text-[#efcafe]/50 mt-1 italic">
                      Note: {booking.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
