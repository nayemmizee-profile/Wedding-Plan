import { vendorRequest } from "@/lib/vendor-api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 3, 1),
    10,
  );

  return vendorRequest(
    `/api/vendor/dashboard/subscription?limit=${limit}`,
    request.headers,
  );
}
