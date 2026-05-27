import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import SpaLoader from "@/components/loader";
import LenisProvider from "@/components/LenisProvider";
import Header from "@/components/Header";
import ThemeContextProvider from "@/components/ThemeContextProvider";
import Footer from "@/components/Footer";

import { prisma } from "@/lib/prisma";
import { ProductsProvider } from "@/components/ProductsProvider";

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
  // ✅ FETCH ONCE HERE
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className="antialiased bg-white dark:bg-[#07264f]">
        <ThemeContextProvider>
          <ProductsProvider initialProducts={products}>
            <Header />

            <SpaLoader />

            <LenisProvider>{children}</LenisProvider>

            <Footer />
          </ProductsProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
