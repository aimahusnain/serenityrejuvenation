"use client";

import { useState, useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Phone, Heart, Edit2, Check, X, AlertCircle } from "lucide-react";
import { updateProfile } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

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
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(preferences?.phone || "");
  const [emailNotifications, setEmailNotifications] = useState(
    preferences?.emailNotifications ?? true
  );
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(updateProfile, null);

  const handleSave = (formData: FormData) => {
    formData.append("phone", phone);
    formData.append("emailNotifications", emailNotifications.toString());
    formAction(formData);
  };

  // Refresh and close edit mode on success
  if (state?.success && isEditing) {
    setIsEditing(false);
    router.refresh();
  }

  if (!preferences && !isEditing) {
    return (
      <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
        <CardHeader>
          <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">Preferences</CardTitle>
          <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
            Your account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-12 w-12 text-[#7a219f]/30 dark:text-[#efcafe]/30 mb-4" />
            <h3 className="text-lg font-semibold text-[#7a219f] dark:text-[#efcafe] mb-2">
              No preferences set
            </h3>
            <p className="text-sm text-[#7a219f]/60 dark:text-[#efcafe]/65 max-w-xs mb-4">
              Your preferences haven&apos;t been configured yet.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Set Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">Preferences</CardTitle>
          <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
            {isEditing ? "Edit your preferences" : "Manage your account settings and notifications"}
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
          <form action={handleSave} className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#7a219f]/10 dark:border-[#efcafe]/15 bg-[#7a219f]/5 dark:bg-[#efcafe]/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/10 dark:bg-[#efcafe]/20">
                  <Bell className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                </div>
                <div>
                  <Label htmlFor="emailNotifications" className="text-[#7a219f] dark:text-[#efcafe] font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                    Receive updates about bookings and offers
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#7a219f] dark:text-[#efcafe]">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe]"
              />
              <p className="text-xs text-muted-foreground">
                Optional contact number for appointment reminders
              </p>
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
                Preferences updated successfully!
              </div>
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
                onClick={() => {
                  setIsEditing(false);
                  setPhone(preferences?.phone || "");
                  setEmailNotifications(preferences?.emailNotifications ?? true);
                }}
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
            {/* Email Notifications */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Bell className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Email Notifications
                </Label>
                <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                  {preferences?.emailNotifications ? "Enabled" : "Disabled"}
                </p>
                <p className="text-xs text-[#7a219f]/50 dark:text-[#efcafe]/50 mt-1">
                  Receive updates about your bookings and special offers
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Phone className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Phone Number
                </Label>
                <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                  {preferences?.phone || "Not set"}
                </p>
                <p className="text-xs text-[#7a219f]/50 dark:text-[#efcafe]/50 mt-1">
                  Optional contact number for appointment reminders
                </p>
              </div>
            </div>

            {/* Preferred Services */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Heart className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Preferred Services
                </Label>
                {preferences?.preferredServices && preferences.preferredServices.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {preferences.preferredServices.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#7a219f]/10 text-[#7a219f] dark:bg-[#efcafe]/20 dark:text-[#efcafe]"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                    No preferred services selected
                  </p>
                )}
                <p className="text-xs text-[#7a219f]/50 dark:text-[#efcafe]/50 mt-1">
                  Services you frequently book
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                <Mail className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
              </div>
              <div className="flex-1">
                <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                  Last Updated
                </Label>
                <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                  {preferences && new Date(preferences.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
