"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  User,
  Video,
  Phone,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  List,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { BookingLite, ProductLite, BookingStatus } from "@/lib/dashboard";
import { enrichBookings } from "@/lib/dashboard";

interface MyAppointmentsProps {
  bookings: BookingLite[];
  products: ProductLite[];
}

type ViewMode = "list" | "calendar";
type StatusFilter = "all" | BookingStatus;
type TimeFilter = "all" | "upcoming" | "past" | "this_week" | "this_month";

const STATUS_COLORS: Record<BookingStatus, string> = {
  CONFIRMED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
  COMPLETED: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
};

const STATUS_ICONS: Record<BookingStatus, string> = {
  CONFIRMED: "✓",
  PENDING: "⏳",
  CANCELLED: "✕",
  COMPLETED: "✓",
};

export function MyAppointments({ bookings, products }: MyAppointmentsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<ReturnType<typeof enrichBookings>[0] | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const enriched = useMemo(() => enrichBookings(bookings, products), [bookings, products]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...enriched];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    // Time filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (timeFilter === "upcoming") {
      filtered = filtered.filter((b) => new Date(b.date) >= today && (b.status === "PENDING" || b.status === "CONFIRMED"));
    } else if (timeFilter === "past") {
      filtered = filtered.filter((b) => new Date(b.date) < today || b.status === "COMPLETED" || b.status === "CANCELLED");
    } else if (timeFilter === "this_week") {
      filtered = filtered.filter((b) => {
        const date = new Date(b.date);
        return date >= today && date <= weekEnd;
      });
    } else if (timeFilter === "this_month") {
      filtered = filtered.filter((b) => {
        const date = new Date(b.date);
        return date >= today && date <= monthEnd;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((b) =>
        b.serviceName.toLowerCase().includes(query) ||
        b.notes?.toLowerCase().includes(query) ||
        new Date(b.date).toLocaleDateString().toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [enriched, statusFilter, timeFilter, searchQuery]);

  const upcomingCount = enriched.filter((b) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(b.date) >= today && (b.status === "PENDING" || b.status === "CONFIRMED");
  }).length;

  const pastCount = enriched.length - upcomingCount;

  const handleCancel = async () => {
    if (!selectedAppointment) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: selectedAppointment.id, status: "CANCELLED" }),
        });

        if (res.ok) {
          setMessage({ type: "success", text: "Appointment cancelled successfully." });
          setCancelDialogOpen(false);
          setTimeout(() => router.refresh(), 1500);
        } else {
          setMessage({ type: "error", text: "Failed to cancel appointment. Please try again." });
        }
      } catch {
        setMessage({ type: "error", text: "Network error. Please try again." });
      }
    });
  };

  const openCancelDialog = (appointment: ReturnType<typeof enrichBookings>[0]) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#271024] dark:text-[#e3ae72] font-serif">
            My Appointments
          </h1>
          <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65 mt-1">
            Manage your scheduled and past appointments
          </p>
        </div>
        <Button
          className="bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
          onClick={() => router.push("/user-dashboard/book")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert
          variant={message.type === "success" ? "default" : "destructive"}
          className={cn(
            "relative overflow-hidden",
            message.type === "success" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          )}
        >
          <AlertDescription className="flex items-center justify-between">
            <span>{message.text}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setMessage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters Toolbar */}
      <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#271024]/40 dark:text-[#e3ae72]/40" />
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#271024]/20 dark:border-[#e3ae72]/30"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#271024]/5 dark:bg-[#e3ae72]/10">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8",
                    viewMode === "list" && "bg-[#271024] text-white dark:bg-[#e3ae72] dark:text-[#271024]"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className={cn(
                    "h-8",
                    viewMode === "calendar" && "bg-[#271024] text-white dark:bg-[#e3ae72] dark:text-[#271024]"
                  )}
                >
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
                <SelectTrigger className="w-[140px] border-[#271024]/20 dark:border-[#e3ae72]/30">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Time Filter */}
              <Select value={timeFilter} onValueChange={(v: TimeFilter) => setTimeFilter(v)}>
                <SelectTrigger className="w-[140px] border-[#271024]/20 dark:border-[#e3ae72]/30">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm bg-gradient-to-br from-[#271024]/5 to-[#e3ae72]/5 dark:from-[#e3ae72]/10 dark:to-[#271024]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#271024]/10 dark:bg-[#e3ae72]/20">
                <Calendar className="h-5 w-5 text-[#271024] dark:text-[#e3ae72]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">{upcomingCount}</p>
                <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
                  {enriched.filter((b) => b.status === "CONFIRMED").length}
                </p>
                <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">⏳</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
                  {enriched.filter((b) => b.status === "PENDING").length}
                </p>
                <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">{pastCount}</p>
                <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">Past Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Calendar View</CardTitle>
            <CardDescription>See your appointments at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarView bookings={filteredAppointments} />
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <>
          {filteredAppointments.length === 0 ? (
            <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="h-16 w-16 text-[#271024]/20 dark:text-[#e3ae72]/20 mb-4" />
                <h3 className="text-xl font-semibold text-[#271024] dark:text-[#e3ae72] mb-2">
                  No appointments found
                </h3>
                <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65 max-w-sm mb-6">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "You don't have any appointments yet. Book your first wellness session!"}
                </p>
                <Button
                  className="bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
                  onClick={() => router.push("/user-dashboard/book")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={() => openCancelDialog(appointment)}
                  onReschedule={() => router.push("/contact")}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">Cancel Appointment?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your{" "}
              <span className="font-semibold text-[#271024] dark:text-[#e3ae72]">
                {selectedAppointment?.serviceName}
              </span>{" "}
              appointment on{" "}
              <span className="font-semibold">
                {selectedAppointment &&
                  new Date(selectedAppointment.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-[#271024]/20 dark:border-[#e3ae72]/30">
                Keep Appointment
              </Button>
            </DialogClose>
            <Button
              onClick={handleCancel}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({
  appointment,
  onCancel,
  onReschedule,
}: {
  appointment: ReturnType<typeof enrichBookings>[0];
  onCancel: () => void;
  onReschedule: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const appointmentDate = new Date(appointment.date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isPast = appointmentDate < today || appointment.status === "COMPLETED" || appointment.status === "CANCELLED";
  const canModify = !isPast && (appointment.status === "PENDING" || appointment.status === "CONFIRMED");

  return (
    <Card
      className={cn(
        "border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm transition-all hover:shadow-md overflow-hidden",
        appointment.status === "CANCELLED" && "opacity-60"
      )}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Date Section */}
          <div className="flex sm:flex-col items-center justify-center gap-2 p-4 sm:p-6 bg-gradient-to-br from-[#271024]/5 to-[#e3ae72]/5 dark:from-[#e3ae72]/10 dark:to-[#271024]/10 sm:min-w-[100px]">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
                {appointmentDate.getDate()}
              </p>
              <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60 uppercase">
                {appointmentDate.toLocaleDateString("en-US", { month: "short" })}
              </p>
              <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">
                {appointmentDate.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Main Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-start sm:items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72]">
                    {appointment.serviceName}
                  </h3>
                  <Badge className={cn("border", STATUS_COLORS[appointment.status])}>
                    <span className="mr-1">{STATUS_ICONS[appointment.status]}</span>
                    {appointment.status}
                  </Badge>
                </div>

                <div className="grid gap-2 text-sm text-[#271024]/60 dark:text-[#e3ae72]/60">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {appointmentDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Licensed Aesthetician</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Serenity Rejuvenation Med Spa</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="text-sm text-[#271024]/70 dark:text-[#e3ae72]/70 bg-[#271024]/5 dark:bg-[#e3ae72]/5 rounded-lg p-3">
                    <span className="font-medium">Notes:</span> {appointment.notes}
                  </div>
                )}

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="space-y-2 pt-2 border-t border-[#271024]/10 dark:border-[#e3ae72]/20">
                    <div className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60">
                      <span className="font-medium">Appointment ID:</span> {appointment.id.slice(0, 8)}...
                    </div>
                    <div className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60">
                      <span className="font-medium">Booked on:</span>{" "}
                      {appointment.createdAt
                        ? new Date(appointment.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:items-end gap-2">
                {canModify && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onCancel}
                      className="border-[#271024]/20 dark:border-[#e3ae72]/30"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onReschedule}
                    >
                      Reschedule
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#271024]/60 dark:text-[#e3ae72]/60 hover:text-[#271024] dark:hover:text-[#e3ae72]"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Calendar View Component
function CalendarView({ bookings }: { bookings: ReturnType<typeof enrichBookings> }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startPad = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const bookingsByDate: Record<number, typeof bookings> = {};
  bookings.forEach((b) => {
    const date = new Date(b.date);
    if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
      const day = date.getDate();
      if (!bookingsByDate[day]) bookingsByDate[day] = [];
      bookingsByDate[day].push(b);
    }
  });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const cells = [];
  // Empty cells for padding
  for (let i = 0; i < startPad; i++) {
    cells.push(<div key={`empty-${i}`} className="min-h-24 p-2 border border-border/40 rounded-lg bg-muted/20" />);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dayBookings = bookingsByDate[day] || [];
    const isToday = day === new Date().getDate() &&
      currentMonth.getMonth() === new Date().getMonth() &&
      currentMonth.getFullYear() === new Date().getFullYear();

    cells.push(
      <div
        key={day}
        className={cn(
          "min-h-24 p-2 border border-border/40 rounded-lg transition-all hover:shadow-sm",
          isToday && "border-[#e3ae72] dark:border-[#e3ae72] bg-[#e3ae72]/5 dark:bg-[#e3ae72]/10",
          dayBookings.length > 0 && "bg-primary/5"
        )}
      >
        <span className={cn(
          "text-sm font-medium",
          isToday ? "text-[#e3ae72] dark:text-[#e3ae72]" : "text-foreground/70"
        )}>
          {day}
        </span>
        <div className="mt-1 space-y-1">
          {dayBookings.slice(0, 2).map((b) => (
            <div
              key={b.id}
              className={cn(
                "text-xs p-1 rounded truncate border",
                STATUS_COLORS[b.status]
              )}
            >
              {b.serviceName}
            </div>
          ))}
          {dayBookings.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{dayBookings.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={prevMonth}
          className="border-[#271024]/20 dark:border-[#e3ae72]/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72]">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="border-[#271024]/20 dark:border-[#e3ae72]/30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-sm font-medium text-[#271024]/60 dark:text-[#e3ae72]/60">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {cells}
        </div>
      </div>
    </div>
  );
}
