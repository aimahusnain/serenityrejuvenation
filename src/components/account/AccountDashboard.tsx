"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransition } from "react";
import { logout } from "@/app/actions/auth";
import ProfileSection from "./ProfileSection";
import BookingsSection from "./BookingsSection";
import PreferencesSection from "./PreferencesSection";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  bookings: any[];
  preferences: any;
}

interface Props {
  user: User;
}

export default function AccountDashboard({ user }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#07264f] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#07264f] dark:text-[#e3ae72]">
              My Account
            </h1>
            <p className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
              Welcome back, {user.name || "there"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isPending}
            className="border-[#07264f]/20 dark:border-[#e3ae72]/30 text-[#07264f] dark:text-[#e3ae72] hover:bg-[#07264f]/5 dark:hover:bg-[#e3ae72]/10"
          >
            {isPending ? "Signing out..." : "Sign Out"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-[#07264f]/5 dark:bg-[#e3ae72]/10">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-[#07264f] data-[state=active]:text-white dark:data-[state=active]:bg-[#e3ae72] dark:data-[state=active]:text-[#07264f]"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection user={user} />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsSection bookings={user.bookings} />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesSection preferences={user.preferences} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
