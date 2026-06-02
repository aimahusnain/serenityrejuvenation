"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Clock, CheckCircle, XCircle, Trash2, Shield, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useTransition } from "react";
import UsersSection from "./UsersSection";
import BookingsSection from "./BookingsSection";
import StatsCards from "./StatsCards";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  _count: {
    bookings: number;
  };
}

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface Stats {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
}

interface Props {
  users: User[];
  bookings: Booking[];
  stats: Stats;
}

export default function AdminDashboard({ users, bookings, stats }: Props) {
  const [isPending, startTransition] = useTransition();
  const [usersList, setUsersList] = useState(users);
  const [bookingsList, setBookingsList] = useState(bookings);
  const [currentStats, setCurrentStats] = useState(stats);

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const handleUserUpdate = (updatedUsers: User[]) => {
    setUsersList(updatedUsers);
  };

  const handleBookingUpdate = (updatedBookings: Booking[]) => {
    setBookingsList(updatedBookings);
    // Recalculate stats
    const pendingCount = updatedBookings.filter((b) => b.status === "PENDING").length;
    const confirmedCount = updatedBookings.filter((b) => b.status === "CONFIRMED").length;
    const completedCount = updatedBookings.filter((b) => b.status === "COMPLETED").length;

    setCurrentStats({
      ...currentStats,
      pendingBookings: pendingCount,
      confirmedBookings: confirmedCount,
      completedBookings: completedCount,
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#271024] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#271024] dark:text-[#e3ae72]">
              Admin Dashboard
            </h1>
            <p className="text-[#271024]/60 dark:text-[#e3ae72]/65 mt-2">
              Manage users, bookings, and settings
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isPending}
            className="border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10"
          >
            {isPending ? "Signing out..." : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={currentStats} />

        {/* Main Content */}
        <Tabs defaultValue="users" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 bg-[#271024]/5 dark:bg-[#e3ae72]/10">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-[#271024] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#271024]"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-[#271024] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#271024]"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersSection users={usersList} onUpdate={handleUserUpdate} />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsSection bookings={bookingsList} onUpdate={handleBookingUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
