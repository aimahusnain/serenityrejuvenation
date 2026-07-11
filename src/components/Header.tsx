"use client";

import Link from "next/link";
import { User, LogIn, Menu, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { logout } from "@/app/actions/auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { useProducts } from "@/components/ProductsProvider";
import UserMenu from "@/components/UserMenu";

export default function Header() {
  const products = useProducts();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <nav className="mx-8 sticky top-2 z-50 rounded-lg bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:bg-[#271024]/95 dark:supports-backdrop-filter:bg-[#271024]/80 border border-[#271024]/10 dark:border-[#e3ae72]/15">
      <div className="flex h-24 max-w-full items-center justify-between px-2">
        {/* Desktop Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {/* Services */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-[#271024] hover:bg-[#271024]/8 dark:text-[#e3ae72] dark:hover:bg-[#e3ae72]/10">
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white dark:bg-[#271024] dark:border-[#e3ae72]/15">
                <div className="grid w-220 grid-cols-3 gap-4 p-6 bg-white dark:bg-[#271024] dark:border-[#e3ae72]/15">
                  {products.map((service) => {
                    const price = Number(service.price ?? 0);
                    const bookUrl = session?.user
                      ? `/user-dashboard/book?service=${service.id}`
                      : `/login?redirect=/user-dashboard/book?service=${service.id}`;
                    return (
                      <Link
                        key={service.title}
                        href={bookUrl}
                        className="group rounded-lg border border-[#271024]/15 dark:border-[#e3ae72]/20 p-4 hover:border-[#271024]/40 dark:hover:border-[#e3ae72]/50 hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/8 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#271024] dark:text-[#e3ae72] text-sm leading-tight">
                              {service.title}
                            </h4>
                            <p className="text-xs text-[#271024]/55 dark:text-[#e3ae72]/60 mt-1 line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                          <div className="text-right ml-2 max-w-15">
                            <p className="text-xs font-semibold text-[#e3ae72]">
                              {price > 0 ? (
                                `$${price.toFixed(0)}`
                              ) : (
                                <Link
                                  href="/contact"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs font-bold italic hover:underline"
                                >
                                  Contact
                                </Link>
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Gallery */}
            <NavigationMenuItem>
              <Link href="/gallery" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-[#271024] hover:bg-[#271024]/8 dark:text-[#e3ae72] dark:hover:bg-[#e3ae72]/10",
                  )}
                >
                  Gallery
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Link href="/" className="flex items-center space-x-2 mr-18">
          {/* Light mode logo */}
          <Image
            src="/logo_dark.png"
            alt="Serenity Rejuvenation"
            className="max-h-full dark:hidden"
            width={130}
            height={200}
          />
          {/* Dark mode logo */}
          <Image
            src="/logo_light.png"
            alt="Serenity Rejuvenation"
            className="max-h-full hidden dark:block"
            width={130}
            height={200}
          />
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <AnimatedThemeToggler />

          {session ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden cursor-pointer sm:flex text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/8 dark:hover:bg-[#e3ae72]/10"
                >
                  <User className="mr-2 size-4" />
                  Account
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="sm"
                  className="sm:flex hidden bg-[#271024] hover:bg-[#271024]/80 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
                >
                  <LogIn className="mr-2 size-4" />
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Navigation Sheet */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/8 dark:hover:bg-[#e3ae72]/10"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-white dark:bg-[#271024] p-0 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#271024]/15 dark:border-[#e3ae72]/20">
                {/* Light mode logo */}
                <Image
                  src="/logo_dark.png"
                  alt="Serenity Rejuvenation"
                  width={100}
                  height={60}
                  className="object-contain dark:hidden"
                />
                {/* Dark mode logo */}
                <Image
                  src="/logo_light.png"
                  alt="Serenity Rejuvenation"
                  width={100}
                  height={60}
                  className="object-contain hidden dark:block"
                />
              </div>

              {/* Scrollable nav body */}
              <div className="flex-1 overflow-y-auto py-2">
                {/* Services accordion */}
                <Accordion type="single" collapsible defaultValue="services">
                  <AccordionItem value="services" className="border-none">
                    <AccordionTrigger className="px-5 py-3 text-sm font-medium text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10 hover:no-underline rounded-none">
                      Services
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <div className="flex flex-col gap-1 px-3">
                        {products.map((service) => {
                          const bookUrl = session?.user
                            ? `/user-dashboard/book?service=${service.id}`
                            : `/login?redirect=/user-dashboard/book?service=${service.id}`;
                          return (
                            <Link
                              key={service.id}
                              href={bookUrl}
                              className="rounded-xl border border-[#271024]/15 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]/50 px-3 py-2.5 hover:border-[#271024]/30 dark:hover:border-[#e3ae72]/40 hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/8 transition-all cursor-pointer"
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="text-xs font-medium text-[#271024] dark:text-[#e3ae72] leading-snug">
                                  {service.title}
                                </span>
                                <span className="text-[11px] font-medium text-[#e3ae72] whitespace-nowrap pt-px">
                                  {service.price ? `$${service.price}.00` : "Contact"}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#271024]/55 dark:text-[#e3ae72]/55 leading-relaxed line-clamp-2">
                                {service.description}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="h-px bg-[#271024]/10 dark:bg-[#e3ae72]/15 mx-5 my-1" />

                <Link
                  href="/gallery"
                  className="flex items-center px-5 py-3 text-sm font-medium text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10 transition-colors"
                >
                  Gallery
                </Link>
              </div>

              {/* Footer actions */}
              <div className="border-t border-[#271024]/15 dark:border-[#e3ae72]/20 p-4">
                {session ? (
                  <>
                    <Link href={session.user.role === "ADMIN" ? "/admin" : "/user-dashboard"} onClick={() => setTimeout(() => {}, 0)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10 mb-2"
                      >
                        <User className="mr-2 size-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/user-dashboard" onClick={() => setTimeout(() => {}, 0)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10 mb-2"
                      >
                        <User className="mr-2 size-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      disabled={isPending}
                      className="w-full border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10"
                    >
                      <LogOut className="mr-2 size-4" />
                      {isPending ? "Signing out..." : "Sign Out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setTimeout(() => {}, 0)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10 mb-2"
                      >
                        <User className="mr-2 size-4" />
                        Account
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setTimeout(() => {}, 0)}>
                      <Button
                        size="sm"
                        className="w-full bg-[#271024] hover:bg-[#271024]/80 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
                      >
                        <LogIn className="mr-2 size-4" />
                        Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
