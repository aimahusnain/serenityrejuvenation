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
import { useProducts } from "@/components/ProductsProvider";
import UserMenu from "@/components/UserMenu";
import { getHeaderThemeClasses, type HeaderVariant } from "@/lib/header-home-theme";

export default function Header({ variant = "default" }: { variant?: HeaderVariant }) {
  const products = useProducts();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const t = getHeaderThemeClasses(variant);
  const isHome = variant === "home";

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <nav className={t.nav}>
      <div className="flex h-24 max-w-full items-center justify-between px-2">
        {/* Desktop Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {/* Services */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={t.menuTrigger}>
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent className={t.menuContent}>
                <div className={cn("grid w-220 grid-cols-3 gap-4 p-6", t.menuGrid)}>
                  {products.map((service) => {
                    const price = Number(service.price ?? 0);
                    const bookUrl = session?.user
                      ? `/user-dashboard/book?service=${service.id}`
                      : `/login?redirect=/user-dashboard/book?service=${service.id}`;
                    return (
                      <Link
                        key={service.title}
                        href={bookUrl}
                        className={t.serviceCard}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={t.serviceTitle}>
                              {service.title}
                            </h4>
                            <p className={t.serviceDesc}>
                              {service.description}
                            </p>
                          </div>
                          <div className="text-right ml-2 max-w-15">
                            <p className={t.price}>
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
                    isHome
                      ? t.menuTrigger
                      : "text-[#efcafe] hover:bg-[#efcafe]/10",
                  )}
                >
                  Gallery
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Link href="/" className="flex items-center space-x-2 mr-18">
          <Image
            src="/logo_dark.png"
            alt="Serenity Rejuvenation"
            className="max-h-full"
            width={130}
            height={200}
          />
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {session ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hidden cursor-pointer sm:flex",
                    isHome
                      ? t.ghostBtn
                      : "text-[#efcafe] hover:bg-[#efcafe]/10",
                  )}
                >
                  <User className="mr-2 size-4" />
                  Account
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="sm"
                  className={cn(
                    "sm:flex hidden",
                    isHome
                      ? t.primaryBtn
                      : "bg-[#efcafe] hover:bg-[#f7e0ac]/90 text-[#2d063f]",
                  )}
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
                className={cn(
                  isHome
                    ? t.ghostBtn
                    : "text-[#efcafe] hover:bg-[#efcafe]/10",
                )}
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={t.sheet}
            >
              {/* Header */}
              <div className={t.sheetHeader}>
                {/* Light mode logo */}
                <Image
                  src="/logo_light.png"
                  alt="Serenity Rejuvenation"
                  width={100}
                  height={60}
                  className="object-contain"
                />
              </div>

              {/* Scrollable nav body */}
              <div className="flex-1 overflow-y-auto py-2">
                {/* Services accordion */}
                <Accordion type="single" collapsible defaultValue="services">
                  <AccordionItem value="services" className="border-none">
                    <AccordionTrigger className={t.accordionTrigger}>
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
                              className={t.mobileServiceCard}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span
                                  className={cn(
                                    "text-xs font-medium leading-snug",
                                    isHome
                                      ? "text-[var(--home-text)]"
                                      : "text-[#efcafe]",
                                  )}
                                >
                                  {service.title}
                                </span>
                                <span
                                  className={cn(
                                    "text-[11px] font-medium whitespace-nowrap pt-px",
                                    isHome ? "text-[var(--home-accent)]" : "text-[#efcafe]",
                                  )}
                                >
                                  {service.price ? `$${service.price}.00` : "Contact"}
                                </span>
                              </div>
                              <p
                                className={cn(
                                  "text-[11px] leading-relaxed line-clamp-2",
                                  isHome
                                    ? "text-[var(--home-text)]/55"
                                    : "text-[#efcafe]/55",
                                )}
                              >
                                {service.description}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className={t.mobileDivider} />

                <Link
                  href="/gallery"
                  className={t.mobileLink}
                >
                  Gallery
                </Link>
              </div>

              {/* Footer actions */}
              <div className={t.sheetFooter}>
                {session ? (
                  <>
                    <Link href={session.user.role === "ADMIN" ? "/admin" : "/user-dashboard"} onClick={() => setTimeout(() => {}, 0)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(t.outlineBtn, "mb-2")}
                      >
                        <User className="mr-2 size-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/user-dashboard" onClick={() => setTimeout(() => {}, 0)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(t.outlineBtn, "mb-2")}
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
                      className={t.outlineBtn}
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
                        className={cn(t.outlineBtn, "mb-2")}
                      >
                        <User className="mr-2 size-4" />
                        Account
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setTimeout(() => {}, 0)}>
                      <Button
                        size="sm"
                        className={cn("w-full", isHome ? t.primaryBtn : "bg-[#efcafe] hover:bg-[#f7e0ac]/90 text-[#2d063f]")}
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
