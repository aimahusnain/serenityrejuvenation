import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      description: `From ${completedBookings} completed appointments`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10 dark:bg-green-500/20",
      trend: `+${revenueGrowth}%`,
      trendUp: true,
    },
    {
      title: "Total Clients",
      value: totalUsers.toString(),
      description: "Registered users",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      trend: `+${userGrowth}%`,
      trendUp: true,
    },
    {
      title: "Total Bookings",
      value: totalBookings.toString(),
      description: `${pendingBookings} pending, ${confirmedBookings} confirmed`,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      trend: `+${bookingGrowth}%`,
      trendUp: true,
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: `${completedBookings} of ${totalBookings} completed`,
      icon: Sparkles,
      color: completionRate >= 80 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400",
      bgColor: completionRate >= 80 ? "bg-green-500/10 dark:bg-green-500/20" : "bg-yellow-500/10 dark:bg-yellow-500/20",
      trend: completionRate >= 80 ? "Excellent" : "Good",
      trendUp: completionRate >= 80,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
        return (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-md bg-white dark:bg-[#271024]/50 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardDescription>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`border-${stat.trendUp ? 'green' : 'yellow'}-500/20 ${stat.trendUp ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}`}
                >
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {stat.trend}
                </Badge>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
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
