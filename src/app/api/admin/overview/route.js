import { isAdmin } from "@/lib/adminAuth";
import { auth } from "@/lib/auth";
import { connection, NextResponse } from "next/server";

export async function GET(request) {
  // IMPORTANT: Keep this OUTSIDE try...catch
  await connection();

  try {
    // 1. Verify user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Verify admin role
    if (!isAdmin(session.user.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 },
      );
    }

    // 3. Check environment variables
    const API_URL = process.env.API_URL;
    const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

    if (!API_URL || !INTERNAL_API_SECRET) {
      console.error("Missing API_URL or INTERNAL_API_SECRET");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 },
      );
    }

    // 4. Call Express backend
    const response = await fetch(
      `${API_URL.replace(/\/$/, "")}/admin/overview`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": INTERNAL_API_SECRET,
          "x-user-id": session.user.id,
        },
        cache: "no-store",
      },
    );

    // 5. Read backend response
    const responseText = await response.text();

    console.log("Express Status:", response.status);
    console.log("Express Response:", responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Express returned invalid JSON. Status: ${response.status}`,
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("ADMIN OVERVIEW ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch dashboard data",
      },
      { status: 500 },
    );
  }
}
