import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  buildMonthlyTimeline,
  buildSpendingPie,
  computeUserDashboardStats,
  enrichBookings,
  formatAppointmentCountdown,
  getNextBooking,
  recommendNextTreatment,
} from "@/lib/dashboard";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartPieDonutActive } from "@/components/chart-pie-donut-active";
import { UpcomingAppointmentsWidget } from "@/components/user-dashboard/UpcomingAppointmentsWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreatmentTimelineChart } from "@/components/dashboard/charts";

export default async function UserDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [user, products] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { bookings: { orderBy: { date: "desc" } } },
    }),
    prisma.product.findMany({ orderBy: { title: "asc" } }),
  ]);

  if (!user) redirect("/login");

  const stats = computeUserDashboardStats(
    user.bookings,
    products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
    }))
  );

  const productLite = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
  }));

  const enriched = enrichBookings(user.bookings, productLite);
  const timeline = buildMonthlyTimeline(enriched);
  const spendingPie = buildSpendingPie(enriched).map((d) => ({
    name: d.name === "PRP / PRF" ? "PRP" : d.name,
    value: d.value,
    fill: d.fill,
  }));

  const recommended = recommendNextTreatment(enriched);
  const next = getNextBooking(enriched);
  const countdown = formatAppointmentCountdown(next);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6 space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <UpcomingAppointmentsWidget
                      appointments={enriched.map((b) => ({
                        id: b.id,
                        date: b.date,
                        status: b.status,
                        serviceName: b.serviceName,
                      }))}
                      technician="Licensed Aesthetician"
                      location="Serenity Rejuvenation Med Spa"
                    />
                  </div>
                  <Card className="border-border/60 bg-linear-to-br from-[#271024]/5 to-primary/5 dark:from-[#e3ae72]/10">
                    <CardHeader>
                      <CardTitle className="text-[#271024] dark:text-[#e3ae72]">For You</CardTitle>
                      <CardDescription>Personal recommendations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium text-[#271024] dark:text-[#e3ae72]">Recommended next treatment</p>
                        <p className="text-muted-foreground mt-1">{recommended}</p>
                      </div>
                      <div>
                        <p className="font-medium text-[#271024] dark:text-[#e3ae72]">Maintenance plan suggestion</p>
                        <p className="text-muted-foreground mt-1">
                          Book every 8-12 weeks to maintain results and stay on track.
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-card p-3">
                        <p className="text-xs text -muted-foreground">Next appointment</p>
                        <p className="font-medium">{countdown.countdown}</p>
                        <p className="text-xs text-muted-foreground mt-1">{countdown.detail}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 items-start">
                  <TreatmentTimelineChart
                    data={timeline.length ? timeline : [{ month: "—", treatments: 0 }]}
                  />
                  <ChartPieDonutActive data={spendingPie} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
