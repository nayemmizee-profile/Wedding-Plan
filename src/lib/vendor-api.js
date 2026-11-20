import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function vendorRequest(path, options = {}) {
  try {
    // 1. Verify Better Auth Session
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

    // 2. Verify Vendor Role
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Vendor access only",
        },
        { status: 403 },
      );
    }

    // 3. Prepare Headers
    const requestHeaders = new Headers(options.headers);

    requestHeaders.set("x-user-id", session.user.id);

    requestHeaders.set("x-user-email", session.user.email);

    requestHeaders.set("x-internal-secret", process.env.INTERNAL_API_SECRET);

    // 4. Set Content-Type only for JSON
    const isFormData = options.body instanceof FormData;

    if (!isFormData && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    // 5. Send Request to Express Backend
    const response = await fetch(`${process.env.API_URL}${path}`, {
      ...options,
      headers: requestHeaders,
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Vendor API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
