"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Calendar, Shield, Edit2, Check, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

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
    setIsEditing(false);
  };

  return (
    <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">Profile Information</CardTitle>
          <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
            {isEditing ? "Edit your personal details" : "Your personal account details"}
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
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
              <Label htmlFor="edit-name" className="text-[#7a219f] dark:text-[#efcafe]">
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe]"
              />
            </div>

            {/* Email Display - Read only */}
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-[#7a219f] dark:text-[#efcafe]">
                Email
              </Label>
              <Input
                id="edit-email"
                value={user.email || ""}
                disabled
                className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe] opacity-50"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Error Message */}
            {state?.error && (
              <Alert variant="destructive" className="border-[#7a219f]/20 dark:border-red-800/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {state?.success && (
              <Alert className="border-green-500/20 dark:border-green-800/30 bg-green-500/10 dark:bg-green-900/20">
                <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-400">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#7a219f] hover:bg-[#7a219f]/80 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
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
                className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <User className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Full Name
                </Label>
                <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                  {user.name || "Not set"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Mail className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Email Address
                </Label>
                <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                  {user.email || "Not set"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Shield className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Account Role
                </Label>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-[#efcafe] text-[#7a219f]"
                        : "bg-[#7a219f]/10 text-[#7a219f] dark:bg-[#efcafe]/20 dark:text-[#efcafe]"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Calendar className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Member Since
                </Label>
                <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Calendar className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Last Updated
                </Label>
                <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
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
