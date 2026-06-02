export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface ProductLite {
  id: string;
  title: string;
  price: string | null;
  description: string;
}

export interface BookingLite {
  id: string;
  userId: string;
  serviceId: string;
  date: Date | string;
  status: BookingStatus;
  notes?: string | null;
  createdAt?: Date | string;
}

export interface EnrichedBooking extends BookingLite {
  serviceName: string;
  servicePrice: number;
}

export const BRAND = {
  navy: "#07264f",
  gold: "#e3ae72",
} as const;

export function parsePrice(price?: string | null): number {
  if (!price) return 100;
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 100;
}

export function productMap(products: ProductLite[]): Map<string, ProductLite> {
  return new Map(products.map((p) => [p.id, p]));
}

export function enrichBookings(
  bookings: BookingLite[],
  products: ProductLite[]
): EnrichedBooking[] {
  const map = productMap(products);
  return bookings.map((b) => {
    const p = map.get(b.serviceId);
    return {
      ...b,
      serviceName: p?.title ?? "Treatment",
      servicePrice: parsePrice(p?.price),
    };
  });
}

export function categorizeTreatment(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("botox")) return "Botox";
  if (t.includes("prp") || t.includes("prf")) return "PRP / PRF";
  if (t.includes("microneedling") || t.includes("micro")) return "Microneedling";
  if (t.includes("sculptra")) return "Sculptra";
  return "Other";
}

export function buildMonthlyTimeline(bookings: EnrichedBooking[]) {
  const months: Record<string, number> = {};
  for (const b of bookings) {
    const d = new Date(b.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = (months[key] ?? 0) + 1;
  }
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      treatments: count,
    }));
}

export function buildSpendingPie(bookings: EnrichedBooking[]) {
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const groups: Record<string, number> = {};
  for (const b of completed) {
    const cat = categorizeTreatment(b.serviceName);
    groups[cat] = (groups[cat] ?? 0) + b.servicePrice;
  }
  const entries = Object.entries(groups);
  if (entries.length === 0) {
    return [
      { name: "Botox", value: 0, fill: "var(--chart-1)" },
      { name: "PRP / PRF", value: 0, fill: "var(--chart-2)" },
      { name: "Microneedling", value: 0, fill: "var(--chart-3)" },
      { name: "Other", value: 0, fill: "var(--chart-4)" },
    ];
  }
  const fills = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  return entries.map(([name, value], i) => ({
    name,
    value: Math.round(value),
    fill: fills[i % fills.length],
  }));
}

export function buildRevenueTrend(bookings: EnrichedBooking[]) {
  const weeks: Record<string, number> = {};
  for (const b of bookings.filter((x) => x.status === "COMPLETED")) {
    const d = new Date(b.date);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    const key = start.toISOString().slice(0, 10);
    weeks[key] = (weeks[key] ?? 0) + b.servicePrice;
  }
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([week, revenue]) => ({
      week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.round(revenue),
    }));
}

export function buildBookingsBar(bookings: EnrichedBooking[]) {
  const groups: Record<string, number> = {};
  for (const b of bookings) {
    const cat = categorizeTreatment(b.serviceName);
    groups[cat] = (groups[cat] ?? 0) + 1;
  }
  return Object.entries(groups).map(([treatment, count]) => ({ treatment, count }));
}

export function buildClientGrowth(users: { createdAt: Date | string }[]) {
  const months: Record<string, { new: number }> = {};
  for (const u of users) {
    const d = new Date(u.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!months[key]) months[key] = { new: 0 };
    months[key].new += 1;
  }
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
      newClients: data.new,
      returning: Math.max(0, data.new - 1),
    }));
}

export function buildOccupancyHeatmap(bookings: BookingLite[]) {
  const counts: Record<string, number> = {};
  for (const b of bookings) {
    const d = new Date(b.date);
    const key = d.toISOString().slice(0, 10);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const today = new Date();
  const days: { date: string; count: number; label: string }[] = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      count: counts[key] ?? 0,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }
  return days;
}

export function getNextBooking(bookings: EnrichedBooking[]) {
  const now = Date.now();
  return bookings
    .filter(
      (b) =>
        (b.status === "CONFIRMED" || b.status === "PENDING") &&
        new Date(b.date).getTime() > now
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
}

export function formatAppointmentCountdown(
  nextBooking: EnrichedBooking | undefined
): { countdown: string; detail: string } {
  if (!nextBooking) {
    return { countdown: "—", detail: "Book your first visit" };
  }
  const diff = new Date(nextBooking.date).getTime() - Date.now();
  const detail = nextBooking.serviceName;
  if (diff <= 0) {
    return { countdown: "Today", detail };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const countdown = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  return { countdown, detail };
}

export function computeUserDashboardStats(
  bookings: BookingLite[],
  products: ProductLite[]
) {
  const enriched = enrichBookings(bookings, products);
  const upcoming = enriched.filter(
    (b) => b.status === "PENDING" || b.status === "CONFIRMED"
  );
  const completed = enriched.filter((b) => b.status === "COMPLETED");
  const lifetimeSpending = completed.reduce((sum, b) => sum + b.servicePrice, 0);
  const { countdown, detail } = formatAppointmentCountdown(getNextBooking(enriched));

  return {
    upcomingAppointments: upcoming.length,
    totalTreatments: completed.length,
    lifetimeSpending,
    nextAppointmentCountdown: countdown,
    nextAppointmentDetail: detail,
  };
}

export function recommendNextTreatment(bookings: EnrichedBooking[]): string {
  if (bookings.length === 0) return "Microneedling — ideal for first-time skin renewal";
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  if (completed.length === 0) return "Botox — smooth fine lines with minimal downtime";
  const last = completed[0];
  const cat = categorizeTreatment(last.serviceName);
  if (cat === "Botox") return "PRP / PRF — boost collagen between Botox sessions";
  if (cat === "Microneedling") return "Botox — complement texture work with line softening";
  return "Microneedling — maintenance for glow and texture";
}
