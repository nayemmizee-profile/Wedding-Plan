import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Get logged-in session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    // Check authentication
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get user role
    const userRole = user.accountType || user.role;

    // Check vendor permission
    if (userRole !== "vendor") {
      return NextResponse.json(
        {
          success: false,
          message: "Only vendors can upload images",
        },
        { status: 403 },
      );
    }

    // Get image from form data
    const formData = await request.formData();
    const image = formData.get("image");

    // Validate image
    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 },
      );
    }

    // Validate image type
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid image type" },
        { status: 400 },
      );
    }

    // Validate image size (5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Maximum image size is 5MB" },
        { status: 400 },
      );
    }

    // Prepare ImgBB upload
    const uploadData = new FormData();
    uploadData.append("image", image);

    // Upload image to ImgBB
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: uploadData,
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { success: false, message: "Image upload failed" },
        { status: 502 },
      );
    }

    // Return uploaded image URL
    return NextResponse.json({
      success: true,
      imageUrl: result.data.display_url,
    });
  } catch (error) {
    console.error("Vendor Image Upload Error:", error);

    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}
