"use client";

import { authClient } from "@/lib/auth-client";
import { CalendarDays, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function BookNowButton({ service }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = () => {
    if (isPending) return;

    if (!session?.user) {
      toast.error("Please login to book a service");
      router.push("/login");
      return;
    }

    if (session.user.role !== "user") {
      toast.error("Only customers can book services");
      return;
    }

    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventDate) {
      toast.error("Please select your event date");
      return;
    }

    if (new Date(eventDate) <= new Date()) {
      toast.error("Please select a future event date");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service._id,
          eventDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking request failed");
      }

      toast.success("Booking request sent to provider!");

      setIsOpen(false);
      setEventDate("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleBook}
        disabled={isPending}
        className="rounded-full bg-[#B77C83] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#925D65] disabled:opacity-50"
      >
        Book Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E9E9] text-[#B77C83]">
                <CalendarDays size={23} />
              </div>

              <h2 className="text-2xl font-semibold text-[#513B3B]">
                Request Booking
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Send a booking request to the service provider.
              </p>
            </div>

            <div className="mb-5 rounded-xl bg-[#FBF7F2] p-4">
              <p className="font-semibold text-[#513B3B]">
                {service.serviceName}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Provider: {service.vendorName}
              </p>

              <p className="mt-1 font-semibold text-[#B77C83]">
                ৳{Number(service.price).toLocaleString("en-BD")}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Event Date
              </label>

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={
                  new Date(Date.now() + 86400000).toISOString().split("T")[0]
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#B77C83]"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-lg bg-[#B77C83] py-3 font-semibold text-white transition hover:bg-[#925D65] disabled:opacity-50"
              >
                {loading ? "Sending Request..." : "Send Booking Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
