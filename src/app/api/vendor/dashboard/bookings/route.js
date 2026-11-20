import { vendorRequest } from "@/lib/vendor-api";

export async function GET() {
  return vendorRequest("/api/vendor/bookings");
}
