import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SpaLoader from "@/components/loader";
import LenisProvider from "@/components/LenisProvider";
import Header from "@/components/Header";
import ThemeContextProvider from "@/components/ThemeContextProvider";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Serenity Rejuvenation",
  description: "Luxury hydration spa focused on restore, rebalance, and renew.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <head>
        {/* 🔥 Prevent scroll BEFORE React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.scrollTo(0, 0);
              document.documentElement.style.scrollBehavior = 'auto';
              document.documentElement.style.overflow = 'hidden';
              document.body && (document.body.style.overflow = 'hidden');
            `,
          }}
        />
      </head>

      <body className="antialiased bg-[ecf4dd] dark:bg-black">
        <ThemeContextProvider>
          <Header />

          <SpaLoader />

          <LenisProvider>{children}</LenisProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
