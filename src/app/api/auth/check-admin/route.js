import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Verify logged-in user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, isAdmin: false },
        { status: 401 },
      );
    }

    // Get Admin IDs from server environment
    const adminIds = (process.env.ADMIN_USER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    // Check current user's ID
    const isAdmin = adminIds.includes(session.user.id);

    return NextResponse.json({
      success: true,
      isAdmin,
    });
  } catch (error) {
    console.error("Admin verification error:", error);

    return NextResponse.json(
      {
        success: false,
        isAdmin: false,
        message: "Admin verification failed",
      },
      { status: 500 },
    );
  }
}
