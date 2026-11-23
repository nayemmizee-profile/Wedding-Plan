import { connection, NextResponse } from "next/server";

export async function GET(request) {
  // Request-time operation
  await connection();

  const { searchParams } = new URL(request.url);

  const sort = searchParams.get("sort") || "newest";

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

    if (!API_URL || !INTERNAL_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend environment variables are missing",
        },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${API_URL}/services/all-approved?sort=${encodeURIComponent(sort)}`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": INTERNAL_SECRET,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch all services",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("All Approved Services API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
