import { vendorRequest } from "@/lib/vendor-api";

export async function GET() {
  return vendorRequest("/api/vendor/services");
}

export async function POST(request) {
  const body = await request.json();

  return vendorRequest("/api/vendor/services", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
