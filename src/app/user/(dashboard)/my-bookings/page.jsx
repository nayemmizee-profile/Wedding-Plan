"use client";

import { motion } from "framer-motion";
import { CalendarDays, Loader2, PackageOpen, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Customer Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/bookings", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load bookings");
        }

        setBookings(result.bookings || []);
      } catch (error) {
        console.error("My Bookings Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Search Bookings
  const filteredBookings = bookings.filter((booking) =>
    [booking.serviceName, booking.vendorName, booking.status]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase()),
      ),
  );

  // Status Colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-rose-950">My Bookings</h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage and track all your wedding service bookings.
        </p>
      </div>

      {/* Booking History Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-rose-100 p-3 text-rose-600">
            <CalendarDays size={22} />
          </div>

          <div>
            <h2 className="font-bold text-rose-950">Booking History</h2>

            <p className="text-xs text-gray-400">
              {bookings.length} Total Bookings
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="w-full rounded-xl border border-rose-100 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center rounded-2xl bg-white py-20">
          <Loader2 size={35} className="animate-spin text-rose-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-rose-100 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <PackageOpen size={30} />
          </div>

          <h3 className="text-lg font-bold text-rose-950">
            {search
              ? "No matching bookings found"
              : "Your bookings will appear here"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
            {search
              ? "Try searching with another service or vendor name."
              : "Once you book a wedding service, you will be able to track its status and details from this page."}
          </p>
        </div>
      ) : (
        /* Booking List */
        <div className="grid gap-5">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-rose-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Service Image */}
                <div className="h-36 w-full overflow-hidden rounded-xl bg-rose-50 sm:w-44">
                  {booking.serviceImage ? (
                    <Image
                      src={booking.serviceImage}
                      alt={booking.serviceName || "Service"}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-rose-300">
                      <CalendarDays size={35} />
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-rose-950">
                        {booking.serviceName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Vendor: {booking.vendorName}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        booking.status,
                      )}`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                    <p>
                      Event Date:{" "}
                      {booking.eventDate
                        ? new Date(booking.eventDate).toLocaleDateString()
                        : "Not specified"}
                    </p>

                    <p>
                      Booking Date:{" "}
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-rose-50 pt-3">
                    <p className="text-sm text-gray-500">Booking Amount</p>

                    <p className="text-lg font-bold text-rose-700">
                      ${booking.price ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
