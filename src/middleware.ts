import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Routes that require authentication
const protectedRoutes = ["/user-dashboard", "/admin"];
// Routes that should redirect authenticated users away
const authRoutes = ["/login", "/signup", "/log-in"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Get authentication state
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";
  const isUser = session?.user?.role === "USER";

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth-only (should redirect authenticated users)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Debug logging (development only)
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] ${pathname}`, {
      isLoggedIn,
      isAdmin,
      isUser,
      hasSession: !!session,
      sessionUser: session?.user,
      userRole: session?.user?.role,
    });
  }

  // 1. Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    // Admin goes to /admin, users go to /user-dashboard
    const redirectUrl = isAdmin ? "/admin" : "/user-dashboard";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // 2. Protect routes that require authentication
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    // Store the intended destination
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-based access control for /admin
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!isAdmin) {
      // Non-admin users trying to access admin get redirected to their dashboard
      return NextResponse.redirect(new URL("/user-dashboard", req.url));
    }
  }

  // 4. Role-based access for /user-dashboard
  // Admins can access user-dashboard, but regular users cannot access admin
  if (pathname.startsWith("/user-dashboard") && isLoggedIn && !isAdmin && !isUser) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
