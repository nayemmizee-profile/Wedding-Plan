import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// POST: Add New Service
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

    // 2. Verify vendor accountType
    if (session.user.accountType !== "vendor") {
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

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit service",
        error: error.cause?.message || null,
      },
      { status: 500 },
    );
  }
}

// GET: Get Vendor Services
export async function GET() {
  try {
    // 1. Verify Better Auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("Session User:", session?.user);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 },
      );
    }

    console.log("User ID:", session.user.id);
    console.log("Account Type:", session.user.accountType);

    // 2. Verify vendor accountType
    if (session.user.accountType !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Only vendors can access their services",
        },
        { status: 403 },
      );
    }

    console.log("Backend URL:", process.env.NEXT_PUBLIC_API_URL);

    // 3. Request Express backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/services`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
          "x-user-id": session.user.id,
          "x-user-email": session.user.email,
        },
        cache: "no-store",
      },
    );

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
    console.error("GET VENDOR SERVICES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to load services",
      },
      { status: 500 },
    );
  }
}
