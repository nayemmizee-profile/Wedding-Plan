import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // 1. Get logged-in session

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Verify vendor accountType
    if (user.accountType !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Only vendors can access bookings",
        },
        { status: 403 },
      );
    }

    // 3. Get status from frontend URL
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    // 4. Send request to Express backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/bookings?status=${encodeURIComponent(status)}`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
          "x-user-id": user.id,
          "x-user-email": user.email,
          "x-user-account-type": user.accountType,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Vendor Bookings Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
