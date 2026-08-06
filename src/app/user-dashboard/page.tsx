import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartPieDonutActive } from "@/components/chart-pie-donut-active";
import { TreatmentTimelineChart } from "@/components/dashboard/charts";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UpcomingAppointmentsWidget } from "@/components/user-dashboard/UpcomingAppointmentsWidget";
import { UserInquiriesSection } from "@/components/user-dashboard/UserInquiriesSection";
import { auth } from "@/lib/auth";
import {
  buildMonthlyTimeline,
  buildSpendingPie,
  computeUserDashboardStats,
  enrichBookings,
  formatAppointmentCountdown,
  getNextBooking,
  recommendNextTreatment,
} from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Sparkles, TrendingUp, BookOpen, MessageSquare } from "lucide-react";

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [user, products, inquiries] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id  },
      include: { bookings: { orderBy: { date: "desc" } } },
    }),
    prisma.product.findMany({ orderBy: { title: "asc" } }),
    prisma.serviceInquiry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
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

  // Enrich inquiries with service details
  const inquiriesWithServices = await Promise.all(
    inquiries.map(async (inquiry) => {
      const service = await prisma.product.findUnique({
        where: { id: inquiry.serviceId },
        select: { id: true, title: true, description: true, image: true },
      });
      return {
        ...inquiry,
        service: service || { id: inquiry.serviceId, title: "Unknown Service", description: "" },
        createdAt: inquiry.createdAt.toISOString(),
      };
    })
  );

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
            <div className="flex flex-col gap-6 p-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-[#7a219f] dark:text-[#efcafe]">
                    Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Here's your wellness overview
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/user-dashboard/book">
                    <button className="inline-flex items-center justify-center rounded-lg bg-[#7a219f] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#7a219f]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]">
                      Book Appointment
                    </button>
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <SectionCards stats={stats} />

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Appointments & Charts */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Upcoming Appointments Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                      <h2 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe]">
                        Schedule
                      </h2>
                    </div>
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

                  {/* Treatment History Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                      <h2 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe]">
                        Your Journey
                      </h2>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <TreatmentTimelineChart
                        data={timeline.length ? timeline : [{ month: "—", treatments: 0 }]}
                      />
                      <ChartPieDonutActive data={spendingPie} />
                    </div>
                  </div>
                </div>

                {/* Right Column - Personalization */}
                <div className="space-y-6">
                  {/* Personalized Recommendations */}
                  <Card className="border-border/60 bg-linear-to-br from-[#7a219f]/5 to-primary/5 dark:from-[#efcafe]/10 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                        <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
                          For You
                        </CardTitle>
                      </div>
                      <CardDescription>Personalized recommendations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Recommended Treatment */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]">
                            Recommended
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#7a219f]/10 text-[#7a219f] dark:bg-[#efcafe]/20 dark:text-[#efcafe]">
                            Suggested
                          </span>
                        </div>
                        <p className="text-base font-medium text-[#7a219f] dark:text-[#efcafe]">
                          {recommended}
                        </p>
                      </div>

                      {/* Maintenance Plan */}
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40">
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Maintenance Plan
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Book every 8-12 weeks to maintain optimal results.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Next Appointment Status */}
                      <div className="p-4 rounded-lg border border-border/60 bg-card">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                          Next Appointment
                        </p>
                        <p className="text-xl font-semibold text-[#7a219f] dark:text-[#efcafe]">
                          {countdown.countdown}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {countdown.detail}
                        </p>
                        {countdown.countdown === "—" && (
                          <Link href="/user-dashboard/book" className="mt-3">
                            <button className="w-full inline-flex items-center justify-center rounded-lg bg-[#7a219f] px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#7a219f]/90 dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]">
                              Book Now
                            </button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions Card */}
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-[#7a219f] dark:text-[#efcafe] text-base">
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/user-dashboard/appointments" className="block">
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent hover:text-black transition-colors flex items-center justify-between group">
                          <span className="text-sm">View appointments</span>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">→</span>
                        </button>
                      </Link>
                      <Link href="/user-dashboard/treatments" className="block">
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent hover:text-black transition-colors flex items-center justify-between group">
                          <span className="text-sm">View treatment history</span>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">→</span>
                        </button>
                      </Link>
                      <Link href="/user-dashboard?view=profile" className="block">
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent hover:text-black transition-colors flex items-center justify-between group">
                          <span className="text-sm">Update preferences</span>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">→</span>
                        </button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* My Inquiries */}
                  <UserInquiriesSection inquiries={inquiriesWithServices} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
