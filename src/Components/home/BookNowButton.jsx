"use client";

import { authClient } from "@/lib/auth-client";
import { CalendarDays, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function BookNowButton({ service }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);

  const submittingRef = useRef(false);

  // Tomorrow's date in local timezone
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const minDate = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
    setEventDate("");
  };

  // Open modal
  const handleBook = () => {
    if (isPending) {
      toast.error("Please wait, checking your account...");
      return;
    }

    if (!session?.user) {
      toast.error("Please login to book a service");
      router.push("/login");
      return;
    }

    const role = session.user.accountType || session.user.role;

    if (role !== "user") {
      toast.error("Only customers can book services");
      return;
    }

    setIsOpen(true);
  };

  // Close modal manually
  const handleClose = () => {
    if (submittingRef.current) return;

    closeModal();
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) return;

    if (!eventDate) {
      toast.error("Please select your event date");
      closeModal();
      return;
    }

    if (eventDate < minDate) {
      toast.error("Please select a future event date");
      closeModal();
      return;
    }

    try {
      submittingRef.current = true;
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

      // Duplicate booking error
      if (response.status === 409) {
        toast.error(data.message || "You have already booked this service.");

        closeModal();
        return;
      }

      // Other API errors
      if (!response.ok || !data.success) {
        toast.error(data.message || "Booking request failed.");

        closeModal();
        return;
      }

      // Booking successful
      toast.success(data.message || "Booking request sent successfully!");

      closeModal();
    } catch (error) {
      console.error("Booking submission error:", error);

      toast.error("Unable to submit booking. Please try again.");

      closeModal();
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      {/* Book Now Button */}
      <button
        type="button"
        onClick={handleBook}
        className="rounded-full bg-[#B77C83] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#925D65]"
      >
        Book Now
      </button>

      {/* Booking Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close modal"
              className="absolute right-4 top-4 text-gray-500 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {/* Header */}
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

            {/* Service Details */}
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

            {/* Booking Form */}
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="eventDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Event Date
              </label>

              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={minDate}
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-[#B77C83] focus:ring-2 focus:ring-[#B77C83]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-lg bg-[#B77C83] py-3 font-semibold text-white transition hover:bg-[#925D65] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending Request..." : "Send Booking Request"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-400">
              Your booking request will be reviewed by the service provider.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
