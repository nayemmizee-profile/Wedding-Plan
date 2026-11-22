"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, MapPin, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
  onAvailability,
}) {
  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image
          src={service.image}
          alt={service.serviceName}
          className="h-full w-full object-cover transition duration-500 hover:scale-110"
        />

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            statusColors[service.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {service.status}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-medium text-[#A94F70]">
            {service.category}
          </p>

          <h3 className="mt-1 text-lg font-bold text-[#33232D]">
            {service.serviceName}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={15} />
            {service.location}
          </p>

          <p className="font-bold text-[#A94F70]">
            ${Number(service.price).toLocaleString("en-US")}
          </p>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <button
            onClick={() => onAvailability(service)}
            className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-[#A94F70]"
            disabled={service.status !== "approved"}
          >
            {service.availability ? <Eye size={17} /> : <EyeOff size={17} />}
            {service.availability ? "Available" : "Unavailable"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(service)}
              className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
              aria-label="Edit service"
            >
              <Pencil size={17} />
            </button>

            <button
              onClick={() => onDelete(service._id)}
              className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
              aria-label="Delete service"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
