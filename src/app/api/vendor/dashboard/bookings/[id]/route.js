import { vendorRequest } from "@/lib/vendor-api";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  return vendorRequest(`/api/vendor/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
