import { vendorRequest } from "@/lib/vendor-api";

export async function GET() {
  return vendorRequest("/api/vendor/profile");
}

export async function PATCH(request) {
  const body = await request.json();

  return vendorRequest("/api/vendor/profile", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
