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
    <SidebarProvider>
      <SpaAppSidebar />
      <SidebarInset className="flex-1 flex flex-col bg-gray-50/50 dark:bg-[#07264f]">
        <SiteHeader title="My Dashboard" />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 space-y-6">
            <StatCards bookings={user.bookings} user={user} />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SpaAppointments bookings={user.bookings} />
              </div>
              <div className="lg:col-span-1">
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-[#07264f]/50 border-0 shadow-sm">
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
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile" className="mt-4">
                    <ProfileSection user={user} />
                  </TabsContent>
                  <TabsContent value="preferences" className="mt-4">
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
