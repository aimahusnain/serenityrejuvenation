import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Sparkles } from "lucide-react";

interface Props {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalRevenue?: number;
}

export function AdminStatCards({
  totalUsers,
  totalBookings,
  pendingBookings,
  confirmedBookings,
  completedBookings,
  totalRevenue = 0,
}: Props) {
  // Calculate growth rates (mock data for demo)
  const userGrowth = 12.5;
  const bookingGrowth = 8.2;
  const revenueGrowth = 15.8;

  // Calculate completion rate
  const completionRate =
    totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            ${totalRevenue.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-green-500/20 text-green-700 dark:border-green-500/30 dark:text-green-400"
            >
              <TrendingUp className="size-3" />
              +{revenueGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#07264f] dark:text-[#e3ae72]">
            Revenue this month <TrendingUp className="size-4 text-green-600" />
          </div>
          <div className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            From {completedBookings} completed appointments
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Clients</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            {totalUsers}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-green-500/20 text-green-700 dark:border-green-500/30 dark:text-green-400"
            >
              <TrendingUp className="size-3" />
              +{userGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#07264f] dark:text-[#e3ae72]">
            Active clients <Users className="size-4" />
          </div>
          <div className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            Registered users
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Bookings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            {totalBookings}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-green-500/20 text-green-700 dark:border-green-500/30 dark:text-green-400"
            >
              <TrendingUp className="size-3" />
              +{bookingGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#07264f] dark:text-[#e3ae72]">
            All appointments <Calendar className="size-4" />
          </div>
          <div className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            {pendingBookings} pending, {confirmedBookings} confirmed
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completion Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-[#07264f] dark:text-[#e3ae72]">
            {completionRate}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                completionRate >= 80
                  ? "border-green-500/20 text-green-700 dark:border-green-500/30 dark:text-green-400"
                  : "border-yellow-500/20 text-yellow-700 dark:border-yellow-500/30 dark:text-yellow-400"
              }
            >
              {completionRate >= 80 ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {completionRate >= 80 ? "Excellent" : "Good"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-[#07264f] dark:text-[#e3ae72]">
            Service quality <Sparkles className="size-4" />
          </div>
          <div className="text-[#07264f]/60 dark:text-[#e3ae72]/60">
            {completedBookings} of {totalBookings} completed
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
