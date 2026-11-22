import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  // IMPORTANT: Access request headers outside try-catch
  const requestHeaders = request.headers;

  try {
    // 1. Verify logged-in user
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          isAdmin: false,
        },
        { status: 401 },
      );
    }

    // 2. Get Admin IDs from server environment
    const adminIds = (process.env.ADMIN_USER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    // 3. Check current user's ID
    const isAdmin = adminIds.includes(session.user.id);

    // 4. Return admin verification result
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
