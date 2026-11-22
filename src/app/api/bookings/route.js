import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 },
      );
    }

    if (user.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Only users can book services" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
        "x-user-id": user.id,
        "x-user-email": user.email,
        "x-user-role": user.role,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Create Booking Route Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 },
      );
    }

    if (user.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Only users can access their bookings",
        },
        { status: 403 },
      );
    }

    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const response = await fetch(`${API_URL}/my-bookings`, {
      method: "GET",
      headers: {
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
        "x-user-id": user.id,
        "x-user-role": user.role,
      },
      cache: "no-store",
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Backend returned invalid JSON:", response.status, text);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from backend",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Fetch My Bookings Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
