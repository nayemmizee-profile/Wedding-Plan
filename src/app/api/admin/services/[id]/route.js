import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
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

    // 2. Get service ID
    const { id } = await params;

    // 3. Send delete request to Express
    const response = await fetch(
      `${process.env.API_URL}/admin/services/${id}`,
      {
        method: "DELETE",
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
          "x-user-id": session.user.id,
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Admin Service Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete service",
      },
      { status: 500 },
    );
  }
}
