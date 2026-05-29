import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SpaAppSidebar } from "@/components/account/SpaAppSidebar";
import { SiteHeader } from "@/components/account/SiteHeader";
import { StatCards } from "@/components/account/StatCards";
import { SpaAppointments } from "@/components/account/SpaAppointments";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSection from "@/components/account/ProfileSection";
import PreferencesSection from "@/components/account/PreferencesSection";
import { Suspense } from "react";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        orderBy: { date: "desc" },
      },
      preferences: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 20)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SpaAppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="My Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:gap-6 md:p-6">
            <StatCards bookings={user.bookings} user={user} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4">
                <SpaAppointments bookings={user.bookings} />
              </div>
              <div className="lg:col-span-3">
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-2 bg-[#07264f]/5 dark:bg-[#e3ae72]/10">
                    <TabsTrigger
                      value="profile"
                      className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="preferences"
                      className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
                    >
                      Preferences
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <ProfileSection user={user} />
                  </TabsContent>
                  <TabsContent value="preferences">
                    <PreferencesSection preferences={user.preferences} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
