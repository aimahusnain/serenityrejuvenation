"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type LoginState = {
  error?: string | null;
  success?: boolean;
} | null;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07264f] px-4 py-12">
      <Card className="w-full max-w-md border-[#07264f]/10 dark:border-[#e3ae72]/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-[#07264f] dark:text-[#e3ae72]">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-[#07264f]/60 dark:text-[#e3ae72]/65">
            Sign in to your Serenity Rejuvenation account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
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
                required
                disabled={isPending}
                className="border-[#07264f]/15 focus:border-[#07264f] dark:border-[#e3ae72]/20 dark:focus:border-[#e3ae72]"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-500 dark:text-red-400">{state.error}</p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#07264f] hover:bg-[#07264f]/80 text-white dark:bg-[#e3ae72] dark:text-[#07264f] dark:hover:bg-[#d49e5e]"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[#07264f]/60 dark:text-[#e3ae72]/65">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#07264f] dark:text-[#e3ae72] hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
