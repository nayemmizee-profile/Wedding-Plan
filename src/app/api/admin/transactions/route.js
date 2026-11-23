import { auth } from "@/lib/auth";
import { connection, NextResponse } from "next/server";

export async function GET(request) {
  // IMPORTANT: Keep connection() outside try/catch.
  await connection();

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
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

    const { searchParams } = new URL(request.url);

    const query = new URLSearchParams();

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const plan = searchParams.get("plan");

    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (plan) query.set("plan", plan);

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
      `${API_URL}/admin/transactions?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": INTERNAL_SECRET,
          "x-user-id": session.user.id,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Admin Transactions API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch transactions",
      },
      { status: 500 },
    );
  }
}
