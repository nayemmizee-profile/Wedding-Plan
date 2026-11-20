import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1. Verify Better Auth session
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

    // 2. Verify vendor role
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Only vendors can add services",
        },
        { status: 403 },
      );
    }

    // 3. Get FormData from frontend
    const formData = await request.formData();

    // 4. Send data to Express backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services`,
      {
        method: "POST",
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
          "x-user-id": session.user.id,
          "x-user-email": session.user.email,
        },
        body: formData,
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("ADD SERVICE API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Failed to submit service",
        error: error.cause?.message || null,
      },
      { status: 500 },
    );
  }
}
