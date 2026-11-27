import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    // Get logged-in user session

    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user;

    // Check authentication
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // Get user role
    const userRole = user.accountType || user.role;

    // Check vendor permission
    if (userRole !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Only vendors can update bookings",
        },
        { status: 403 },
      );
    }

    // Get route parameters
    const { id, action } = await params;

    // Validate action
    if (!id || !["accept", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking ID or action",
        },
        { status: 400 },
      );
    }

    // Send request to Express backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/${action}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
          "x-user-id": user.id,
          "x-user-role": userRole,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Update Booking Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
