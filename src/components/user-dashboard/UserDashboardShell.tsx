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
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[#271024] dark:text-[#e3ae72]">{b.serviceName}</p>
          <Badge className={cn("border-0", statusClass(b.status))}>{b.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="size-3.5" />
          {new Date(b.date).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <User className="size-3.5" /> Licensed aesthetician
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="size-3.5" /> Serenity Rejuvenation Med Spa
        </p>
      </div>
      {(b.status === "PENDING" || b.status === "CONFIRMED") && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={isPending} onClick={() => cancelBooking(b.id)}>
            Cancel
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <a href="/contact">Reschedule</a>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#271024] dark:text-[#e3ae72]">
          {VIEW_TITLES[view] ?? "Dashboard"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.name?.split(" ")[0] ?? "there"} — your personal wellness hub
        </p>
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
            <TreatmentTimelineChart data={timeline.length ? timeline : [{ month: "—", treatments: 0 }]} />
            <SpendingPieChart data={spendingPie} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/60">
              <CardHeader>
                <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No upcoming appointments.</p>
                ) : (
                  upcoming.slice(0, 3).map((b) => <AppointmentCard key={b.id} b={b} />)
                )}
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-gradient-to-br from-[#271024]/5 to-primary/5 dark:from-[#e3ae72]/10">
              <CardHeader>
                <CardTitle className="text-[#271024] dark:text-[#e3ae72]">For You</CardTitle>
                <CardDescription>Personal recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-[#271024] dark:text-[#e3ae72]">Recommended next</p>
                  <p className="text-muted-foreground mt-1">{recommendNextTreatment(enriched)}</p>
                </div>
                <div>
                  <p className="font-medium text-[#271024] dark:text-[#e3ae72]">Maintenance plan</p>
                  <p className="text-muted-foreground mt-1">
                    Book every 8–12 weeks to maintain results from your last treatment.
                  </p>
                </div>
                <Button className="w-full" onClick={() => router.push("/user-dashboard?view=book")}>
                  Book now
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {view === "appointments" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant={aptView === "list" ? "default" : "outline"} size="sm" onClick={() => setAptView("list")}>
              <List className="size-4 mr-1" /> List
            </Button>
            <Button variant={aptView === "calendar" ? "default" : "outline"} size="sm" onClick={() => setAptView("calendar")}>
              <CalendarDays className="size-4 mr-1" /> Calendar
            </Button>
          </div>
          {aptView === "calendar" ? (
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <CalendarMonth bookings={enriched} />
              </CardContent>
            </Card>
          ) : null}
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({enriched.length - upcoming.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-3 mt-4">
              {upcoming.length ? upcoming.map((b) => <AppointmentCard key={b.id} b={b} />) : <p className="text-sm text-muted-foreground">No upcoming appointments.</p>}
            </TabsContent>
            <TabsContent value="past" className="space-y-3 mt-4">
              {enriched.filter((b) => b.status === "COMPLETED" || b.status === "CANCELLED").map((b) => (
                <AppointmentCard key={b.id} b={b} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {view === "book" && (
        <Card className="max-w-xl border-border/60">
          <CardHeader>
            <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Book New Appointment</CardTitle>
            <CardDescription>Select service, add-ons, and preferred time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Service</Label>
              <Select value={bookService} onValueChange={setBookService}>
                <SelectTrigger><SelectValue placeholder="Choose treatment" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} {p.price ? `— ${p.price}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Add-ons</Label>
              <div className="flex flex-wrap gap-2">
                {ADD_ONS.map((a) => (
                  <Button
                    key={a}
                    type="button"
                    size="sm"
                    variant={bookAddons.includes(a) ? "default" : "outline"}
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
            <div className="space-y-2">
              <Label>Date & time</Label>
              <Input type="datetime-local" value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
            </div>
            <div className="rounded-lg border border-dashed border-primary/30 bg-muted/30 p-4 text-sm text-muted-foreground flex items-center gap-2">
              <CreditCard className="size-4 shrink-0" />
              Payment collected at checkout — secure gateway integration coming soon.
            </div>
            {message && <p className="text-sm text-primary">{message}</p>}
            <Button className="w-full" disabled={isPending} onClick={submitBooking}>
              {isPending ? "Booking…" : "Request appointment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {view === "history" && (
        <div className="space-y-3">
          {enriched.map((b) => (
            <Card key={b.id} className="border-border/60">
              <CardContent className="pt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#271024] dark:text-[#e3ae72]">{b.serviceName}</p>
                  <p className="text-sm text-muted-foreground">{new Date(b.date).toLocaleDateString()}</p>
                  {b.notes && <p className="text-xs mt-2 text-muted-foreground">Notes: {b.notes}</p>}
                  <p className="text-xs mt-1 text-muted-foreground italic">Provider notes available after visit</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className={statusClass(b.status)}>{b.status}</Badge>
                  <Button variant="ghost" size="sm"><Download className="size-4" /> Receipt</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {enriched.length === 0 && <p className="text-muted-foreground text-sm">No treatment history yet.</p>}
        </div>
      )}

      {view === "payments" && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {completed.map((b) => (
              <div key={b.id} className="flex justify-between py-3 text-sm">
                <span>{b.serviceName} — {new Date(b.date).toLocaleDateString()}</span>
                <span className="font-medium">${b.servicePrice}</span>
              </div>
            ))}
            {completed.length === 0 && <p className="text-muted-foreground py-4">No payments yet.</p>}
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
          <Card className="border-border/60 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#271024] dark:text-[#e3ae72]">Membership Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between rounded-lg border p-3 border-primary/20 bg-primary/5">
                <span className="font-medium">Glow — 0+ visits</span>
                <span>5% off add-ons</span>
              </div>
              <div className="flex justify-between rounded-lg border p-3">
                <span className="font-medium">Radiance — 5+ visits</span>
                <span>10% off treatments</span>
              </div>
              <div className="flex justify-between rounded-lg border p-3">
                <span className="font-medium">Serenity — 10+ visits</span>
                <span>15% + priority booking</span>
              </div>
              <p className="text-muted-foreground">Current tier: {completed.length >= 10 ? "Serenity" : completed.length >= 5 ? "Radiance" : "Glow"}</p>
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
