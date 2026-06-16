import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { log } from "@/lib/logger";

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
      log.proxy.redirect(pathname, "/admin/login", isLoggedIn ? "insufficient role" : "no session");
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    log.proxy.allow(pathname, "ADMIN", session!.userId);
  }

  // ── Customer-only area (account pages + checkout) ────────────────────────
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!isLoggedIn) {
      log.proxy.redirect(pathname, "/login", "no session");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    log.proxy.allow(pathname, session!.role, session!.userId);
  }

  // ── Guest-only pages: redirect away if already logged in ──────────────────
  if (pathname === "/login" || pathname === "/signup") {
    if (isLoggedIn) {
      const dest = isAdmin ? "/admin" : "/";
      log.proxy.redirect(pathname, dest, "already logged in");
      return NextResponse.redirect(new URL(dest, req.url));
    }
  }

  if (pathname === "/admin/login") {
    if (isAdmin) {
      log.proxy.redirect(pathname, "/admin", "already admin");
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
