"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, Shield } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  user: User;
}

export default function ProfileSection({ user }: Props) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
      <CardHeader>
        <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Profile Information</CardTitle>
        <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
          Your personal account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <User className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Full Name
            </Label>
            <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
              {user.name || "Not set"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Mail className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Email Address
            </Label>
            <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
              {user.email || "Not set"}
            </p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Shield className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Account Role
            </Label>
            <p className="mt-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === "ADMIN"
                    ? "bg-[#e3ae72] text-[#07264f]"
                    : "bg-[#07264f]/10 text-[#07264f] dark:bg-[#e3ae72]/20 dark:text-[#e3ae72]"
                }`}
              >
                {user.role}
              </span>
            </p>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Calendar className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Member Since
            </Label>
            <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07264f]/8 dark:bg-[#e3ae72]/20">
            <Calendar className="h-5 w-5 text-[#07264f] dark:text-[#e3ae72]" />
          </div>
          <div className="flex-1">
            <Label className="text-[#07264f]/60 dark:text-[#e3ae72]/60 text-xs font-semibold uppercase tracking-wider">
              Last Updated
            </Label>
            <p className="text-[#07264f] dark:text-[#e3ae72]/90 font-medium mt-1">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
