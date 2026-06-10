"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LoginState = {
  error?: string | null;
  success?: boolean;
  role?: string | null;
} | null;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const { data: session, status, update } = useSession();
  const [state, formAction, isPending] = useActionState(login, null);
  const isRedirecting = useRef(false);

  // Handle successful login
  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (state?.success && !isRedirecting.current) {
        isRedirecting.current = true;

        // Debug logging
        console.log("[Login] Success state:", state);
        console.log("[Login] User role from server:", state.role);

        // Refresh session to ensure it's updated on the client
        await update();

        // Small delay to ensure session cookie is set
        await new Promise(resolve => setTimeout(resolve, 300));

        // Determine redirect destination based on the returned role
        let destination = "/user-dashboard"; // default for regular users

        // If there's a redirect parameter, use it
        if (redirectParam) {
          destination = redirectParam;
        } else if (state.role === "ADMIN") {
          destination = "/admin";
        }

        console.log("[Login] Redirecting to:", destination);

        // Navigate using window.location for hard refresh
        window.location.href = destination;
      }
    };

    handleLoginSuccess();
  }, [state?.success, update, session?.user?.role, redirectParam]);

  // Show loading state during form submission or redirect
  if (isPending || isRedirecting.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#271024]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#271024] dark:text-[#e3ae72]" />
          <p className="text-sm font-medium text-[#271024] dark:text-[#e3ae72]">
            {isPending ? "Signing in..." : "Redirecting..."}
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and password to sign in to your account
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#271024] dark:text-[#e3ae72]">
                Email
              </Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#271024] dark:text-[#e3ae72]">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs text-muted-foreground hover:text-[#271024] dark:hover:text-[#e3ae72]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-[#e3ae72]/60" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                  className="pl-10 bg-white dark:bg-[#1a0a18] border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] placeholder:text-muted-foreground dark:placeholder:text-[#e3ae72]/50 focus:border-[#271024] dark:focus:border-[#e3ae72]"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                name="remember"
                className="border-[#271024]/30 dark:border-[#e3ae72]/30"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#271024] dark:text-[#e3ae72]"
              >
                Remember me
              </label>
            </div>

            {/* Error Alert */}
            {state?.error && (
              <Alert variant="destructive" className="border-[#271024]/20 dark:border-red-800/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#271024] hover:bg-[#271024]/90 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]"
            >
              {isPending ? "Signing in..." : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="font-medium text-[#271024] hover:text-[#271024]/80 dark:text-[#e3ae72] dark:hover:text-[#e3ae72]/80"
            >
              Sign up
            </Link>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-muted-foreground text-center">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="underline hover:text-[#271024] dark:hover:text-[#e3ae72]"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-[#271024] dark:hover:text-[#e3ae72]"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:block relative bg-[#f5f5f5] dark:bg-[#1a0a18]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#271024] via-[#0a3a66] to-[#271024] dark:from-[#1a0a18] dark:via-[#2d1540] dark:to-[#1a0a18]" />
        <div className="absolute inset-0 bg-[url('/hero-image.jpg')] bg-cover bg-center opacity-20 dark:opacity-10" />
        <div className="relative h-full flex flex-col justify-center items-center px-12 text-center">
          <blockquote className="max-w-lg space-y-6">
            <p className="text-3xl font-semibold leading-tight text-white">
              &ldquo;Restore, rebalance, and renew your body and mind with our luxury hydration spa treatments.&rdquo;
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
