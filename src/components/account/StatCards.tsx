import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Heart, TrendingUp, Clock, Sparkles } from "lucide-react";
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

  const stats = [
    {
      title: "Total Visits",
      value: totalBookings.toString(),
      description: `Member since ${memberSince}`,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "Upcoming",
      value: upcomingBookings.toString(),
      description: "Scheduled appointments",
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",
    },
    {
      title: "Completed",
      value: completedBookings.toString(),
      description: totalBookings > 0 ? `${Math.round((completedBookings / totalBookings) * 100)}% completion rate` : "Start your journey",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10 dark:bg-green-500/20",
    },
    {
      title: "Last Visit",
      value: lastVisit,
      description: recentBooking
        ? `Status: ${recentBooking.status.toLowerCase()}`
        : "Book your first treatment",
      icon: Sparkles,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-md bg-white dark:bg-[#271024]/50 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardDescription>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-[#e3ae72]">
                {stat.value}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-[#e3ae72]/70 mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
