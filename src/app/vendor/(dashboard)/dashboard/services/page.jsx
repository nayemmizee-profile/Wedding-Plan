"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Plus, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusStyle = {
  pending: {
    color: "bg-amber-50 text-amber-700",
    icon: Clock,
    label: "Pending Review",
  },
  approved: {
    color: "bg-green-50 text-green-700",
    icon: CheckCircle2,
    label: "Approved",
  },
  rejected: {
    color: "bg-red-50 text-red-700",
    icon: XCircle,
    label: "Rejected",
  },
};

export default function VendorServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/vendor/services", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load services");
        }

        setServices(data.services || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const pending = services.filter(
    (service) => service.status === "pending",
  ).length;

  const approved = services.filter(
    (service) => service.status === "approved",
  ).length;

  const rejected = services.filter(
    (service) => service.status === "rejected",
  ).length;

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your services...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#263b42]">My Services</h1>
            <p className="mt-2 text-gray-500">
              Manage your services and track admin approval.
            </p>
          </div>

          <Link
            href="/vendor/dashboard/services/add"
            className="flex items-center gap-2 rounded-xl bg-[#263b42] px-5 py-3 font-semibold text-white hover:bg-[#38545d]"
          >
            <Plus size={19} />
            Add Service
          </Link>
        </div>

        {/* Statistics */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Total Services",
              count: services.length,
            },
            {
              title: "Pending",
              count: pending,
            },
            {
              title: "Approved",
              count: approved,
            },
            {
              title: "Rejected",
              count: rejected,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.title}</p>

              <h2 className="mt-2 text-3xl font-bold text-[#263b42]">
                {item.count}
              </h2>
            </div>
          ))}
        </div>

        {/* Service List */}

        {error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
            <h2 className="text-xl font-bold text-gray-700">No services yet</h2>
            <p className="mt-2 text-gray-500">
              Add your first service to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const status = statusStyle[service.status] || statusStyle.pending;

              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <img
                    src={service.images?.[0]}
                    alt={service.serviceName}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        {service.category}
                      </span>

                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#263b42]">
                      {service.serviceName}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {service.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-lg font-bold text-[#b47b57]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>

                      <p className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={15} />
                        {service.location}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      {service.status === "pending" && (
                        <p className="text-sm text-amber-700">
                          Your service is waiting for admin review.
                        </p>
                      )}

                      {service.status === "approved" && (
                        <p className="text-sm text-green-700">
                          Your service is approved and visible to customers.
                        </p>
                      )}

                      {service.status === "rejected" && (
                        <p className="text-sm text-red-700">
                          Your service was rejected by admin.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
