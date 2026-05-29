import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AccountDashboard from "@/components/account/AccountDashboard";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        orderBy: { date: "desc" },
      },
      preferences: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <AccountDashboard user={user} />;
}
