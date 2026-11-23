import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function proxy(request) {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const user = session?.user;

    // User is not logged in
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const pathname = request.nextUrl.pathname;

    // Get user account type
    const accountType = user.accountType;

    // Admin verification
    const adminIds = (process.env.ADMIN_USER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const isAdmin = user.role === "admin" || adminIds.includes(user.id);

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(
          new URL(
            accountType === "vendor" ? "/vendor/dashboard" : "/user/dashboard",
            request.url,
          ),
        );
      }

      return NextResponse.next();
    }

    // Vendor routes
    if (pathname.startsWith("/vendor")) {
      if (accountType !== "vendor") {
        return NextResponse.redirect(
          new URL(
            accountType === "user" ? "/user/dashboard" : "/login",
            request.url,
          ),
        );
      }

      return NextResponse.next();
    }

    // User routes
    if (pathname.startsWith("/user")) {
      if (accountType !== "user") {
        return NextResponse.redirect(
          new URL(
            accountType === "vendor" ? "/vendor/dashboard" : "/login",
            request.url,
          ),
        );
      }

      return NextResponse.next();
    }

    // Other protected routes
    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/user/:path*", "/vendor/:path*", "/admin/:path*", "/my-bookings"],
};
