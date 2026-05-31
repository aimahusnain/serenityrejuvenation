import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SpaAppSidebar } from "@/components/account/SpaAppSidebar";
import { SiteHeader } from "@/components/account/SiteHeader";
import { UserDashboardShell } from "@/components/user-dashboard/UserDashboardShell";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function UserDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [user, products] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        bookings: { orderBy: { date: "desc" } },
        preferences: true,
      },
    }),
    prisma.product.findMany({ orderBy: { title: "asc" } }),
  ]);

  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <SpaAppSidebar />
      <SidebarInset className="flex flex-1 flex-col bg-muted/20">
        <SiteHeader title="Client Panel" />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <Suspense fallback={<div className="text-muted-foreground text-sm">Loading…</div>}>
              <UserDashboardShell
                user={user}
                products={products.map((p) => ({
                  id: p.id,
                  title: p.title,
                  price: p.price,
                  description: p.description,
                }))}
              />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
