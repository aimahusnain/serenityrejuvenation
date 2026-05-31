import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist } from "next/font/google";
import "./globals.css";

import LenisProvider from "@/components/LenisProvider";
import SpaLoader from "@/components/loader";
import ThemeContextProvider from "@/components/ThemeContextProvider";

import { ProductsProvider } from "@/components/ProductsProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { prisma } from "@/lib/prisma";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title:  "Serenity Rejuvenation",
  description: "Luxury hydration spa focused on restore, rebalance, and renew.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className="antialiased bg-white dark:bg-[#07264f]">
      <TooltipProvider>
        <SessionProvider session={session}>
          <ThemeContextProvider>
            <ProductsProvider initialProducts={products}>
              <SpaLoader />

              <LenisProvider>{children}</LenisProvider>
            </ProductsProvider>
          </ThemeContextProvider>
        </SessionProvider>
      </TooltipProvider>
      </body>
    </html>
  );
}
