"use client";

import { useState, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Bell,
  Phone,
  Heart,
  Shield,
  Palette,
  Download,
  Trash2,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Calendar,
  Check,
  X,
  Edit2,
} from "lucide-react";
import { updateProfile, deleteAccount } from "@/app/actions/auth";
import { useTheme } from "next-themes";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Preferences {
  id: string;
  emailNotifications: boolean;
  phone?: string | null;
  preferredServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SettingsProps {
  user: User;
  preferences: Preferences | null;
}

export function Settings({ user, preferences }: SettingsProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user.name || "");

  // Preferences state
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [phone, setPhone] = useState(preferences?.phone || "");
  const [emailNotifications, setEmailNotifications] = useState(
    preferences?.emailNotifications ?? true
  );

  // Password state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Track previous success states to detect changes
  const prevProfileSuccessRef = useRef(false);
  const prevPreferencesSuccessRef = useRef(false);

  // Separate form actions for profile and preferences
  const [profileState, profileFormAction, isProfilePending] = useActionState(
    updateProfile,
    null
  );

  const [preferencesState, preferencesFormAction, isPreferencesPending] = useActionState(
    updateProfile,
    null
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle profile save - append current state to FormData
  const handleProfileSave = (formData: FormData) => {
    formData.append("name", name);
    profileFormAction(formData);
  };

  // Handle preferences save - append current state to FormData
  const handlePreferencesSave = (formData: FormData) => {
    formData.append("phone", phone);
    formData.append("emailNotifications", emailNotifications.toString());
    preferencesFormAction(formData);
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsEditingPassword(false);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("Network error. Please try again.");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }

    try {
      await deleteAccount();
    } catch (error) {
      console.error("Delete account error:", error);
    }
  };

  // Handle data export
  const handleExportData = async () => {
    try {
      const res = await fetch("/api/user/export-data");
      const data = await res.json();

      if (res.ok) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `serenity-data-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  // Handle success - exit edit mode and refresh data
  // Only refresh when success state changes from false to true (not on every render)
  const profileSuccess = profileState?.success ?? false;
  const preferencesSuccess = preferencesState?.success ?? false;

  // Profile success handling
  if (profileSuccess && !prevProfileSuccessRef.current && isEditingProfile) {
    setIsEditingProfile(false);
    router.refresh();
  }
  prevProfileSuccessRef.current = profileSuccess;

  // Preferences success handling
  if (preferencesSuccess && !prevPreferencesSuccessRef.current && isEditingPreferences) {
    setIsEditingPreferences(false);
    router.refresh();
  }
  prevPreferencesSuccessRef.current = preferencesSuccess;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#7a219f] dark:text-[#efcafe] font-serif">
          Settings
        </h2>
        <p className="text-sm text-[#7a219f]/60 dark:text-[#efcafe]/65 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-[#7a219f]/5 dark:bg-[#efcafe]/10">
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-[#7a219f] data-[state=active]:text-white dark:data-[state=active]:bg-[#efcafe] dark:data-[state=active]:text-[#7a219f]"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-[#7a219f] data-[state=active]:text-white dark:data-[state=active]:bg-[#efcafe] dark:data-[state=active]:text-[#7a219f]"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#7a219f] data-[state=active]:text-white dark:data-[state=active]:bg-[#efcafe] dark:data-[state=active]:text-[#7a219f]"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-[#7a219f] data-[state=active]:text-white dark:data-[state=active]:bg-[#efcafe] dark:data-[state=active]:text-[#7a219f]"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="data-[state=active]:bg-[#7a219f] data-[state=active]:text-white dark:data-[state=active]:bg-[#efcafe] dark:data-[state=active]:text-[#7a219f]"
          >
            Data
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
                  Profile Information
                </CardTitle>
                <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
                  {isEditingProfile
                    ? "Edit your personal details"
                    : "Your personal account details"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditingProfile ? (
                <form action={handleProfileSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-name"
                      className="text-[#7a219f] dark:text-[#efcafe]"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-email"
                      className="text-[#7a219f] dark:text-[#efcafe]"
                    >
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      value={user.email || ""}
                      disabled
                      className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe] opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  {profileState?.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{profileState.error}</AlertDescription>
                    </Alert>
                  )}

                  {profileState?.success && (
                    <Alert className="border-green-500/20 bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-400" />
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        Profile updated successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={isProfilePending}
                      className="bg-[#7a219f] hover:bg-[#7a219f]/80 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
                    >
                      {isProfilePending ? "Saving..." : (
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
                        setIsEditingProfile(false);
                        setName(user.name || "");
                      }}
                      disabled={isProfilePending}
                      className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
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
                          {user.role === "ADMIN" ? "Administrator" : "Member"}
                        </span>
                      </p>
                    </div>
                  </div>

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
                </>
              )}

              {!isEditingProfile && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(true)}
                  className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
                  Manage how you receive updates
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditingPreferences ? (
                <form action={handlePreferencesSave} className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#7a219f]/10 dark:border-[#efcafe]/15 bg-[#7a219f]/5 dark:bg-[#efcafe]/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/10 dark:bg-[#efcafe]/20">
                        <Bell className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                      </div>
                      <div>
                        <Label
                          htmlFor="emailNotifications"
                          className="text-[#7a219f] dark:text-[#efcafe] font-medium"
                        >
                          Email Notifications
                        </Label>
                        <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                          Receive updates about bookings and offers
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-[#7a219f] dark:text-[#efcafe]"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
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

                  {preferencesState?.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{preferencesState.error}</AlertDescription>
                    </Alert>
                  )}

                  {preferencesState?.success && (
                    <Alert className="border-green-500/20 bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-400" />
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        Preferences updated successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={isPreferencesPending}
                      className="bg-[#7a219f] hover:bg-[#7a219f]/80 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
                    >
                      {isPreferencesPending ? "Saving..." : (
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
                        setIsEditingPreferences(false);
                        setPhone(preferences?.phone || "");
                        setEmailNotifications(preferences?.emailNotifications ?? true);
                      }}
                      disabled={isPreferencesPending}
                      className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
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

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                      <Heart className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                        Preferred Services
                      </Label>
                      {preferences?.preferredServices &&
                      preferences.preferredServices.length > 0 ? (
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
                </>
              )}

              {!isEditingPreferences && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingPreferences(true)}
                  className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Preferences
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <CardHeader>
              <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
                Change Password
              </CardTitle>
              <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {passwordSuccess && (
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {passwordSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {isEditingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="current-password"
                      className="text-[#7a219f] dark:text-[#efcafe]"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a219f]/50 dark:text-[#efcafe]/50 hover:text-[#7a219f] dark:hover:text-[#efcafe]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="new-password"
                      className="text-[#7a219f] dark:text-[#efcafe]"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a219f]/50 dark:text-[#efcafe]/50 hover:text-[#7a219f] dark:hover:text-[#efcafe]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-[#7a219f] dark:text-[#efcafe]"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-[#7a219f]/15 focus:border-[#7a219f] dark:border-[#efcafe]/20 dark:focus:border-[#efcafe] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a219f]/50 dark:text-[#efcafe]/50 hover:text-[#7a219f] dark:hover:text-[#efcafe]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      className="bg-[#7a219f] hover:bg-[#7a219f]/80 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
                    >
                      Update Password
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setPasswordError("");
                      }}
                      className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingPassword(true)}
                  className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                >
                  Change Password
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <CardHeader>
              <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
                Active Sessions
              </CardTitle>
              <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                  <Shield className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                </div>
                <div className="flex-1">
                  <Label className="text-[#7a219f]/60 dark:text-[#efcafe]/60 text-xs font-semibold uppercase tracking-wider">
                    Current Session
                  </Label>
                  <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium mt-1">
                    Active now
                  </p>
                  <p className="text-xs text-[#7a219f]/50 dark:text-[#efcafe]/50 mt-1">
                    {user.email} • This device
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <CardHeader>
              <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
                Theme
              </CardTitle>
              <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#7a219f]/10 dark:border-[#efcafe]/15 bg-[#7a219f]/5 dark:bg-[#efcafe]/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/10 dark:bg-[#efcafe]/20">
                    <Palette className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#7a219f] dark:text-[#efcafe]">
                      Dark Mode
                    </p>
                    <p className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                      Toggle between light and dark themes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className={
                      theme === "light"
                        ? "bg-[#7a219f] text-white dark:bg-[#efcafe] dark:text-[#7a219f]"
                        : "border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                    }
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className={
                      theme === "dark"
                        ? "bg-[#7a219f] text-white dark:bg-[#efcafe] dark:text-[#7a219f]"
                        : "border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                    }
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Dark
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-[#7a219f]/10 dark:border-[#efcafe]/15 bg-[#7a219f]/5 dark:bg-[#efcafe]/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/10 dark:bg-[#efcafe]/20">
                  <Palette className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium">
                    Brand Colors
                  </p>
                  <div className="mt-3 flex gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-lg bg-[#7a219f] border-2 border-white/20 shadow-sm" />
                      <span className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                        Navy
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-lg bg-[#efcafe] border-2 border-white/20 shadow-sm" />
                      <span className="text-xs text-[#7a219f]/60 dark:text-[#efcafe]/60">
                        Gold
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#7a219f]/50 dark:text-[#efcafe]/50 mt-2">
                    Serenity Rejuvenation brand colors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <Card className="border-[#7a219f]/10 dark:border-[#efcafe]/20">
            <CardHeader>
              <CardTitle className="text-[#7a219f] dark:text-[#efcafe]">
                Export Your Data
              </CardTitle>
              <CardDescription className="text-[#7a219f]/60 dark:text-[#efcafe]/65">
                Download a copy of your personal data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7a219f]/8 dark:bg-[#efcafe]/20">
                  <Download className="h-5 w-5 text-[#7a219f] dark:text-[#efcafe]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#7a219f] dark:text-[#efcafe]/90 font-medium">
                    Personal Information
                  </p>
                  <p className="text-sm text-[#7a219f]/60 dark:text-[#efcafe]/60 mt-1">
                    Includes your profile, bookings, and payment history
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="border-[#7a219f]/20 dark:border-[#efcafe]/30 text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 dark:border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription className="text-muted-foreground">
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-destructive">
                        Delete Account?
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete
                        your account and remove all your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="delete-confirm">
                          Type <span className="font-mono font-bold">DELETE</span>{" "}
                          to confirm
                        </Label>
                        <Input
                          id="delete-confirm"
                          value={deleteConfirmText}
                          onChange={(e) =>
                            setDeleteConfirmText(e.target.value.toUpperCase())
                          }
                          placeholder="DELETE"
                          className="border-destructive/30 focus:border-destructive"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDeleteDialogOpen(false);
                          setDeleteConfirmText("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={deleteConfirmText !== "DELETE"}
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
