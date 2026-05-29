"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface Booking {
  id: string;
  date: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
  serviceId: string;
}

interface Props {
  bookings: Booking[];
}

export default function BookingsSection({ bookings }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400";
      case "CANCELLED":
        return "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400";
      case "COMPLETED":
        return "bg-[#07264f]/10 text-[#07264f] dark:bg-[#e3ae72]/20 dark:text-[#e3ae72]";
      default:
        return "bg-gray-500/20 text-gray-700";
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (bookings.length === 0) {
    return (
      <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
        <CardHeader>
          <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">My Bookings</CardTitle>
          <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
            Your appointment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-[#07264f]/30 dark:text-[#e3ae72]/30 mb-4" />
            <h3 className="text-lg font-semibold text-[#07264f] dark:text-[#e3ae72] mb-2">
              No bookings yet
            </h3>
            <p className="text-sm text-[#07264f]/60 dark:text-[#e3ae72]/65 max-w-xs">
              You haven&apos;t made any appointments yet. Visit our services page to book your first treatment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
      <CardHeader>
        <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">My Bookings</CardTitle>
        <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
          Your appointment history ({bookings.length} bookings)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-[#07264f]/10 dark:border-[#e3ae72]/15 bg-[#07264f]/5 dark:bg-[#e3ae72]/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/10 dark:bg-[#e3ae72]/20">
                <Calendar className="h-6 w-6 text-[#07264f] dark:text-[#e3ae72]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#07264f] dark:text-[#e3ae72]/90 truncate">
                  Service ID: {booking.serviceId}
                </p>
                <p className="text-xs text-[#07264f]/60 dark:text-[#e3ae72]/60 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(booking.date)}
                </p>
                {booking.notes && (
                  <p className="text-xs text-[#07264f]/60 dark:text-[#e3ae72]/60 mt-1 italic">
                    Note: {booking.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
