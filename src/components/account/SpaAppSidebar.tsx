"use client";

import * as React from "react";
import {
  Calendar,
  Home,
  User,
  Settings,
  Heart,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/account",
      icon: Home,
    },
    {
      title: "My Bookings",
      url: "/account?tab=bookings",
      icon: Calendar,
    },
    {
      title: "Profile",
      url: "/account?tab=profile",
      icon: User,
    },
    {
      title: "Preferences",
      url: "/account?tab=preferences",
      icon: Settings,
    },
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#07264f] text-white dark:bg-[#e3ae72] dark:text-[#07264f]">
                  <Heart className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-[#07264f] dark:text-[#e3ae72]">
                    Serenity
                  </span>
                  <span className="text-[10px] text-[#07264f]/60 dark:text-[#e3ae72]/60">
                    {session?.user?.role === "ADMIN" ? "Admin" : "Member"}
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
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild className="cursor-pointer">
              <a href="/account">
                <div className="flex size-6 items-center justify-center rounded-md bg-[#07264f]/10 text-[#07264f] dark:bg-[#e3ae72]/20 dark:text-[#e3ae72]">
                  {userInitials}
                </div>
                <span className="text-xs font-medium text-[#07264f] dark:text-[#e3ae72]">
                  {session?.user?.name || "User"}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
