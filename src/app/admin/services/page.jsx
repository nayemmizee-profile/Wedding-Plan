"use client";

import { Check, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    throw new Error(`Empty response. HTTP Status: ${response.status}`);
  }

  let result;

  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(
      `Invalid JSON. HTTP Status: ${response.status}. Response: ${text.slice(0, 200)}`,
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

export default function ManageServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        status,
      });

      const response = await fetch(`/api/admin/services?${params.toString()}`, {
        cache: "no-store",
      });

      const result = await parseResponse(response);
      setServices(result.data || []);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch services");
      }

      setServices(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchServices, 350);
    return () => clearTimeout(timer);
  }, [search, status]);

  const updateService = async (id, action, body = {}) => {
    try {
      const response = await fetch(`/api/admin/services/${id}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await parseResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }

      await fetchServices();
      alert(result.message);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      const result = await parseResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      await fetchServices();
      alert("Service deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const statusBadge = (service) => {
    const approval = service.approvalStatus || service.status || "pending";

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          approval === "approved"
            ? "bg-green-50 text-green-600"
            : approval === "rejected"
              ? "bg-red-50 text-red-600"
              : "bg-orange-50 text-orange-600"
        }`}
      >
        {approval}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>

        <p className="mt-2 text-sm text-gray-500">
          Review and control vendor submitted services.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-pink-400"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border px-4 py-3 text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button onClick={fetchServices} className="rounded-xl bg-gray-100 p-3">
          <RefreshCw size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Vendor</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Approval</th>
                <th className="px-5 py-4">Active</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-400">
                    Loading services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-400">
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const approval =
                    service.approvalStatus || service.status || "pending";

                  return (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {service.serviceName || service.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {service.location || "No location"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {service.vendorName || service.vendorId || "Unknown"}
                      </td>

                      <td className="px-5 py-4">{service.category}</td>

                      <td className="px-5 py-4 font-semibold">
                        ৳{Number(service.price || 0).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">{statusBadge(service)}</td>

                      <td className="px-5 py-4">
                        {service.isActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-gray-400">Inactive</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {approval !== "approved" && (
                            <button
                              title="Approve"
                              onClick={() =>
                                updateService(service.id, "approve")
                              }
                              className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100"
                            >
                              <Check size={17} />
                            </button>
                          )}

                          {approval !== "rejected" && (
                            <button
                              title="Reject"
                              onClick={() =>
                                updateService(service.id, "reject")
                              }
                              className="rounded-lg bg-orange-50 p-2 text-orange-600 hover:bg-orange-100"
                            >
                              <X size={17} />
                            </button>
                          )}

                          {approval === "approved" && (
                            <button
                              title={
                                service.isActive ? "Deactivate" : "Activate"
                              }
                              onClick={() =>
                                updateService(service.id, "status", {
                                  isActive: !service.isActive,
                                })
                              }
                              className="rounded-lg bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-600"
                            >
                              {service.isActive ? "Disable" : "Enable"}
                            </button>
                          )}

                          <button
                            title="Delete"
                            onClick={() => deleteService(service.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
