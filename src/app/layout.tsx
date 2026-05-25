import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SpaLoader from "@/components/loader";
import LenisProvider from "@/components/LenisProvider";
import Header from "@/components/Header";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Serenity Rejuvenation",
  description: "Luxury hydration spa focused on restore, rebalance, and renew.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className="antialiased bg-[ecf4dd]">
        <Header />
        <SpaLoader />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
