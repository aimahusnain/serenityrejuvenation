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
    <SidebarGroup className="min-h-[75%]">
      <SidebarGroupContent className="flex flex-col gap-2 flex-1 min-h-0 h-full">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link href="/user-dashboard/book">
            <SidebarMenuButton
              tooltip="Book Appointment"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
              <CirclePlusIcon />
              <span>Book Appointment</span>
            </SidebarMenuButton>
              </Link>
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
        <SidebarMenu className="flex-1 flex flex-col min-h-0">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="flex-1 min-h-0">
              <Link href={item.url} className="group relative h-full flex">
                <SidebarMenuButton
                  className="h-full w-full flex items-end overflow-hidden px-4 py-4 font-extrabold cursor-pointer uppercase hover:text-white text-white"
                  tooltip={item.title}
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* dark overlay */}
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/5" />

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