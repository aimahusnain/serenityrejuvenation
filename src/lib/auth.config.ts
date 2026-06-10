import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Note: Authorization is handled in middleware.ts
  // We don't use the authorized callback here to avoid conflicts
  providers: [],
} satisfies NextAuthConfig;
