"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function VendorBookingContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/vendor/bookings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (bookingId, action) => {
    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `/api/vendor/bookings/${bookingId}/${action}`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update booking");
      }

      toast.success(data.message || "Booking updated successfully");

      await fetchBookings();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="py-10 text-center">Loading booking requests...</p>;
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#513B3B]">Booking Requests</h2>

        <p className="text-sm text-gray-500">
          Review and manage your service booking requests.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          No booking requests found.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex gap-4">
                {booking.serviceImage && (
                  <Image
                    src={booking.serviceImage}
                    alt={booking.serviceName || "Service"}
                    height={100}
                    width={100}
                    unoptimized
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                )}

                <div>
                  <h3 className="font-bold text-[#513B3B]">
                    {booking.serviceName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Customer: {booking.userName}
                  </p>

                  <p className="text-sm text-gray-500">{booking.userEmail}</p>

                  <p className="mt-1 font-semibold text-[#B77C83]">
                    ৳{Number(booking.price || 0).toLocaleString("en-BD")}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  Event Date:{" "}
                  {booking.eventDate
                    ? new Date(booking.eventDate).toLocaleDateString()
                    : "Not specified"}
                </p>

                <p>
                  Request Date:{" "}
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {(booking.status || "pending").toUpperCase()}
                </span>
              </div>

              {booking.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleAction(booking._id, "accept")}
                    disabled={updatingId === booking._id}
                    className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {updatingId === booking._id ? "Updating..." : "Accept"}
                  </button>

                  <button
                    onClick={() => handleAction(booking._id, "reject")}
                    disabled={updatingId === booking._id}
                    className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {updatingId === booking._id ? "Updating..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function BookingFallback() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-56 rounded bg-gray-200" />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-56 rounded-2xl bg-gray-100" />
        <div className="h-56 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function VendorBookingRequests() {
  return (
    <Suspense fallback={<BookingFallback />}>
      <VendorBookingContent />
    </Suspense>
  );
}
