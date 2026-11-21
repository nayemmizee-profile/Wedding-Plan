import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // 1. Verify Admin Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Get Query Parameters
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // 3. Express API URL
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);

    apiUrl.searchParams.set("search", search);
    apiUrl.searchParams.set("role", role);
    apiUrl.searchParams.set("page", page);
    apiUrl.searchParams.set("limit", limit);

    // 4. Forward Request
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
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
