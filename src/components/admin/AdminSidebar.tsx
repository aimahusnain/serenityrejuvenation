"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Package,
  Settings,
  LogOut,
  TrendingUp,
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

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Appointments",
      url: "/admin?tab=appointments",
      icon: Calendar,
    },
    {
      title: "Clients",
      url: "/admin?tab=clients",
      icon: Users,
    },
    {
      title: "Revenue",
      url: "/admin?tab=revenue",
      icon: DollarSign,
    },
    {
      title: "Services",
      url: "/admin?tab=services",
      icon: Package,
    },
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#e3ae72] text-[#07264f] dark:bg-[#07264f] dark:text-[#e3ae72]">
                  <TrendingUp className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-[#07264f] dark:text-[#e3ae72]">
                    Admin
                  </span>
                  <span className="text-[10px] text-[#07264f]/60 dark:text-[#e3ae72]/60">
                    Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              disabled={isPending}
              className="cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>{isPending ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
