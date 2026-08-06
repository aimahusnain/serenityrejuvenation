"use client";

import * as React from "react";
import { Suspense } from "react";
import {
  Calendar,
  Home,
  User,
  Heart,
  LogOut,
  CalendarPlus,
  History,
  CreditCard,
  Gift,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { logout } from "@/app/actions/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import Link from "next/link";

const data = {
  navMain: [
    { title: "Overview", url: "/user-dashboard?view=overview", icon: Home, view: "overview" },
    { title: "My Appointments", url: "/user-dashboard/appointments", icon: Calendar, view: "appointments" },
    { title: "Book Appointment", url: "/user-dashboard?view=book", icon: CalendarPlus, view: "book" },
    { title: "My Inquiries", url: "/user-dashboard/inquiries", icon: MessageSquare, view: "inquiries" },
    { title: "Treatment History", url: "/user-dashboard/treatments", icon: History, view: "treatments" },
    { title: "Payments", url: "/user-dashboard/payments", icon: CreditCard, view: "payments" },
    { title: "Profile", url: "/user-dashboard?view=profile", icon: User, view: "profile" },
    { title: "Loyalty", url: "/user-dashboard?view=loyalty", icon: Gift, view: "loyalty" },
  ],
};

export function SpaAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() || "U";

  return (
    <Sidebar collapsible="icon" side="left" className="border-r border-border/60" {...props}>
      <SidebarHeader className="border-b border-border/60 bg-card">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7a219f] to-[#0a3a66] text-white dark:from-[#efcafe] dark:to-[#7a219f] shadow-lg">
                  <Heart className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-[#7a219f] dark:text-[#efcafe]">
                    Serenity
                  </span>
                  <span className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                    {session?.user?.role === "ADMIN" ? "Admin Panel" : "Member Dashboard"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-muted/30">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 mb-2">
            MENU
          </p>
          <Suspense fallback={null}>
            <NavMain items={data.navMain} />
          </Suspense>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#7a219f]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              disabled={isPending}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="size-4" />
              <span>{isPending ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild className="cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7a219f] to-[#0a3a66] text-white dark:from-[#efcafe] dark:to-[#7a219f]">
                  <span className="text-xs font-bold">{userInitials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]">
                    {session?.user?.name || "User"}
                  </span>
                  <span className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

