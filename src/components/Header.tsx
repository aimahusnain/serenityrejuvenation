"use client";

import Link from "next/link";
import { User, LogIn, Menu } from "lucide-react";
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

const services = [
  {
    title: "Microneedling",
    price: "$350",
    description:
      "Stimulate your skin's natural renewal process with microneedling, an advanced collagen induction treatment designed to improve skin texture, tone, and overall radiance.",
  },
  {
    title: "Microneedling with PRP",
    price: "$600",
    description:
      "Enhance your microneedling results with PRP, utilizing your body's own growth factors to support healing, collagen production, and skin rejuvenation.",
  },
  {
    title: "Microneedling with PRF",
    price: "Contact for pricing",
    description:
      "Take skin rejuvenation to the next level with PRF, an advanced regenerative treatment rich in platelets and growth factors.",
  },
  {
    title: "Microneedling with Sculptra®",
    price: "$600",
    description:
      "Combine collagen induction therapy with Sculptra®, a biostimulatory treatment designed to restore volume and improve firmness.",
  },
  {
    title: "PRP (Platelet-Rich Plasma)",
    price: "Contact for pricing",
    description:
      "PRP therapy utilizes concentrated platelets derived from your own blood that contain growth factors to support skin rejuvenation.",
  },
  {
    title: "PRF (Platelet-Rich Fibrin)",
    price: "Contact for pricing",
    description:
      "An advanced regenerative treatment that contains platelets, fibrin, and growth factors for natural rejuvenation.",
  },
];

export default function Header() {
  return (
    <nav className="mx-8 sticky top-2 z-50 rounded-lg bg-[#ffece0]/95 backdrop-blur supports-backdrop-filter:bg-[#ffece0]/80 dark:bg-black/95">
      <div className="flex h-16 max-w-full items-center justify-between px-2">
        {/* Desktop Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {/* Services */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-neutral-700 hover:bg-[#ffc6a4]/50 dark:text-neutral-300 dark:hover:bg-neutral-800">
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-150 grid-cols-2 gap-4 p-6 bg-white dark:bg-neutral-900">
                  {services.map((service) => (
                    <div
                      key={service.title}
                      className="group rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:border-black/40 dark:hover:border-neutral-600 hover:bg-[#ffc6a4]/50 dark:hover:bg-neutral-800 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-900 dark:text-white text-sm leading-tight">
                            {service.title}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right ml-2 max-w-15">
                          <p className="text-xs font-semibold text-[#2e241e] dark:text-neutral-100">
                            {service.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Gallery */}
            <NavigationMenuItem>
              <Link href="/gallery" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-neutral-700 hover:bg-[#ffc6a4]/50 dark:text-neutral-300 dark:hover:bg-neutral-800",
                  )}
                >
                  Gallery
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Gift Card */}
            <NavigationMenuItem>
              <Link href="/gift-card" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-neutral-700 hover:bg-[#ffc6a4]/50 dark:text-neutral-300 dark:hover:bg-neutral-800",
                  )}
                >
                  Gift Card
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
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-[#ffc6a4]/50"
          >
            <User className="mr-2 size-4" />
            Account
          </Button>
          <Button
            size="sm"
            className="bg-[#2e241e] hover:bg-[#2e241e] text-white dark:bg-black dark:hover:bg-black"
          >
            <LogIn className="mr-2 size-4" />
            <span className="hidden sm:inline">Login</span>
            <span className="sm:hidden">Login</span>
          </Button>

          {/* Mobile Navigation Sheet */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-[#fff8f4] dark:bg-neutral-900 p-0 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0d8c8] dark:border-neutral-700">
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
                    <AccordionTrigger className="px-5 py-3 text-sm font-medium text-[#2e241e] dark:text-neutral-100 hover:bg-[#fce8d8] dark:hover:bg-neutral-800 hover:no-underline rounded-none">
                      Services
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <div className="flex flex-col gap-1 px-3">
                        {services.map((service) => (
                          <div
                            key={service.title}
                            className="rounded-xl border border-[#f0d8c8] dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 hover:border-[#d4a090] dark:hover:border-neutral-600 hover:bg-[#fff8f4] dark:hover:bg-neutral-700 transition-all cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs font-medium text-[#2e241e] dark:text-neutral-100 leading-snug">
                                {service.title}
                              </span>
                              <span className="text-[11px] font-medium text-[#a0634a] dark:text-amber-600 whitespace-nowrap pt-px">
                                {service.price}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8a7068] dark:text-neutral-400 leading-relaxed line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="h-px bg-[#f0d8c8] dark:bg-neutral-700 mx-5 my-1" />

                <Link
                  href="/gallery"
                  className="flex items-center px-5 py-3 text-sm font-medium text-[#2e241e] dark:text-neutral-100 hover:bg-[#fce8d8] dark:hover:bg-neutral-800 transition-colors"
                >
                  Gallery
                </Link>
                <Link
                  href="/gift-card"
                  className="flex items-center px-5 py-3 text-sm font-medium text-[#2e241e] dark:text-neutral-100 hover:bg-[#fce8d8] dark:hover:bg-neutral-800 transition-colors"
                >
                  Gift Card
                </Link>
              </div>

              {/* Footer actions */}
              <div className="border-t border-[#f0d8c8] dark:border-neutral-700 p-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#e5cfc3] dark:border-neutral-700 text-[#2e241e] dark:text-neutral-100 hover:bg-[#fce8d8] dark:hover:bg-neutral-800"
                >
                  <User className="mr-2 size-4" />
                  Account
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-[#2e241e] hover:bg-[#4a3830] dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
                >
                  <LogIn className="mr-2 size-4" />
                  Login
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
