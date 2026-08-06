import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MyAppointments } from "@/components/user-dashboard/MyAppointments";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function MyAppointmentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [user, products] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { bookings: { orderBy: { date: "desc" } } },
    }),
    prisma.product.findMany({ orderBy: { title: "asc" } }),
  ]);

  if (!user) redirect("/login");

  const productLite = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
  }));

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="bg-[#26043e]!"
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 p-6">
              <MyAppointments
                bookings={user.bookings}
                products={productLite}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
