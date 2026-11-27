import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
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

    const adminIds = (process.env.ADMIN_USER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const isAdmin =
      session.user.role === "admin" || adminIds.includes(session.user.id);

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
