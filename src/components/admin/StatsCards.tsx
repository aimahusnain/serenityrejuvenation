import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Users, Calendar, Clock, CheckCircle, Check } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
}

interface Props {
  stats: Stats;
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-[#271024] dark:text-[#e3ae72]",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-[#271024] dark:text-[#e3ae72]",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Completed",
      value: stats.completedBookings,
      icon: Check,
      color: "text-[#271024] dark:text-[#e3ae72]/80",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className="border-[#271024]/10 dark:border-[#e3ae72]/20 hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-[#271024]/60 dark:text-[#e3ae72]/65 text-sm">
                {card.title}
              </CardDescription>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
