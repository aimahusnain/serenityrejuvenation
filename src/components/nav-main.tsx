"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlusIcon, Home } from "lucide-react";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    image: string;
    icon?: React.ReactNode;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Book Appointment"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <CirclePlusIcon />
              <span>Book Appointment</span>
            </SidebarMenuButton>
            <Link href="/user-dashboard">
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <Home />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* IMPORTANT: isolate hover per item */}
              <Link href={item.url} className="group relative">
                <SidebarMenuButton
                  className="
            relative sm:h-52 h-50 mb-2 mt-2 flex items-end
            w-full overflow-hidden cursor-pointer
            px-4 py-4 font-extrabold uppercase text-white
          "
                  tooltip={item.title}
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* dark overlay */}
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/5" />

                  {/* hover gradient */}
                  {/* <div
            className="
              absolute inset-0
              bg-gradient-to-l from-green-500/40 to-transparent

              translate-x-full
              opacity-0

              group-hover:translate-x-0
              group-hover:opacity-100

              transition-all duration-500 ease-out
            "
          /> */}

                  {/* text */}
                  <span className="relative z-10 w-full text-lg break-words whitespace-normal leading-snug">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
