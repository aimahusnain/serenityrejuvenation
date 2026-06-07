"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  DollarSign,
  Gift,
  Sparkles,
  MapPin,
  User,
  CreditCard,
  Download,
  CalendarDays,
  List,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  SpendingPieChart,
  TreatmentTimelineChart,
} from "@/components/dashboard/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import ProfileSection from "@/components/account/ProfileSection";
import PreferencesSection from "@/components/account/PreferencesSection";
import {
  enrichBookings,
  buildMonthlyTimeline,
  buildSpendingPie,
  getNextBooking,
  recommendNextTreatment,
  type ProductLite,
  type BookingLite,
} from "@/lib/dashboard";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  bookings: BookingLite[];
  preferences: {
    id: string;
    emailNotifications: boolean;
    phone: string | null;
    preferredServices: string[];
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

const ADD_ONS = ["PRP Enhancement", "PRF Boost", "Sculptra Add-on", "LED Therapy"];

const VIEW_TITLES: Record<string, string> = {
  overview: "Wellness Overview",
  appointments: "My Appointments",
  book: "Book Appointment",
  history: "Treatment History",
  payments: "Payments & Invoices",
  profile: "Profile Settings",
  loyalty: "Loyalty & Membership",
};

export function UserDashboardShell({
  user,
  products,
}: {
  user: UserData;
  products: ProductLite[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") ?? "overview";
  const [isPending, startTransition] = useTransition();
  const [aptView, setAptView] = useState<"list" | "calendar">("list");
  const [bookService, setBookService] = useState(products[0]?.id ?? "");
  const [bookDate, setBookDate] = useState("");
  const [bookAddons, setBookAddons] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const enriched = useMemo(
    () => enrichBookings(user.bookings, products),
    [user.bookings, products]
  );

  const upcoming = enriched.filter(
    (b) => b.status === "PENDING" || b.status === "CONFIRMED"
  );
  const completed = enriched.filter((b) => b.status === "COMPLETED");
  const lifetimeSpend = completed.reduce((s, b) => s + b.servicePrice, 0);
  const loyaltyPoints = completed.length * 50 + upcoming.length * 10;
  const nextBooking = getNextBooking(enriched);
  const timeline = buildMonthlyTimeline(enriched);
  const spendingPie = buildSpendingPie(enriched);

  const countdown = useMemo(() => {
    if (!nextBooking) return null;
    const diff = new Date(nextBooking.date).getTime() - Date.now();
    if (diff <= 0) return "Today";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  }, [nextBooking]);

  const cancelBooking = (id: string) => {
    startTransition(async () => {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id, status: "CANCELLED" }),
      });
      router.refresh();
    });
  };

  const submitBooking = () => {
    if (!bookService || !bookDate) {
      setMessage("Please select a service and date/time.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: bookService,
          date: bookDate,
          notes: bookAddons.length ? `Add-ons: ${bookAddons.join(", ")}` : undefined,
        }),
      });
      setMessage(res.ok ? "Appointment requested! We'll confirm shortly." : "Could not book. Try again.");
      if (res.ok) router.refresh();
    });
  };

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-400",
      COMPLETED: "bg-primary/15 text-primary",
    };
    return map[status] ?? "";
  };

  const AppointmentCard = ({ b }: { b: (typeof enriched)[0] }) => (
    <div className="flex flex-col gap-3 rounded-xl border border-[#271024]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]/30 p-4 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-md">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[#271024] dark:text-[#e3ae72]">{b.serviceName}</p>
          <Badge className={cn("border-0", statusClass(b.status))}>{b.status}</Badge>
        </div>
        <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60 flex items-center gap-1">
          <Clock className="size-3.5" />
          {new Date(b.date).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-xs text-[#271024]/50 dark:text-[#e3ae72]/50 flex items-center gap-1">
          <User className="size-3.5" /> Licensed aesthetician
        </p>
        <p className="text-xs text-[#271024]/50 dark:text-[#e3ae72]/50 flex items-center gap-1">
          <MapPin className="size-3.5" /> Serenity Rejuvenation Med Spa
        </p>
      </div>
      {(b.status === "PENDING" || b.status === "CONFIRMED") && (
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isPending}>
                Cancel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">Cancel Appointment?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel your {b.serviceName} appointment on{" "}
                  {new Date(b.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-[#271024]/20 dark:border-[#e3ae72]/30">
                    Keep Appointment
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() => cancelBooking(b.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Cancel
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
                <DialogTitle className="text-[#271024] dark:text-[#e3ae72]">Reschedule Appointment?</DialogTitle>
                <DialogDescription>
                  Would you like to reschedule your {b.serviceName} appointment? You'll be able to select a new date and time that works better for you.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-[#271024]/20 dark:border-[#e3ae72]/30">
                    Keep Current Time
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() => window.location.href = "/contact"}
                    className="bg-[#271024] text-white hover:bg-[#271024]/90 dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
                  >
                    Continue to Reschedule
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#271024]/10 dark:border-[#e3ae72]/20">
        <div>
          <h2 className="text-3xl font-bold text-[#271024] dark:text-[#e3ae72] font-serif">
            {VIEW_TITLES[view] ?? "Dashboard"}
          </h2>
          <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65 mt-1">
            Welcome back, {user.name?.split(" ")[0] ?? "there"} — your personal wellness hub
          </p>
        </div>
        {view === "overview" && (
          <Button
            className="bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
            onClick={() => router.push("/user-dashboard?view=book")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </div>

      {view === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard title="Upcoming" value={String(upcoming.length)} subtitle="Scheduled visits" icon={Calendar} />
            <KpiCard title="Treatments" value={String(completed.length)} subtitle="Completed sessions" icon={Sparkles} />
            <KpiCard title="Lifetime Spend" value={`$${lifetimeSpend.toLocaleString()}`} subtitle="From completed visits" icon={DollarSign} />
            <KpiCard title="Loyalty Points" value={String(loyaltyPoints)} subtitle="Earn 50 pts per visit" icon={Gift} trend={countdown ? `Next visit in ${countdown}` : "Book your next visit"} trendUp={!!nextBooking} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Treatment Timeline</CardTitle>
                <CardDescription>Your wellness journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TreatmentTimelineChart data={timeline.length ? timeline : [{ month: "—", treatments: 0 }]} />
              </CardContent>
            </Card>
            <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Spending Distribution</CardTitle>
                <CardDescription>Your investment in wellness</CardDescription>
              </CardHeader>
              <CardContent>
                <SpendingPieChart data={spendingPie} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Upcoming Appointments</CardTitle>
                    <CardDescription>Your scheduled wellness sessions</CardDescription>
                  </div>
                  {upcoming.length > 3 && (
                    <Button variant="ghost" size="sm" onClick={() => router.push("/user-dashboard/appointments")}>
                      View all
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcoming.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-[#271024]/30 dark:text-[#e3ae72]/30 mb-4" />
                    <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72] mb-2">No upcoming appointments</h3>
                    <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65 max-w-sm">
                      Schedule your next wellness session to see it here
                    </p>
                    <Button
                      className="mt-4 bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
                      onClick={() => router.push("/user-dashboard?view=book")}
                    >
                      Book Now
                    </Button>
                  </div>
                ) : (
                  upcoming.slice(0, 3).map((b) => <AppointmentCard key={b.id} b={b} />)
                )}
              </CardContent>
            </Card>
            <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm bg-gradient-to-br from-[#271024]/5 to-[#e3ae72]/5 dark:from-[#e3ae72]/10 dark:to-[#271024]/10">
              <CardHeader>
                <CardTitle className="text-[#271024] dark:text-[#e3ae72] flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  For You
                </CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-[#271024]/70 dark:text-[#e3ae72]/70 uppercase tracking-wider">Recommended Next</p>
                    <p className="text-sm font-medium text-[#271024] dark:text-[#e3ae72] mt-1">{recommendNextTreatment(enriched)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#271024]/70 dark:text-[#e3ae72]/70 uppercase tracking-wider">Maintenance Plan</p>
                    <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60 mt-1">
                      Book every 8–12 weeks to maintain optimal results
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
                  onClick={() => router.push("/user-dashboard?view=book")}
                >
                  Schedule Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {view === "appointments" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={aptView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setAptView("list")}
                className={aptView === "list" ? "bg-[#271024] text-white dark:bg-[#e3ae72] dark:text-[#271024]" : ""}
              >
                <List className="size-4 mr-1" /> List
              </Button>
              <Button
                variant={aptView === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setAptView("calendar")}
                className={aptView === "calendar" ? "bg-[#271024] text-white dark:bg-[#e3ae72] dark:text-[#271024]" : ""}
              >
                <CalendarDays className="size-4 mr-1" /> Calendar
              </Button>
            </div>
            <Button
              className="bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
              onClick={() => router.push("/user-dashboard?view=book")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book New
            </Button>
          </div>
          {aptView === "calendar" ? (
            <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Calendar View</CardTitle>
                <CardDescription>See your appointments at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[#271024]/60 dark:text-[#e3ae72]/60 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <CalendarMonth bookings={enriched} />
              </CardContent>
            </Card>
          ) : null}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="bg-[#271024]/5 dark:bg-[#e3ae72]/10">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#271024] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#271024]">
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-[#271024] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#271024]">
                Past ({enriched.length - upcoming.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-3 mt-6">
              {upcoming.length ? upcoming.map((b) => <AppointmentCard key={b.id} b={b} />) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-[#271024]/30 dark:text-[#e3ae72]/30 mb-4" />
                  <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72] mb-2">No upcoming appointments</h3>
                  <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65">Schedule your next wellness session to see it here</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-3 mt-6">
              {enriched.filter((b) => b.status === "COMPLETED" || b.status === "CANCELLED").map((b) => (
                <AppointmentCard key={b.id} b={b} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {view === "book" && (
        <Card className="max-w-2xl border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Book New Appointment</CardTitle>
            <CardDescription>Select your preferred treatment, add-ons, and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[#271024] dark:text-[#e3ae72] font-medium">Service</Label>
              <Select value={bookService} onValueChange={setBookService}>
                <SelectTrigger className="border-[#271024]/20 dark:border-[#e3ae72]/30">
                  <SelectValue placeholder="Choose treatment" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} {p.price ? `— $${p.price}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-[#271024] dark:text-[#e3ae72] font-medium">Add-ons</Label>
              <div className="flex flex-wrap gap-2">
                {ADD_ONS.map((a) => (
                  <Button
                    key={a}
                    type="button"
                    size="sm"
                    variant={bookAddons.includes(a) ? "default" : "outline"}
                    className={bookAddons.includes(a) ? "bg-[#271024] text-white dark:bg-[#e3ae72] dark:text-[#271024]" : "border-[#271024]/20 dark:border-[#e3ae72]/30"}
                    onClick={() =>
                      setBookAddons((prev) =>
                        prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
                      )
                    }
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[#271024] dark:text-[#e3ae72] font-medium">Date & time</Label>
              <Input
                type="datetime-local"
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                className="border-[#271024]/20 dark:border-[#e3ae72]/30"
              />
            </div>
            <div className="rounded-lg border border-[#271024]/20 dark:border-[#e3ae72]/30 bg-[#271024]/5 dark:bg-[#e3ae72]/5 p-4 text-sm flex items-center gap-3">
              <CreditCard className="size-5 text-[#271024] dark:text-[#e3ae72]" />
              <div>
                <p className="font-medium text-[#271024] dark:text-[#e3ae72]">Payment Information</p>
                <p className="text-[#271024]/60 dark:text-[#e3ae72]/60">Payment collected at checkout — secure gateway integration coming soon.</p>
              </div>
            </div>
            {message && (
              <div className={`rounded-lg p-3 text-sm ${message.includes("success") || message.includes("requested") ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20"}`}>
                {message}
              </div>
            )}
            <Button
              className="w-full bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
              disabled={isPending}
              onClick={submitBooking}
            >
              {isPending ? "Booking…" : "Request Appointment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {view === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72]">Treatment History</h3>
            <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60">{enriched.length} total appointments</p>
          </div>
          {enriched.map((b) => (
            <Card key={b.id} className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
              <CardContent className="pt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-[#271024] dark:text-[#e3ae72]">{b.serviceName}</p>
                  <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60">{new Date(b.date).toLocaleDateString()}</p>
                  {b.notes && <p className="text-xs mt-2 text-[#271024]/50 dark:text-[#e3ae72]/50">Notes: {b.notes}</p>}
                  <p className="text-xs mt-1 text-[#271024]/40 dark:text-[#e3ae72]/40 italic">Provider notes available after visit</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className={statusClass(b.status)}>{b.status}</Badge>
                  <Button variant="ghost" size="sm" className="text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/5">
                    <Download className="size-4 mr-1" /> Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {enriched.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-[#271024]/30 dark:text-[#e3ae72]/30 mb-4" />
              <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72] mb-2">No treatment history yet</h3>
              <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65">Your completed appointments will appear here</p>
            </div>
          )}
        </div>
      )}

      {view === "payments" && (
        <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Payment History</CardTitle>
            <CardDescription>Your investment in wellness services</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-[#271024]/10 dark:divide-[#e3ae72]/20">
            {completed.map((b) => (
              <div key={b.id} className="flex justify-between py-4 text-sm items-center">
                <div>
                  <p className="font-medium text-[#271024] dark:text-[#e3ae72]">{b.serviceName}</p>
                  <p className="text-[#271024]/60 dark:text-[#e3ae72]/60 text-xs">{new Date(b.date).toLocaleDateString()}</p>
                </div>
                <span className="font-semibold text-[#271024] dark:text-[#e3ae72]">${b.servicePrice}</span>
              </div>
            ))}
            {completed.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CreditCard className="h-12 w-12 text-[#271024]/30 dark:text-[#e3ae72]/30 mb-4" />
                <h3 className="text-lg font-semibold text-[#271024] dark:text-[#e3ae72] mb-2">No payment history yet</h3>
                <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/65">Your completed payments will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {view === "profile" && (
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <ProfileSection user={user} />
          <PreferencesSection preferences={user.preferences} />
        </div>
      )}

      {view === "loyalty" && (
        <div className="grid gap-6 md:grid-cols-3">
          <KpiCard title="Points Balance" value={String(loyaltyPoints)} subtitle="Redeem at 500 pts" icon={Gift} />
          <Card className="border-[#271024]/10 dark:border-[#e3ae72]/20 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Membership Tiers</CardTitle>
              <CardDescription>Unlock exclusive benefits as you progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`flex justify-between rounded-lg border p-4 ${completed.length >= 0 ? "border-[#e3ae72]/30 dark:border-[#e3ae72]/30 bg-[#e3ae72]/10 dark:bg-[#e3ae72]/20" : "border-[#271024]/10"}`}>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#271024] dark:text-[#e3ae72]" />
                  <div>
                    <span className="font-semibold text-[#271024] dark:text-[#e3ae72]">Glow</span>
                    <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">0+ visits</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">5% off add-ons</span>
              </div>
              <div className={`flex justify-between rounded-lg border p-4 ${completed.length >= 5 ? "border-[#e3ae72]/30 dark:border-[#e3ae72]/30 bg-[#e3ae72]/10 dark:bg-[#e3ae72]/20" : "border-[#271024]/10"}`}>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#271024] dark:text-[#e3ae72]" />
                  <div>
                    <span className="font-semibold text-[#271024] dark:text-[#e3ae72]">Radiance</span>
                    <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">5+ visits</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">10% off treatments</span>
              </div>
              <div className={`flex justify-between rounded-lg border p-4 ${completed.length >= 10 ? "border-[#e3ae72]/30 dark:border-[#e3ae72]/30 bg-[#e3ae72]/10 dark:bg-[#e3ae72]/20" : "border-[#271024]/10"}`}>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#271024] dark:text-[#e3ae72]" />
                  <div>
                    <span className="font-semibold text-[#271024] dark:text-[#e3ae72]">Serenity</span>
                    <p className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">10+ visits</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">15% off + priority booking</span>
              </div>
              <div className="mt-4 pt-4 border-t border-[#271024]/10 dark:border-[#e3ae72]/20">
                <p className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60">
                  Current tier: <span className="font-semibold text-[#271024] dark:text-[#e3ae72]">{completed.length >= 10 ? "Serenity" : completed.length >= 5 ? "Radiance" : "Glow"}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function CalendarMonth({ bookings }: { bookings: ReturnType<typeof enrichBookings> }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDay: Record<number, typeof bookings> = {};
  for (const b of bookings) {
    const d = new Date(b.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(b);
    }
  }
  const cells: ReactNode[] = [];
  for (let i = 0; i < startPad; i++) cells.push(<div key={`e-${i}`} />);
  for (let d = 1; d <= daysInMonth; d++) {
    const items = byDay[d];
    cells.push(
      <div
        key={d}
        className={cn(
          "min-h-14 rounded-md border p-1 text-xs",
          items?.length ? "border-primary/40 bg-primary/10" : "border-border/40"
        )}
      >
        <span className="font-medium">{d}</span>
        {items?.slice(0, 1).map((b) => (
          <p key={b.id} className="truncate text-[10px] text-muted-foreground mt-0.5">
            {b.serviceName}
          </p>
        ))}
      </div>
    );
  }
  return <div className="grid grid-cols-7 gap-2">{cells}</div>;
}
