"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, Shield, Edit2, Check, X } from "lucide-react";
import { updateProfile } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(updateProfile, null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = (formData: FormData) => {
    formData.append("name", name);
    formAction(formData);
  };

  // Reset form state when success
  if (state?.success && isEditing) {
    setIsEditing(false);
    router.refresh();
  }

  const handleCancel = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setIsEditing(false);
    setSaveStatus("idle");
  };

  return (
    <Card className="border-[#07264f]/10 dark:border-[#e3ae72]/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[#07264f] dark:text-[#e3ae72]">Profile Information</CardTitle>
          <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
            {isEditing ? "Edit your personal details" : "Your personal account details"}
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-[#07264f] dark:text-[#e3ae72] hover:bg-[#07264f]/5 dark:hover:bg-[#e3ae72]/10"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <form action={handleSave} className="space-y-4">
            {/* Edit Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[#07264f] dark:text-[#e3ae72]">
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="border-[#07264f]/15 focus:border-[#07264f] dark:border-[#e3ae72]/20 dark:focus:border-[#e3ae72]"
              />
            </div>

            {/* Email Display - Read only */}
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-[#07264f] dark:text-[#e3ae72]">
                Email
              </Label>
              <Input
                id="edit-email"
                value={user.email || ""}
                disabled
                className="border-[#07264f]/15 focus:border-[#07264f] dark:border-[#e3ae72]/20 dark:focus:border-[#e3ae72] opacity-50"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {state.error}
              </div>
            )}

            {/* Success Message */}
            {state?.success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                <Check className="h-4 w-4" />
                Profile updated successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#07264f] hover:bg-[#07264f]/80 text-white dark:bg-[#e3ae72] dark:text-[#07264f] dark:hover:bg-[#d49e5e]"
              >
                {isPending ? "Saving..." : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                className="border-[#07264f]/20 dark:border-[#e3ae72]/30 text-[#07264f] dark:text-[#e3ae72] hover:bg-[#07264f]/5 dark:hover:bg-[#e3ae72]/10"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
