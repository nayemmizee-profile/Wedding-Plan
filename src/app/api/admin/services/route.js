import { auth } from "@/lib/auth";
import { connection, NextResponse } from "next/server";

export async function GET(request) {
  // 1. Wait for incoming request
  await connection();

  try {
    // 2. Verify logged-in user
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

    // 3. Get search and status query
    const { searchParams } = new URL(request.url);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

    // 4. Check environment variables
    const API_URL = process.env.API_URL;
    const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

    if (!API_URL || !INTERNAL_API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 },
      );
    }

    // 5. Call Express Backend
    const response = await fetch(
      `${API_URL.replace(/\/$/, "")}/admin/services${query}`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": INTERNAL_API_SECRET,
          "x-user-id": session.user.id,
        },
        cache: "no-store",
      },
    );

    // 6. Read Express response
    const responseText = await response.text();

    console.log("Express Status:", response.status);
    console.log("Express Response:", responseText);

    // 7. Parse JSON safely
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("Invalid Express JSON:", responseText);

      return NextResponse.json(
        {
          success: false,
          message: "Express returned an invalid JSON response",
        },
        { status: 502 },
      );
    }

    // 8. Return response to Frontend
    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Get Admin Services Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
