"use client"

import Link from "next/link"
import { useMemo, useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Stethoscope } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return appointments
      .filter(
        (a) =>
          (a.status === "PENDING" || a.status === "CONFIRMED") &&
          new Date(a.date).getTime() >= today.getTime()
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
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">Upcoming Appointments</CardTitle>
        <CardDescription>Your next visits, with quick actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-[#7a219f]/5 dark:bg-[#efcafe]/10 mb-4">
              <Calendar className="h-8 w-8 text-[#7a219f] dark:text-[#efcafe]" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">No upcoming appointments yet.</p>
            <Link href="/user-dashboard/book">
              <button className="inline-flex items-center justify-center rounded-lg bg-[#7a219f] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#7a219f]/90 dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]">
                Book Your First Visit
              </button>
            </Link>
          </div>
        ) : (
          upcoming.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between hover:border-[#7a219f]/20 dark:hover:border-[#efcafe]/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#7a219f] dark:text-[#efcafe]">{a.serviceName}</p>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-[#7a219f] dark:text-[#efcafe]">Cancel Appointment?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel your {a.serviceName} appointment on{" "}
                        {new Date(a.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="border-[#7a219f]/20 dark:border-[#efcafe]/30">
                          Keep Appointment
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={() => cancel(a.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Cancel Appointment
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      Reschedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-[#7a219f] dark:text-[#efcafe]">Reschedule Appointment?</DialogTitle>
                      <DialogDescription>
                        Would you like to reschedule your {a.serviceName} appointment? You'll be able to select a new date and time that works better for you.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="border-[#7a219f]/20 dark:border-[#efcafe]/30">
                          Keep Current Time
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={() => window.location.href = "/contact"}
                          className="bg-[#7a219f] text-white hover:bg-[#7a219f]/90 dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
                        >
                          Continue to Reschedule
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

