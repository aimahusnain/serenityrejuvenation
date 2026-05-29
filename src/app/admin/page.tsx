import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [users, bookings, userCount, bookingCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
    }),
    prisma.booking.findMany({
      orderBy: { date: "desc" },
      take: 20,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.user.count(),
    prisma.booking.count(),
  ]);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <main className="min-h-screen bg-white dark:bg-[#07264f] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#07264f] dark:text-[#e3ae72]">Admin Dashboard</h1>
          <p className="text-[#07264f]/60 dark:text-[#e3ae72]/65 mt-2">
            Manage users and bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
                Total Users
              </CardDescription>
              <Users className="h-4 w-4 text-[#07264f] dark:text-[#e3ae72]" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-[#07264f] dark:text-[#e3ae72]">
                {userCount}
              </CardTitle>
            </CardContent>
          </Card>

          <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
                Total Bookings
              </CardDescription>
              <Calendar className="h-4 w-4 text-[#07264f] dark:text-[#e3ae72]" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-[#07264f] dark:text-[#e3ae72]">
                {bookingCount}
              </CardTitle>
            </CardContent>
          </Card>

          <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
                Pending Actions
              </CardDescription>
              <Clock className="h-4 w-4 text-[#07264f] dark:text-[#e3ae72]" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl text-[#07264f] dark:text-[#e3ae72]">
                {pendingCount}
              </CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72] mb-4">
            Recent Users
          </h2>
          <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#07264f]/5 dark:bg-[#e3ae72]/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Bookings
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#07264f]/10 dark:divide-[#e3ae72]/10">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#07264f]/5 dark:hover:bg-[#e3ae72]/5">
                        <td className="px-4 py-3 text-sm text-[#07264f] dark:text-[#e3ae72]/90">
                          {user.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#07264f] dark:text-[#e3ae72]/90">
                          {user.email || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-[#e3ae72] text-[#07264f]"
                                : "bg-[#07264f]/10 text-[#07264f] dark:bg-[#e3ae72]/20 dark:text-[#e3ae72]"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#07264f] dark:text-[#e3ae72]/90">
                          {user._count.bookings}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#07264f] dark:text-[#e3ae72]/90">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <div>
          <h2 className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72] mb-4">
            Recent Bookings
          </h2>
          <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#07264f]/5 dark:bg-[#e3ae72]/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Service ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#07264f] dark:text-[#e3ae72] uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#07264f]/10 dark:divide-[#e3ae72]/10">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-[#07264f]/5 dark:hover:bg-[#e3ae72]/5">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-[#07264f] dark:text-[#e3ae72]/90">
                              {booking.user.name || "—"}
                            </p>
                            <p className="text-xs text-[#07264f]/60 dark:text-[#e3ae72]/60">
                              {booking.user.email || "—"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#07264f] dark:text-[#e3ae72]/90">
                          {booking.serviceId}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#07264f] dark:text-[#e3ae72]/90">
                          {new Date(booking.date).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "CONFIRMED"
                                ? "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400"
                                : booking.status === "PENDING"
                                ? "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400"
                                : booking.status === "CANCELLED"
                                ? "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400"
                                : "bg-[#07264f]/10 text-[#07264f] dark:bg-[#e3ae72]/20 dark:text-[#e3ae72]"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
