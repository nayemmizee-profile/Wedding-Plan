"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Plus, XCircle } from "lucide-react";
import Image from "next/image";
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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your submitted services.
          </p>
        </div>

        <Link
          href="/vendor/add-service"
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-white transition hover:bg-teal-700"
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Services", value: services.length },
          { label: "Pending", value: pending },
          { label: "Approved", value: approved },
          { label: "Rejected", value: rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      {/* Services */}
      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            No Services Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            You haven't submitted any services yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const status = statusStyle[service.status] || statusStyle.pending;

            const StatusIcon = status.icon;

            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100">
                  {service.images?.[0] && (
                    <Image
                      src={service.images[0]}
                      alt={service.serviceName}
                      height={100}
                      width={100}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {service.serviceName}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {service.category}
                      </p>
                    </div>

                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                    >
                      <StatusIcon size={14} />
                      {status.label}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-gray-500">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    {service.location}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Service Price</p>
                      <p className="text-lg font-bold text-teal-600">
                        ৳{Number(service.price).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <Link
                      href={`/vendor/my-services/${service._id}`}
                      className="rounded-lg bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
