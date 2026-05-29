import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SiteHeader } from "@/components/account/SiteHeader";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { AdminClientsTable } from "@/components/admin/AdminClientsTable";
import BookingsSection from "@/components/admin/BookingsSection";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all data for admin dashboard
  const [users, bookings, products, stats] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "desc" },
    }),
    prisma.product.findMany({
      orderBy: { title: "asc" },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
    ]),
  ]);

  const [totalUsers, totalBookings, pendingBookings, confirmedBookings, completedBookings] = stats;

  // Calculate revenue (mock calculation based on completed bookings)
  const avgServicePrice = 100; // This would be calculated from actual products
  const totalRevenue = completedBookings * avgServicePrice;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex-1 flex flex-col bg-gray-50/50 dark:bg-[#07264f]">
        <SiteHeader title="Admin Dashboard" />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 space-y-6">
            <AdminStatCards
              totalUsers={totalUsers}
              totalBookings={totalBookings}
              pendingBookings={pendingBookings}
              confirmedBookings={confirmedBookings}
              completedBookings={completedBookings}
              totalRevenue={totalRevenue}
            />

            <Tabs defaultValue="clients" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-[#07264f]/50 border-0 shadow-sm">
                <TabsTrigger
                  value="clients"
                  className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
                >
                  Clients
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
                >
                  Appointments
                </TabsTrigger>
                <TabsTrigger
                  value="revenue"
                  className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
                >
                  Revenue
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
                >
                  Services
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="space-y-4">
                <AdminClientsTable users={users} />
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <BookingsSection bookings={bookings} onUpdate={() => {}} />
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <RevenueOverview bookings={bookings} completedCount={completedBookings} />
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <ServicesManagement products={products} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Revenue Overview Component
function RevenueOverview({ bookings, completedCount }: { bookings: any[], completedCount: number }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-[#07264f]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#07264f]/50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#07264f] dark:text-[#e3ae72] mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#07264f]/5 dark:bg-[#e3ae72]/5 border border-[#07264f]/10 dark:border-[#e3ae72]/15">
            <p className="text-sm text-[#07264f]/60 dark:text-[#e3ae72]/60 font-medium">Today</p>
            <p className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72]">$0.00</p>
          </div>
          <div className="p-4 rounded-lg bg-[#07264f]/5 dark:bg-[#e3ae72]/5 border border-[#07264f]/10 dark:border-[#e3ae72]/15">
            <p className="text-sm text-[#07264f]/60 dark:text-[#e3ae72]/60 font-medium">This Week</p>
            <p className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72]">${(completedCount * 100).toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-[#07264f]/5 dark:bg-[#e3ae72]/5 border border-[#07264f]/10 dark:border-[#e3ae72]/15">
            <p className="text-sm text-[#07264f]/60 dark:text-[#e3ae72]/60 font-medium">This Month</p>
            <p className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72]">${(completedCount * 100).toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-[#07264f]/50 dark:text-[#e3ae72]/50 mt-4">
          * Revenue calculated based on completed appointments
        </p>
      </div>
    </div>
  );
}

// Services Management Component
function ServicesManagement({ products }: { products: any[] }) {
  return (
    <div className="rounded-lg border border-[#07264f]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#07264f]/50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#07264f] dark:text-[#e3ae72]">Services ({products.length})</h3>
        <button className="px-4 py-2 bg-[#07264f] text-white dark:bg-[#e3ae72] dark:text-[#07264f] rounded-lg hover:bg-[#07264f]/80 dark:hover:bg-[#d49e5e] transition-colors font-medium">
          Add Service
        </button>
      </div>
      <div className="space-y-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg border border-[#07264f]/10 dark:border-[#e3ae72]/15 bg-[#07264f]/5 dark:bg-[#e3ae72]/5"
          >
            <div>
              <p className="font-medium text-[#07264f] dark:text-[#e3ae72]/90">{product.title}</p>
              <p className="text-xs text-[#07264f]/60 dark:text-[#e3ae72]/60 line-clamp-1">{product.description}</p>
            </div>
            <p className="text-sm font-semibold text-[#e3ae72]">
              {product.price ? `$${product.price}` : "Contact for pricing"}
            </p>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-8 text-[#07264f]/60 dark:text-[#e3ae72]/60">
            No services available. Add your first service to get started.
          </div>
        )}
      </div>
    </div>
  );
}

