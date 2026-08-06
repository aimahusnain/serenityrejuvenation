"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  view?: string;
}

export interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") ?? "overview";

  const isActive = (item: NavItem) => {
    const [baseUrl, query] = item.url.split("?");
    if (pathname !== baseUrl && !pathname.startsWith(baseUrl)) return false;
    if (item.view) return currentView === item.view;
    if (query?.startsWith("view=")) {
      const v = new URLSearchParams(query).get("view");
      return v ? currentView === v : currentView === "overview";
    }
    return currentView === "overview";
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className="cursor-pointer data-[active=true]:bg-[#7a219f]/10 data-[active=true]:text-[#7a219f] dark:data-[active=true]:bg-[#efcafe]/10 dark:data-[active=true]:text-[#efcafe]"
            data-active={isActive(item)}
          >
            <Link href={item.url}>
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
