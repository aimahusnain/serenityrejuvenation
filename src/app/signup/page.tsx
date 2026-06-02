"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SignupState = {
  error?: {
    [key: string]: string[];
  } | null;
  success?: boolean;
} | null;

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [state, formAction, isPending] = useActionState(signup, null);
  const isRedirecting = useRef(false);

  // Handle successful signup - let middleware handle redirect
  useEffect(() => {
    const handleSignupSuccess = async () => {
      if (state?.success && !isRedirecting.current) {
        isRedirecting.current = true;

        // Refresh session to update authentication state
        await update();

        // Let middleware handle the redirect - just wait a moment
        await new Promise(resolve => setTimeout(resolve, 300));
        window.location.href = "/user-dashboard";
      }
    };

    handleSignupSuccess();
  }, [state?.success, update]);

  // Show loading state during form submission
  if (isPending || isRedirecting.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#271024]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#271024] dark:text-[#e3ae72]" />
          <p className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">
            {isPending ? "Creating account..." : "Setting up your account..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-[#271024] relative">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#271024]">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo/Brand */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#271024] dark:bg-[#e3ae72]">
                <Sparkles className="h-5 w-5 text-white dark:text-[#271024]" />
              </div>
              <span className="text-xl font-bold text-[#271024] dark:text-[#e3ae72]">
                Serenity Rejuvenation
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#271024] dark:text-[#e3ae72] sm:text-3xl">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your details to create your account
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#271024] dark:text-[#e3ae72]">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-[#e3ae72]/60" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  minLength={2}
                  disabled={isPending}
                  className="pl-10 bg-white dark:bg-[#1a0a18] border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] placeholder:text-muted-foreground dark:placeholder:text-[#e3ae72]/50 focus:border-[#271024] dark:focus:border-[#e3ae72]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#271024] dark:text-[#e3ae72]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-[#e3ae72]/60" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isPending}
                  className="pl-10 bg-white dark:bg-[#1a0a18] border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] placeholder:text-muted-foreground dark:placeholder:text-[#e3ae72]/50 focus:border-[#271024] dark:focus:border-[#e3ae72]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#271024] dark:text-[#e3ae72]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-[#e3ae72]/60" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={isPending}
                  className="pl-10 bg-white dark:bg-[#1a0a18] border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] placeholder:text-muted-foreground dark:placeholder:text-[#e3ae72]/50 focus:border-[#271024] dark:focus:border-[#e3ae72]"
                />
              </div>
              <p className="text-xs text-muted-foreground dark:text-[#e3ae72]/60">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#271024] dark:text-[#e3ae72]">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-[#e3ae72]/60" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  className="pl-10 bg-white dark:bg-[#1a0a18] border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] placeholder:text-muted-foreground dark:placeholder:text-[#e3ae72]/50 focus:border-[#271024] dark:focus:border-[#e3ae72]"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" name="terms" required className="mt-0.5 border-[#271024]/30 dark:border-[#e3ae72]/30" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#271024] dark:text-[#e3ae72]"
              >
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="underline hover:text-[#271024] dark:hover:text-[#e3ae72]">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline hover:text-[#271024] dark:hover:text-[#e3ae72]">
                  privacy policy
                </Link>
              </label>
            </div>

            {/* Error */}
            {state?.error && (
              <Alert variant="destructive" className="border-[#271024]/20 dark:border-red-800/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {Object.entries(state.error).map(([field, errors]) =>
                      errors?.map((error: string) => (
                        <p key={`${field}-${error}`} className="text-sm">
                          {error}
                        </p>
                      ))
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
            >
              {isPending ? "Creating account..." : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/login"
              className="font-medium text-[#271024] hover:text-[#271024]/80 dark:text-[#e3ae72] dark:hover:text-[#e3ae72]/80"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:block relative bg-[#f5f5f5] dark:bg-[#1a0a18]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#271024] via-[#0a3a66] to-[#271024] dark:from-[#1a0a18] dark:via-[#2d1540] dark:to-[#1a0a18]" />
        <div className="absolute inset-0 bg-[url('/hero-image.jpg')] bg-cover bg-center opacity-20 dark:opacity-10" />
        <div className="relative h-full flex flex-col justify-center items-center px-12 text-center">
          <blockquote className="max-w-lg space-y-6">
            <p className="text-3xl font-semibold leading-tight text-white">
              &ldquo;Join thousands of clients who have transformed their wellness journey with our personalized spa treatments.&rdquo;
            </p>
            <footer className="text-sm text-white/80">
              — Serenity Rejuvenation
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
