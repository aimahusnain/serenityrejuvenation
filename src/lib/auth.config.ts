import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnUserDashboard = nextUrl.pathname.startsWith("/user-dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if ((isOnUserDashboard || isOnAdmin) && !isLoggedIn) {
        return false;
      }

      if (isOnAdmin && auth?.user?.role !== "ADMIN") {
        return false;
      }

      if (isOnUserDashboard && auth?.user?.role !== "USER") {
        return false;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
