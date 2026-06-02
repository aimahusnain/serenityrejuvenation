import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookAppointmentPage } from "@/components/user-dashboard/BookAppointmentPage";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function BookAppointmentPageRoute() {
  const session = await auth();
  // Middleware will handle authentication redirect

  const products = await prisma.product.findMany({
    orderBy: { title: "asc" },
  });

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
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1">
          <BookAppointmentPage services={productLite} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
