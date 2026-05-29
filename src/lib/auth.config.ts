import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAccount = nextUrl.pathname.startsWith("/account");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if ((isOnAccount || isOnAdmin) && !isLoggedIn) {
        return false;
      }

      if (isOnAdmin && auth?.user?.role !== "ADMIN") {
        return false;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
