import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  let stage = "START";

  try {
    // STEP 1: Verify Better Auth Session
    stage = "SESSION_VERIFICATION";

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

    console.log("Checkout User:", {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });

    // STEP 2: Verify Vendor Role
    stage = "ROLE_VERIFICATION";

    if (session.user.role !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Only vendors can upgrade",
        },
        { status: 403 },
      );
    }

    // STEP 3: Environment Variables
    stage = "ENVIRONMENT_CHECK";

    const apiUrl = process.env.API_URL?.replace(/\/$/, "");
    const internalSecret = process.env.INTERNAL_API_SECRET;

    if (!apiUrl) {
      throw new Error("API_URL is missing");
    }

    if (!internalSecret) {
      throw new Error("INTERNAL_API_SECRET is missing");
    }

    // STEP 4: Call Existing Express Backend
    stage = "EXPRESS_API_REQUEST";

    const backendUrl = `${apiUrl}/payments/create-checkout-session`;

    console.log("Calling Express:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": internalSecret,
        "x-user-id": session.user.id,
      },
      cache: "no-store",
    });

    // STEP 5: Read Backend Response
    stage = "EXPRESS_API_RESPONSE";

    const responseText = await response.text();

    console.log("Express Status:", response.status);
    console.log("Express Response:", responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Express returned invalid JSON. Status: ${response.status}. Response: ${responseText.slice(0, 300)}`,
      );
    }

    // STEP 6: Backend Error Handling
    if (!response.ok || !data.success) {
      console.error("Backend Checkout Error:", data);

      return NextResponse.json(
        {
          success: false,
          message: data.message || "Checkout session failed",
          backendStatus: response.status,
          debug: data.debug || null,
          stage,
        },
        { status: response.status >= 400 ? response.status : 502 },
      );
    }

    // STEP 7: Validate Stripe URL
    stage = "STRIPE_URL_VALIDATION";

    if (!data.url) {
      throw new Error("Stripe Checkout URL not returned from backend");
    }

    // STEP 8: Send URL to Frontend
    console.log("Stripe Checkout Ready:", data.url);

    return NextResponse.json({
      success: true,
      url: data.url,
    });
  } catch (error) {
    console.error("CHECKOUT ERROR:", {
      stage,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        stage,
        message: error.message || "Payment initialization failed",
      },
      { status: 500 },
    );
  }
}
