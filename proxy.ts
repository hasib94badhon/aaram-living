import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read session token directly from the request (no async I/O needed)
  const token = req.cookies.get("session")?.value;
  const session = await decrypt(token);

  const isAdmin = session?.role === "ADMIN";
  const isLoggedIn = !!session?.userId;

  // ── Admin area (everything under /admin except /admin/login) ──────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // ── Customer-only area (account pages + checkout) ────────────────────────
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ── Guest-only pages: redirect away if already logged in ──────────────────
  if (pathname === "/login" || pathname === "/signup") {
    if (isLoggedIn) {
      const dest = isAdmin ? "/admin" : "/";
      return NextResponse.redirect(new URL(dest, req.url));
    }
  }

  if (pathname === "/admin/login") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all paths except static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
