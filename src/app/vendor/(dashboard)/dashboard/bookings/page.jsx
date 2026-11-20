"use client";

import BookingTable from "@/Components/vendor/BookingTable";
import { CalendarCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/vendor/bookings");
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setBookings(result.bookings || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id, status) => {
    const action = status === "accepted" ? "accept" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this booking?`)) {
      return;
    }

    try {
      setProcessingId(id);

      const response = await fetch(`/api/vendor/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking,
        ),
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    filter === "all" ? true : booking.status === filter,
  );

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div>
        <p className="text-sm font-medium text-[#A94F70]">BOOKING MANAGEMENT</p>

        <h1 className="mt-2 text-3xl font-bold text-[#33232D]">
          Booking Requests
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Review and manage your customer booking requests.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <CalendarCheck size={25} />
          </div>

          <div>
            <p className="text-2xl font-bold text-[#33232D]">{pendingCount}</p>
            <p className="text-sm text-gray-500">Pending Requests</p>
          </div>
        </div>
      </div>

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

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#A94F70]" size={35} />
        </div>
      ) : (
        <BookingTable
          bookings={filteredBookings}
          onAction={handleAction}
          processingId={processingId}
        />
      )}
    </div>
  );
}
