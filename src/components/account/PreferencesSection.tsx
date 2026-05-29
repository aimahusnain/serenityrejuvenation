"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Phone, Heart } from "lucide-react";

interface Preferences {
  id: string;
  emailNotifications: boolean;
  phone?: string | null;
  preferredServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  preferences: Preferences | null;
}

export default function PreferencesSection({ preferences }: Props) {
  if (!preferences) {
    return (
      <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
        <CardHeader>
          <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Preferences</CardTitle>
          <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
            Your account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-12 w-12 text-[#07264f]/30 dark:text-[#e3ae72]/30 mb-4" />
            <h3 className="text-lg font-semibold text-[#07264f] dark:text-[#e3ae72] mb-2">
              No preferences set
            </h3>
            <p className="text-sm text-[#07264f]/60 dark:text-[#e3ae72]/65 max-w-xs">
              Your preferences haven&apos;t been configured yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
      <CardHeader>
        <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Preferences</CardTitle>
        <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
          Manage your account settings and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Bell className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Email Notifications
            </Label>
            <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
              {preferences.emailNotifications ? "Enabled" : "Disabled"}
            </p>
            <p className="text-xs text-[#07264f]/50 dark:text-[#e3ae72]/50 mt-1">
              Receive updates about your bookings and special offers
            </p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Phone className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Phone Number
            </Label>
            <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
              {preferences.phone || "Not set"}
            </p>
            <p className="text-xs text-[#07264f]/50 dark:text-[#e3ae72]/50 mt-1">
              Optional contact number for appointment reminders
            </p>
          </div>
        </div>

        {/* Preferred Services */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Heart className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Preferred Services
            </Label>
            {preferences.preferredServices && preferences.preferredServices.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {preferences.preferredServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#07264f]/10 text-[#07264f] dark:bg-[#e3ae72]/20 dark:text-[#e3ae72]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
                No preferred services selected
              </p>
            )}
            <p className="text-xs text-[#07264f]/50 dark:text-[#e3ae72]/50 mt-1">
              Services you frequently book
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Mail className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Last Updated
            </Label>
            <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
              {new Date(preferences.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
