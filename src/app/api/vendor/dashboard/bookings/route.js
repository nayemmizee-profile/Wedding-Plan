import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // 1. Verify session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 },
      );
    }

    // 2. Verify vendor role
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Only vendors can view bookings",
        },
        { status: 403 },
      );
    }

    // 3. Get status filter from URL
    const status = request.nextUrl.searchParams.get("status");

    // 4. Build backend URL
    const backendUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/bookings`,
    );

    if (status) {
      backendUrl.searchParams.set("status", status);
    }

    // 5. Request Express backend
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
        "x-user-id": session.user.id,
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("VENDOR BOOKINGS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch bookings",
      },
      { status: 500 },
    );
  }
}
