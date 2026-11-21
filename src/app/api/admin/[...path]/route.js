import { isAdmin } from "@/lib/adminAuth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

async function adminProxy(request, context) {
  try {
    // 1. Verify Better Auth Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 },
      );
    }

    // 2. Verify Admin
    if (!isAdmin(session.user.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 },
      );
    }

    // 3. Get Dynamic API Path
    const { path = [] } = await context.params;

    const endpoint = path.map(encodeURIComponent).join("/");

    const query = new URL(request.url).search;

    // 4. Forward to Express Backend
    const apiUrl = process.env.API_URL;

    if (!apiUrl || !process.env.INTERNAL_API_SECRET) {
      throw new Error("Admin API environment is not configured");
    }

    const options = {
      method: request.method,

      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
        "x-user-id": session.user.id,
      },

      cache: "no-store",
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      options.body = await request.text();
    }

    const response = await fetch(
      `${apiUrl}/admin/${endpoint}${query}`,
      options,
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Admin Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Admin server request failed",
      },
      { status: 500 },
    );
  }
}

export const GET = adminProxy;
export const PATCH = adminProxy;
export const DELETE = adminProxy;
