"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function MyBookingsContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load bookings");
        }

        if (active) {
          setBookings(data.bookings || []);
        }
      } catch (error) {
        if (active) {
          toast.error(error.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="py-10 text-center">Loading your bookings...</p>;
  }

  return (
    <main className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#513B3B]">My Bookings</h2>

        <p className="text-sm text-gray-500">
          Track your booking requests and provider responses.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          You have not booked any services yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FBF7F2] text-[#513B3B]">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {booking.serviceImage && (
                        <Image
                          src={booking.serviceImage}
                          alt={booking.serviceName || "Service"}
                          height={100}
                          width={100}
                          unoptimized
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}

                      <span className="font-medium">{booking.serviceName}</span>
                    </div>
                  </td>

                  <td className="p-4">{booking.vendorName}</td>

                  <td className="p-4">
                    {booking.eventDate
                      ? new Date(booking.eventDate).toLocaleDateString()
                      : "Not specified"}
                  </td>

                  <td className="p-4">${Number(booking.price)}</td>

                  <td className="p-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function BookingsFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="h-16 rounded-xl bg-gray-100" />
      <div className="h-64 rounded-xl bg-gray-100" />
    </div>
  );
}

export default function MyBookings() {
  return (
    <Suspense fallback={<BookingsFallback />}>
      <MyBookingsContent />
    </Suspense>
  );
}
