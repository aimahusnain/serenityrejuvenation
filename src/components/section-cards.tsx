"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarIcon, ClockIcon, DollarSignIcon, SparklesIcon } from "lucide-react"

export type SectionCardsStats = {
  upcomingAppointments: number
  totalTreatments: number
  lifetimeSpending: number
  nextAppointmentCountdown: string
  nextAppointmentDetail?: string
}

const defaultStats: SectionCardsStats = {
  upcomingAppointments: 0,
  totalTreatments: 0,
  lifetimeSpending: 0,
  nextAppointmentCountdown: "—",
  nextAppointmentDetail: "Book your first visit",
}

export function SectionCards({ stats = defaultStats }: { stats?: SectionCardsStats }) {
  const cards = [
    {
      description: "Upcoming Appointments",
      value: String(stats.upcomingAppointments),
      badge: stats.upcomingAppointments > 0 ? "Scheduled" : "None booked",
      footerTitle: stats.upcomingAppointments > 0 ? "Visits on your calendar" : "Schedule your next treatment",
      footerDetail: "Pending & confirmed visits",
      icon: CalendarIcon,
    },
    {
      description: "Total Treatments Taken",
      value: String(stats.totalTreatments),
      badge: stats.totalTreatments > 0 ? "Completed" : "Get started",
      footerTitle:
        stats.totalTreatments > 0
          ? "Your wellness journey"
          : "Your first treatment awaits",
      footerDetail: "Completed sessions",
      icon: SparklesIcon,
    },
    {
      description: "Lifetime Spending",
      value: `$${stats.lifetimeSpending.toLocaleString()}`,
      badge: "All time",
      footerTitle: "Investment in you",
      footerDetail: "From completed visits",
      icon: DollarSignIcon,
    },
    {
      description: "Next Appointment Countdown",
      value: stats.nextAppointmentCountdown,
      badge: stats.nextAppointmentCountdown !== "—" ? "Coming up" : "Open slot",
      footerTitle: stats.nextAppointmentDetail ?? "No visit scheduled",
      footerDetail: "Until your next session",
      icon: ClockIcon,
    },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.description} className="@container/card">
            <CardHeader>
              <CardDescription>{card.description}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">{card.badge}</Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerTitle}
                <Icon className="size-4 shrink-0 text-primary" />
              </div>
              <div className="text-muted-foreground">{card.footerDetail}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
