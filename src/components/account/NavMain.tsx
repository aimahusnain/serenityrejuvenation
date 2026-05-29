"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url.includes("?")) {
      const [baseUrl] = url.split("?");
      return pathname.startsWith(baseUrl);
    }
    if (url.includes("#")) {
      return pathname === url.replace(/#.*$/, "");
    }
    return pathname === url;
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className="cursor-pointer data-[active=true]:bg-[#07264f]/10 data-[active=true]:text-[#07264f] dark:data-[active=true]:bg-[#e3ae72]/10 dark:data-[active=true]:text-[#e3ae72]"
            data-active={isActive(item.url)}
          >
            <a href={item.url}>
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
