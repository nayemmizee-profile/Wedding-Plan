import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    // 1. Verify user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Get Dynamic Parameters
    const { id, action } = await params;

    // 3. Validate action
    if (!["block", "unblock"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 },
      );
    }

    // 4. Forward request to Express
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${encodeURIComponent(id)}/${action}`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
        "x-user-id": session.user.id,
      },
      cache: "no-store",
    });

    // 5. Read Express response
    const text = await response.text();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          message: "Express API returned an empty response",
        },
        { status: response.status },
      );
    }

    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("ADMIN USER ACTION API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process user action",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
