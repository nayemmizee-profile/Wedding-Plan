import { vendorRequest } from "@/lib/vendor-api";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  return vendorRequest(`/api/vendor/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  return vendorRequest(`/api/vendor/services/${id}`, {
    method: "DELETE",
  });
}
