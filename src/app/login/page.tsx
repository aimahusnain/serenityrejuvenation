"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const destination = redirectParam || (session.user.role === "ADMIN" ? "/admin" : "/user-dashboard");
      console.log("[Login] Already authenticated, redirecting to:", destination);
      router.push(destination);
    }
  }, [status, session, redirectParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      console.log("[Login] Attempting sign in with:", { email, redirectParam });

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("[Login] Sign in result:", result);

      if (result?.error) {
        setError("Invalid email or password");
        setIsPending(false);
        return;
      }

      // Success - get the session to determine redirect
      // We need to wait a bit for the session to be available
      setTimeout(() => {
        // Force a hard refresh to let middleware handle the redirect
        window.location.href = redirectParam || "/admin";
      }, 100);
    } catch (err) {
      console.error("[Login] Error:", err);
      setError("Something went wrong. Please try again.");
      setIsPending(false);
    }
  };

  // Show loading state during form submission
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1d002c]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#7a219f] dark:text-[#efcafe]" />
          <p className="text-sm font-medium text-[#7a219f] dark:text-[#efcafe]">
            Signing in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#1d002c] relative">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-[#1d002c]">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo/Brand */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7a219f] dark:bg-[#efcafe]">
                <Sparkles className="h-5 w-5 text-white dark:text-[#7a219f]" />
              </div>
              <span className="text-xl font-bold text-[#7a219f] dark:text-[#efcafe]">
                Serenity Rejuvenation
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#7a219f] dark:text-[#efcafe] sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#efcafe]/70">
              Enter your email and password to sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#7a219f] dark:text-[#efcafe]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#efcafe]/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                  className="pl-10 bg-[#26043e] border-[#7a219f]/20 text-[#efcafe] placeholder:text-[#efcafe]/50 focus:border-[#efcafe]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#7a219f] dark:text-[#efcafe]">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs text-[#efcafe]/70 hover:text-[#efcafe]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#efcafe]/60" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                  className="pl-10 bg-[#26043e] border-[#7a219f]/20 text-[#efcafe] placeholder:text-[#efcafe]/50 focus:border-[#efcafe]"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="border-[#7a219f]/30 dark:border-[#efcafe]/30"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#7a219f] dark:text-[#efcafe]"
              >
                Remember me
              </label>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-[#7a219f]/20 dark:border-red-800/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#7a219f] hover:bg-[#7a219f]/90 text-white dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]"
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
            <span className="text-[#efcafe]/70">Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="font-medium text-[#7a219f] hover:text-[#7a219f]/80 dark:text-[#efcafe] dark:hover:text-[#efcafe]/80"
            >
              Sign up
            </Link>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-[#efcafe]/70 text-center">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="underline hover:text-[#7a219f] dark:hover:text-[#efcafe]"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-[#7a219f] dark:hover:text-[#efcafe]"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:block relative bg-[#2d063f]">
        <div className="absolute inset-0 bg-linear-to-br from-[#7a219f] via-[#0a3a66] to-[#7a219f]" />
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
