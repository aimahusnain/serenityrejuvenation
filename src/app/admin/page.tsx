import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SiteHeader } from "@/components/account/SiteHeader";
import { AdminDashboardShell } from "@/components/admin-dashboard/AdminDashboardShell";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminPage() {
  const [users, bookings, products, counts, inquiries] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.product.findMany({ orderBy: { title: "asc" } }),
    Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]),
    prisma.serviceInquiry.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const [totalUsers, totalBookings, pending, confirmed, completed, cancelled] = counts;

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
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-1 flex-col bg-white dark:bg-[#7a219f]">
        <SiteHeader title="Admin Panel" />
        <div className="flex-1 overflow-auto bg-[#f8f9fa]/50 dark:bg-[#7a219f]/30">
          <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <Suspense fallback={<div className="text-muted-foreground text-sm">Loading…</div>}>
              <AdminDashboardShell
                users={users}
                bookings={bookings}
                products={products.map((p) => ({
                  id: p.id,
                  title: p.title,
                  price: p.price,
                  description: p.description,
                  image: p.image,
                  benefits: p.benefits,
                  requiresInquiry: p.requiresInquiry,
                }))}
                stats={{
                  totalUsers,
                  totalBookings,
                  pending,
                  confirmed,
                  completed,
                  cancelled,
                }}
                inquiries={inquiriesWithServices}
              />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
