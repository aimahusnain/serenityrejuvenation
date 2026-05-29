import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "My Dashboard - Serenity Rejuvenation",
  description: "Manage your spa appointments and preferences",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50/50 dark:bg-[#07264f]">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
