"use client";

import { motion } from "framer-motion";
import { CalendarDays, Check, Clock, Mail, MapPin, X } from "lucide-react";
import Image from "next/image";

export default function BookingTable({ bookings, onAction, processingId }) {
  if (!bookings.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-white py-20 text-center">
        <CalendarDays size={40} className="mx-auto text-gray-300" />
        <h3 className="mt-4 font-semibold text-gray-700">
          No Booking Requests
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          New customer requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => (
        <motion.div
          key={booking._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="flex gap-4">
              <Image
                src={booking.serviceImage || "/placeholder.png"}
                alt={booking.serviceName}
                height={100}
                width={100}
                className="h-20 w-20 rounded-xl object-cover"
              />

              <div>
                <h3 className="font-bold text-[#33232D]">
                  {booking.serviceName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Customer: {booking.customerName}
                </p>

                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Mail size={14} />
                  {booking.customerEmail}
                </p>
              </div>
            </div>

            <span
              className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                booking.status === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : booking.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays size={17} className="text-[#A94F70]" />
              {booking.eventDate
                ? new Date(booking.eventDate).toLocaleDateString()
                : "Date not provided"}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={17} className="text-[#A94F70]" />
              {booking.eventLocation}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500">
              CUSTOMER MESSAGE
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {booking.message || "No message provided."}
            </p>
          </div>

          {booking.status === "pending" && (
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                disabled={processingId === booking._id}
                onClick={() => onAction(booking._id, "rejected")}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <X size={17} />
                Reject
              </button>

              <button
                disabled={processingId === booking._id}
                onClick={() => onAction(booking._id, "accepted")}
                className="flex items-center gap-2 rounded-xl bg-[#A94F70] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#843B59] disabled:opacity-50"
              >
                <Check size={17} />
                Accept
              </button>
            </div>
          )}

          {booking.status !== "pending" && (
            <p className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-400">
              <Clock size={14} />
              This booking has already been processed.
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
