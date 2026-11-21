import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    // 1. Verify session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Get dynamic params
    const { id, action } = await params;

    // 3. Allow only valid actions
    const allowedActions = ["approve", "reject", "status"];

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 },
      );
    }

    // 4. Get request body
    const body = await request.json();

    // 5. Send request to Express
    const response = await fetch(
      `${process.env.API_URL}/admin/services/${id}/${action}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
          "x-user-id": session.user.id,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Admin Service Update Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update service",
      },
      { status: 500 },
    );
  }
}
