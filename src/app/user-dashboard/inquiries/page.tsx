import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SpaAppSidebar } from "@/components/account/SpaAppSidebar";
import UserInquiriesPage from "@/components/user-dashboard/UserInquiriesPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default async function UserInquiriesLayout() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's inquiries
  const inquiries = await prisma.serviceInquiry.findMany({
    where: { userId: session.user.id },
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
  });

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
      <SpaAppSidebar />
      <SidebarInset className="flex flex-1 flex-col bg-white dark:bg-[#271024]">
        <SiteHeader title="My Inquiries" />
        <div className="flex-1 overflow-auto bg-[#f8f9fa]/50 dark:bg-[#271024]/30">
          <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <Suspense fallback={<div className="text-muted-foreground text-sm">Loading inquiries…</div>}>
              <UserInquiriesPage inquiries={inquiriesWithServices} />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
