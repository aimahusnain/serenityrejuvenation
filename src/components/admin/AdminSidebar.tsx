"use client";

import * as React from "react";
import { Suspense } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Package,
  LogOut,
  TrendingUp,
  Heart,
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
import { NavMain } from "@/components/account/NavMain";
import Link from "next/link";

const data = {
  navMain: [
    { title: "Overview", url: "/admin?view=overview", icon: LayoutDashboard, view: "overview" },
    { title: "Appointments", url: "/admin?view=appointments", icon: Calendar, view: "appointments" },
    { title: "Clients", url: "/admin?view=clients", icon: Users, view: "clients" },
    { title: "Services", url: "/admin?view=services", icon: Package, view: "services" },
    { title: "Finance", url: "/admin?view=finance", icon: DollarSign, view: "finance" },
    { title: "Inquiries", url: "/admin?view=inquiries", icon: MessageSquare, view: "inquiries" },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    : session?.user?.email?.[0].toUpperCase() || "A";

  return (
    <Sidebar collapsible="icon" side="left" className="border-r border-[#271024]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]" {...props}>
      <SidebarHeader className="border-b border-[#271024]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3ae72] to-[#d49e5e] text-[#271024] shadow-lg">
                  <TrendingUp className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-[#271024] dark:text-[#e3ae72]">
                    Admin
                  </span>
                  <span className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">
                    Management Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#f8f9fa]/50 dark:bg-[#271024]/30">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-[#271024]/60 dark:text-[#e3ae72]/60 px-3 mb-2">
            MENU
          </p>
          <Suspense fallback={null}>
            <NavMain items={data.navMain} />
          </Suspense>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#271024]/10 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]">
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
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e3ae72] to-[#d49e5e] text-[#271024]">
                  <span className="text-xs font-bold">{userInitials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">
                    {session?.user?.name || "Admin"}
                  </span>
                  <span className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/60">
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
