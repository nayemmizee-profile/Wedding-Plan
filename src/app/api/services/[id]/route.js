import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services/${id}`,
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET,
        },
        cache: "no-store",
      },
    );

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Backend returned invalid response");
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Service not found",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Service API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
