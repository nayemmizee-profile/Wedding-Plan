"use client";

import ServiceCard from "@/Components/vendor/ServiceCard";
import { AnimatePresence } from "framer-motion";
import { Loader2, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    try {
      const response = await fetch("/api/vendor/services");
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setServices(result.services || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await fetch(`/api/vendor/services/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleAvailability = async (service) => {
    try {
      const response = await fetch(`/api/vendor/services/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability: !service.availability,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setServices((prev) =>
        prev.map((s) =>
          s._id === service._id ? { ...s, availability: !s.availability } : s,
        ),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const updateService = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(`/api/vendor/services/${editing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: editing.serviceName,
          category: editing.category,
          description: editing.description,
          price: Number(editing.price),
          location: editing.location,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setEditing(null);
      await loadServices();
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.serviceName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "all" || service.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#33232D]">My Services</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage all your wedding services.
          </p>
        </div>

        <Link
          href="/vendor/dashboard/services/add"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#A94F70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#843B59]"
        >
          <Plus size={19} />
          Add New Service
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:border-[#A94F70]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-[#A94F70]"
        >
          <option value="all">All Services</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#A94F70]" size={35} />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white py-20 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            No Services Found
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Add your first wedding service to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={setEditing}
                onDelete={deleteService}
                onAvailability={toggleAvailability}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div
              className="absolute inset-0"
              onClick={() => setEditing(null)}
            />

            <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#33232D]">
                  Update Service
                </h2>

                <button onClick={() => setEditing(null)}>
                  <X />
                </button>
              </div>

              <form onSubmit={updateService} className="space-y-4">
                {[
                  ["serviceName", "Service Name"],
                  ["category", "Category"],
                  ["price", "Price"],
                  ["location", "Location"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="mb-2 block text-sm font-medium">
                      {label}
                    </label>
                    <input
                      required
                      type={name === "price" ? "number" : "text"}
                      min={name === "price" ? "1" : undefined}
                      value={editing[name] ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [name]: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border p-3 outline-none focus:border-[#A94F70]"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3 outline-none focus:border-[#A94F70]"
                  />
                </div>

                <button
                  disabled={saving}
                  className="w-full rounded-xl bg-[#A94F70] py-3 font-semibold text-white hover:bg-[#843B59] disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
