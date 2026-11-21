import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // 1. Verify logged-in user
    const session = await auth.api.getSession({
      headers: await headers(),
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

    // 2. Get search and status query
    const { searchParams } = new URL(request.url);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

    // 3. Call Express Backend
    const response = await fetch(
      `${process.env.API_URL}/admin/services${query}`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
          "x-user-id": session.user.id,
        },
        cache: "no-store",
      },
    );

    // 4. Read Express response
    const responseText = await response.text();

    console.log("Express Status:", response.status);
    console.log("Express Response:", responseText);

    // 5. Parse JSON safely
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

    // 6. Return response to Frontend
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
