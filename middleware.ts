import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token;
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                      req.nextUrl.pathname.startsWith("/signup");
  const isOnAccount = req.nextUrl.pathname.startsWith("/account");
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");

  // Redirect logged-in users away from auth pages
  if (isOnAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // Check admin access
  if (isOnAdmin) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  // Check account access
  if (isOnAccount && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/signup"],
};
