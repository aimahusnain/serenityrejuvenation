"use client"

import { useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Stethoscope } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Appointment = {
  id: string
  date: Date | string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  serviceName: string
}

export function UpcomingAppointmentsWidget({
  appointments,
  technician = "Licensed Aesthetician",
  location = "Serenity Rejuvenation Med Spa",
}: {
  appointments: Appointment[]
  technician?: string
  location?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const upcoming = useMemo(() => {
    const now = Date.now()
    return appointments
      .filter(
        (a) =>
          (a.status === "PENDING" || a.status === "CONFIRMED") &&
          new Date(a.date).getTime() >= now
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
  }, [appointments])

  const cancel = (bookingId: string) => {
    startTransition(async () => {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "CANCELLED" }),
      })
      router.refresh()
    })
  }

  const statusClass = (status: Appointment["status"]) => {
    const map: Record<Appointment["status"], string> = {
      CONFIRMED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-400",
      COMPLETED: "bg-primary/15 text-primary",
    }
    return map[status]
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Upcoming Appointments</CardTitle>
        <CardDescription>Your next visits, with quick actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No upcoming appointments yet.
          </div>
        ) : (
          upcoming.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#271024] dark:text-[#e3ae72]">{a.serviceName}</p>
                  <Badge className={cn("border-0", statusClass(a.status))}>{a.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {new Date(a.date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                  <span className="mx-1">•</span>
                  <Clock className="size-3.5" />
                  {new Date(a.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Stethoscope className="size-3.5" />
                  Technician: {technician}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {location}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => cancel(a.id)}
                >
                  {isPending ? "Working…" : "Cancel"}
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <a href="/contact">Reschedule</a>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

