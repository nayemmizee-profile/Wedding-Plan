import { auth } from "@/lib/auth";
import { connection, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request) {
  await connection();

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
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

    if (session.user.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can access this dashboard",
        },
        { status: 403 },
      );
    }

    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend API URL is missing",
        },
        { status: 500 },
      );
    }

    const response = await fetch(`${API_URL}/user/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
        "x-user-id": session.user.id,
        "x-user-email": session.user.email,
        "x-user-role": session.user.role,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch dashboard",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
