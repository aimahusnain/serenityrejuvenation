import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const fontSans = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Serenity Rejuvenation",
  description:
    "Luxury hydration spa focused on restore, rebalance, and renew.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body
        className="antialiased bg-[#ecf4dd]"
      >
        {children}
      </body>
    </html>
  );
}