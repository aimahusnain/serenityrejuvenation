import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Routes that require authentication
const protectedRoutes = ["/user-dashboard", "/admin"];
// Routes that should redirect authenticated users
const authRoutes = ["/login", "/signup"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Get session with proper null checks
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  // Debug logging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware] Path:", pathname);
    console.log("[Middleware] isLoggedIn:", isLoggedIn);
    console.log("[Middleware] isAdmin:", isAdmin);
    console.log("[Middleware] session:", session ? "present" : "missing");
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is for auth only
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    const redirectUrl = isAdmin ? "/admin" : "/user-dashboard";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Redirect unauthenticated users to login with redirect
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control for admin routes
  // User must be logged in AND be admin to access /admin
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Regular users trying to access admin go to their dashboard
      return NextResponse.redirect(new URL("/user-dashboard", req.url));
    }
  }

  // Role-based access control for user dashboard
  // Admins can also view user dashboard, but regular users cannot see admin
  if (pathname.startsWith("/user-dashboard") && isLoggedIn && !isAdmin && session?.user?.role !== "USER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};