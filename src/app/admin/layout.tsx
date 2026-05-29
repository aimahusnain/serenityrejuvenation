import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Admin Dashboard - Serenity Rejuvenation",
  description: "Manage your spa business",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
