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
    },
    {
      description: "Total Treatments",
      value: String(stats.totalTreatments),
      badge: stats.totalTreatments > 0 ? "All bookings" : "Get started",
      footerTitle:
        stats.totalTreatments > 0
          ? "Your wellness journey"
          : "Your first treatment awaits",
      footerDetail: "Completed & scheduled sessions",
    },
    {
      description: "Total Investment",
      value: `$${stats.lifetimeSpending.toLocaleString()}`,
      badge: "All time",
      footerTitle: "Investment in you",
      footerDetail: "From completed & scheduled visits",
    },
    {
      description: "Next Appointment",
      value: stats.nextAppointmentCountdown,
      badge: stats.nextAppointmentCountdown !== "—" ? "Coming up" : "Open slot",
      footerTitle: stats.nextAppointmentDetail ?? "No visit scheduled",
      footerDetail: "Until your next session",
    },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.description} className="@container/card hover:shadow-md transition-shadow duration-200 border-border/60">
          <CardHeader className="space-y-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wide">
              {card.description}
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums text-[#271024] dark:text-[#e3ae72]">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-0.5 border-[#271024]/20 dark:border-[#e3ae72]/30"
              >
                {card.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm border-t border-border/40 pt-4">
            <div className="font-medium text-[#271024] dark:text-[#e3ae72]">
              {card.footerTitle}
            </div>
            <div className="text-xs text-muted-foreground">{card.footerDetail}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
