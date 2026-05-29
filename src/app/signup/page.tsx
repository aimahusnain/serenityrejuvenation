"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type SignupState = {
  error?: {
    [key: string]: string[];
  } | null;
  success?: boolean;
} | null;

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07264f] px-4 py-12">
      <Card className="w-full max-w-md border-[#07264f]/10 dark:border-[#e3ae72]/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72]">
            Create Account
          </CardTitle>
          <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
            Join Serenity Rejuvenation to book appointments and manage your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#07264f] dark:text-[#e3ae72]">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                minLength={2}
                disabled={isPending}
                className="border-[#07264f]/15 focus:border-[#07264f] dark:border-[#e3ae72]/20 dark:focus:border-[#e3ae72]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#07264f] dark:text-[#e3ae72]">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                disabled={isPending}
                className="border-[#07264f]/15 focus:border-[#07264f] dark:border-[#e3ae72]/20 dark:focus:border-[#e3ae72]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#07264f] dark:text-[#e3ae72]">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                disabled={isPending}
                className="border-[#07264f]/15 focus:border-[#07264f] dark:border-[#e3ae72]/20 dark:focus:border-[#e3ae72]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#07264f] dark:text-[#e3ae72]">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                disabled={isPending}
                className="border-[#07264f]/15 focus:border-[#07264f] dark:border-[#e3ae72]/20 dark:focus:border-[#e3ae72]"
              />
            </div>
            {state?.error && (
              <div className="space-y-1">
                {Object.entries(state.error).map(([field, errors]) =>
                  errors?.map((error: string) => (
                    <p key={`${field}-${error}`} className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  ))
                )}
              </div>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#07264f] hover:bg-[#07264f]/80 text-white dark:bg-[#e3ae72] dark:text-[#07264f] dark:hover:bg-[#d49e5e]"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[#07264f]/60 dark:text-[#e3ae72]/65">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#07264f] dark:text-[#e3ae72] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
