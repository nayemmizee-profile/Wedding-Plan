import { isAdmin } from "@/lib/adminAuth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!isAdmin(session.user.id)) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    const response = await fetch(`${process.env.API_URL}/admin/overview`, {
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
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
      },
      { status: 500 },
    );
  }
}
