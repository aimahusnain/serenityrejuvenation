"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  XCircle,
  Sparkles,
  Download,
  Filter,
  UserCog,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  RevenueTrendChart,
  BookingsBarChart,
  ClientGrowthChart,
  OccupancyHeatmap,
} from "@/components/dashboard/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  enrichBookings,
  buildRevenueTrend,
  buildBookingsBar,
  buildClientGrowth,
  buildOccupancyHeatmap,
  categorizeTreatment,
  parsePrice,
  type ProductLite,
  type BookingLite,
} from "@/lib/dashboard";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  _count: { bookings: number };
}

interface AdminBooking extends BookingLite {
  user: { name: string | null; email: string | null };
}

const STAFF = [
  { name: "Dr. Shavonda Fields", role: "Lead Aesthetician", clients: 48, revenue: 12400, rating: 4.9 },
  { name: "Sarah M.", role: "Injector Specialist", clients: 32, revenue: 8900, rating: 4.8 },
  { name: "Lisa K.", role: "Skin Therapist", clients: 28, revenue: 6200, rating: 4.7 },
];

const VIEW_TITLES: Record<string, string> = {
  overview: "Operations Overview",
  appointments: "Appointment Management",
  clients: "Client Management",
  services: "Services & Treatments",
  finance: "Payments & Finance",
  staff: "Staff Management",
};

export function AdminDashboardShell({
  users,
  bookings,
  products,
  stats,
}: {
  users: AdminUser[];
  bookings: AdminBooking[];
  products: ProductLite[];
  stats: {
    totalUsers: number;
    totalBookings: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") ?? "overview";
  const [isPending, startTransition] = useTransition();
  const [localBookings, setLocalBookings] = useState(bookings);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTreatment, setFilterTreatment] = useState<string>("all");
  const [clientSearch, setClientSearch] = useState("");

  const enriched = useMemo(
    () => enrichBookings(localBookings, products),
    [localBookings, products]
  );

  const revenue = enriched
    .filter((b) => b.status === "COMPLETED")
    .reduce((s, b) => s + b.servicePrice, 0);

  const completionRate =
    stats.totalBookings > 0
      ? Math.round((stats.completed / stats.totalBookings) * 100)
      : 0;
  const cancelRate =
    stats.totalBookings > 0
      ? Math.round((stats.cancelled / stats.totalBookings) * 100)
      : 0;
  const avgValue =
    stats.completed > 0 ? Math.round(revenue / stats.completed) : parsePrice(products[0]?.price);

  const popular = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of enriched) {
      const c = categorizeTreatment(b.serviceName);
      counts[c] = (counts[c] ?? 0) + 1;
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top?.[0] ?? "—";
  }, [enriched]);

  const filteredBookings = enriched.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (filterTreatment !== "all" && categorizeTreatment(b.serviceName) !== filterTreatment)
      return false;
    return true;
  });

  const filteredUsers = users.filter(
    (u) =>
      !clientSearch ||
      u.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const updateStatus = (bookingId: string, status: string) => {
    startTransition(async () => {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      if (res.ok) {
        setLocalBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: status as BookingLite["status"] } : b))
        );
        router.refresh();
      }
    });
  };

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: "bg-emerald-500/15 text-emerald-700",
      PENDING: "bg-amber-500/15 text-amber-700",
      CANCELLED: "bg-red-500/15 text-red-700",
      COMPLETED: "bg-primary/15 text-primary",
    };
    return map[status] ?? "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72]">
          {VIEW_TITLES[view] ?? "Admin"}
        </h2>
        <p className="text-sm text-muted-foreground">Spa management control center</p>
      </div>

      {view === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <KpiCard title="Total Revenue" value={`$${revenue.toLocaleString()}`} subtitle="From completed visits" icon={DollarSign} trend="+12% vs last month" trendUp />
            <KpiCard title="Bookings" value={String(stats.totalBookings)} subtitle={`${stats.pending} pending`} icon={Calendar} />
            <KpiCard title="Active Clients" value={String(stats.totalUsers)} subtitle="Registered accounts" icon={Users} />
            <KpiCard title="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} trendUp={completionRate >= 70} />
            <KpiCard title="Cancellation Rate" value={`${cancelRate}%`} icon={XCircle} trendUp={cancelRate < 15} />
            <KpiCard title="Avg Booking Value" value={`$${avgValue}`} subtitle={`Top: ${popular}`} icon={Sparkles} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <RevenueTrendChart data={buildRevenueTrend(enriched).length ? buildRevenueTrend(enriched) : [{ week: "—", revenue: 0 }]} />
            <BookingsBarChart data={buildBookingsBar(enriched)} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ClientGrowthChart data={buildClientGrowth(users)} />
            <OccupancyHeatmap days={buildOccupancyHeatmap(localBookings)} />
          </div>
        </>
      )}

      {view === "appointments" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="size-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterTreatment} onValueChange={setFilterTreatment}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Treatment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All treatments</SelectItem>
                {["Botox", "PRP / PRF", "Microneedling", "Sculptra", "Other"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground ml-auto">
              Drag calendar — use filters; reschedule via status updates
            </p>
          </div>
          <AdminCalendar bookings={filteredBookings} />
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">All Appointments</CardTitle>
              <CardDescription>Conflict detection: overlapping slots highlighted in calendar</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((b) => {
                    const adminB = localBookings.find((x) => x.id === b.id);
                    return (
                      <TableRow key={b.id}>
                        <TableCell>{adminB?.user?.name ?? adminB?.user?.email ?? "—"}</TableCell>
                        <TableCell>{b.serviceName}</TableCell>
                        <TableCell>{new Date(b.date).toLocaleString()}</TableCell>
                        <TableCell><Badge className={cn("border-0", statusClass(b.status))}>{b.status}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={isPending}><MoreVertical className="size-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]
                                .filter((s) => s !== b.status)
                                .map((s) => (
                                  <DropdownMenuItem key={s} onClick={() => updateStatus(b.id, s)}>
                                    Mark {s.toLowerCase()}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {view === "clients" && (
        <Card className="border-border/60">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Clients ({users.length})</CardTitle>
            </div>
            <Input placeholder="Search clients…" className="max-w-xs sm:ml-auto" value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name ?? "—"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u._count.bookings}</TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {view === "services" && (
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Services & Packages</CardTitle>
            <Button size="sm">Add treatment</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex justify-between items-center rounded-lg border p-4">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Duration: ~60 min</p>
                </div>
                <p className="font-semibold text-[#e3ae72]">{p.price ?? "Contact"}</p>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-primary/30 p-4 mt-4">
              <p className="font-medium text-[#07264f] dark:text-[#e3ae72]">Glow Package</p>
              <p className="text-sm text-muted-foreground">Microneedling + PRP bundle — configure in admin tools</p>
            </div>
          </CardContent>
        </Card>
      )}

      {view === "finance" && (
        <div className="grid gap-6 md:grid-cols-3">
          <KpiCard title="Total Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} />
          <KpiCard title="Pending" value={String(stats.pending + stats.confirmed)} subtitle="Awaiting completion" icon={Calendar} />
          <KpiCard title="Refunds" value="0" subtitle="No active refunds" icon={XCircle} />
          <Card className="md:col-span-3 border-border/60">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Transaction Log</CardTitle>
              <Button variant="outline" size="sm"><Download className="size-4 mr-1" /> Export Excel</Button>
            </CardHeader>
            <CardContent className="divide-y text-sm">
              {enriched.filter((b) => b.status === "COMPLETED").map((b) => (
                <div key={b.id} className="flex justify-between py-2">
                  <span>{b.serviceName} — {new Date(b.date).toLocaleDateString()}</span>
                  <span className="font-medium text-emerald-600">+${b.servicePrice}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {view === "staff" && (
        <div className="grid gap-4 md:grid-cols-3">
          {STAFF.map((s) => (
            <Card key={s.name} className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCog className="size-5 text-primary" />
                  {s.name}
                </CardTitle>
                <CardDescription>{s.role}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Clients served: <strong>{s.clients}</strong></p>
                <p>Revenue: <strong>${s.revenue.toLocaleString()}</strong></p>
                <p>Rating: <strong>{s.rating}</strong> ★</p>
                <Button variant="outline" size="sm" className="w-full mt-2">Edit schedule</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminCalendar({
  bookings,
}: {
  bookings: ReturnType<typeof enrichBookings>;
}) {
  const now = new Date();
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  return (
    <Card className="border-border/60 overflow-x-auto">
      <CardHeader>
        <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Weekly Schedule</CardTitle>
        <CardDescription>Click status menu in table to move appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 min-w-[700px]">
          <div />
          {days.map((d) => (
            <div key={d.toISOString()} className="text-center text-xs font-medium p-2 border-b">
              {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </div>
          ))}
          {hours.map((h) => (
            <Fragment key={h}>
              <div className="text-xs text-muted-foreground py-4 pr-2 text-right">
                {h > 12 ? h - 12 : h}:00 {h >= 12 ? "PM" : "AM"}
              </div>
              {days.map((d) => {
                const slotBookings = bookings.filter((b) => {
                  const bd = new Date(b.date);
                  return (
                    bd.toDateString() === d.toDateString() &&
                    bd.getHours() === h
                  );
                });
                const conflict = slotBookings.length > 1;
                return (
                  <div
                    key={`${d.toISOString()}-${h}`}
                    className={cn(
                      "min-h-12 border rounded p-1 text-[10px]",
                      conflict && "ring-2 ring-red-500/50 bg-red-500/10",
                      slotBookings.length === 1 && "bg-primary/15 border-primary/30"
                    )}
                  >
                    {slotBookings.map((b) => (
                      <p key={b.id} className="truncate font-medium">{b.serviceName}</p>
                    ))}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
