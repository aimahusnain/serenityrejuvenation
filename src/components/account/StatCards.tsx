import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Heart, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  date: Date;
  status: string;
}

interface User {
  createdAt: Date;
}

interface Props {
  bookings: Booking[];
  user: User;
}

export function StatCards({ bookings, user }: Props) {
  // Calculate stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING"
  ).length;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Find most recent booking
  const recentBooking = bookings[0];
  const lastVisit = recentBooking
    ? new Date(recentBooking.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "No visits yet";

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Visits</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            {totalBookings}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            Member since {memberSince}
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            {upcomingBookings}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            Scheduled appointments
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            {completedBookings}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            {totalBookings > 0 ? `${Math.round((completedBookings / totalBookings) * 100)}% completion rate` : "Start your journey"}
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Last Visit</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            {lastVisit}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            {recentBooking
              ? `Status: ${recentBooking.status.toLowerCase()}`
              : "Book your first treatment"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
