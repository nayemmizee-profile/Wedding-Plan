"use client";

import BookingTable from "@/Components/vendor/BookingTable";
import { CalendarCheck, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");

  const [counts, setCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Fetch vendor bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/vendor/dashboard/bookings?status=${filter}`,
        { cache: "no-store" },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load bookings");
      }

      setBookings(result.bookings || []);

      setCounts(
        result.counts || {
          pending: 0,
          accepted: 0,
          rejected: 0,
        },
      );
    } catch (error) {
      console.error("Booking Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Accept / Reject booking
  const handleAction = async (id, status) => {
    const action = status === "accepted" ? "accept" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this booking?`)) {
      return;
    }

    try {
      setProcessingId(id);

      const response = await fetch(`/api/vendor/dashboard/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update booking");
      }

      // Refresh bookings and counts
      await fetchBookings();
    } catch (error) {
      console.error("Booking Action Error:", error);
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[#A94F70]">BOOKING MANAGEMENT</p>

        <h1 className="mt-2 text-3xl font-bold text-[#33232D]">
          Booking Requests
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Review and manage your customer booking requests.
        </p>
      </div>

      {/* Pending Requests */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <CalendarCheck size={25} />
          </div>

          <div>
            <p className="text-2xl font-bold text-[#33232D]">
              {counts.pending}
            </p>

            <p className="text-sm text-gray-500">Pending Requests</p>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "accepted", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium capitalize transition ${
              filter === status
                ? "bg-[#A94F70] text-white"
                : "border bg-white text-gray-600 hover:border-[#A94F70]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Booking Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#A94F70]" size={35} />
        </div>
      ) : (
        <BookingTable
          bookings={bookings}
          onAction={handleAction}
          processingId={processingId}
        />
      )}
    </div>
  );
}
