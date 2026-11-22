import { auth } from "@/lib/auth";
import { connection, NextResponse } from "next/server";

export async function GET(request) {
  // 1. Prevent prerendering for this request-dependent route
  // Must stay outside try/catch
  await connection();

  try {
    // 2. Verify Admin Session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 3. Get Query Parameters
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // 4. Validate Environment Variables
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

    // 5. Express API URL
    const apiUrl = new URL(`${API_URL.replace(/\/$/, "")}/admin/users`);

    apiUrl.searchParams.set("search", search);
    apiUrl.searchParams.set("role", role);
    apiUrl.searchParams.set("page", page);
    apiUrl.searchParams.set("limit", limit);

    // 6. Forward Request to Express
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_API_SECRET,
        "x-user-id": session.user.id,
      },
      cache: "no-store",
    });

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
    console.error("ADMIN USERS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
