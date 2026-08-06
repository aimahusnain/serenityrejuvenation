"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  if (!session?.user) return null;

  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session.user.email?.[0].toUpperCase() || "U";

  const dashboardPath = session.user.role === "ADMIN" ? "/admin" : "/user-dashboard";

  return (
    <div className="flex items-center gap-3">
      {/* Dashboard Button */}
      <Link href={dashboardPath}>
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/8 dark:hover:bg-[#efcafe]/10"
        >
          <LayoutDashboard className="mr-2 size-4" />
          Dashboard
        </Button>
      </Link>

      {/* User Avatar Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 rounded-full bg-[#7a219f] dark:bg-[#efcafe] text-white dark:text-[#7a219f] hover:bg-[#7a219f]/80 dark:hover:bg-[#7a219f] p-0"
          >
            <span className="text-sm font-semibold">{userInitials}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white dark:bg-[#7a219f]"
        >
          <div className="flex items-center justify-start gap-2 px-2 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7a219f]/10 dark:bg-[#efcafe]/20 text-[#7a219f] dark:text-[#efcafe]">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]">
                {session.user.name || "User"}
              </span>
              <span className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                {session.user.email}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-[#7a219f]/10 dark:bg-[#efcafe]/10" />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href={dashboardPath}
                className="flex cursor-pointer items-center gap-2 text-sm text-[#7a219f] dark:text-[#efcafe]/80 hover:text-[#7a219f] dark:hover:text-[#efcafe]"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/user-dashboard"
                className="flex cursor-pointer items-center gap-2 text-sm text-[#7a219f] dark:text-[#efcafe]/80 hover:text-[#7a219f] dark:hover:text-[#efcafe]"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/user-dashboard?tab=preferences"
                className="flex cursor-pointer items-center gap-2 text-sm text-[#7a219f] dark:text-[#efcafe]/80 hover:text-[#7a219f] dark:hover:text-[#efcafe]"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-[#7a219f]/10 dark:bg-[#efcafe]/10" />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isPending}
            className="flex cursor-pointer items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            <span>{isPending ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
