"use client";

import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function BookServicePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [eventDate, setEventDate] = useState("");

  // Get today's date for minimum date
  const today = new Date().toISOString().split("T")[0];

  // Fetch Service Details
  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/services/${id}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load service");
        }

        setService(result.service);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Confirm Booking
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login to book a service");
      router.push("/login");
      return;
    }

    if (session.user.role !== "user") {
      toast.error("Only customers can book services");
      return;
    }

    if (!eventDate) {
      toast.error("Please select an event date");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: id,
          eventDate,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Booking request submitted successfully!");

      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading Session or Service
  if (loading || isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-rose-950">Service Not Found</h2>

        <Link
          href="/services"
          className="rounded-xl bg-rose-600 px-6 py-3 text-white"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  const image = service.images?.[0] || service.image;

  return (
    <main className="min-h-screen bg-rose-50/40 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-rose-700"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wider text-rose-600">
            BOOK YOUR WEDDING SERVICE
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-rose-950">
            Complete Your Booking
          </h1>

          <p className="mt-2 text-gray-500">
            Submit your booking request to the service provider.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-2">
          {/* Service Information */}
          <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
            {image && (
              <img
                src={image}
                alt={service.serviceName}
                className="h-64 w-full object-cover"
              />
            )}

            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-bold text-rose-950">
                {service.serviceName}
              </h2>

              <p className="text-sm leading-7 text-gray-500">
                {service.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={18} className="text-rose-500" />
                {service.location || "Location not specified"}
              </div>

              <div className="border-t border-rose-100 pt-4">
                <p className="text-sm text-gray-500">Booking Price</p>

                <h3 className="mt-1 text-3xl font-extrabold text-rose-700">
                  ${service.price}
                </h3>
              </div>

              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-xs text-gray-500">Service Provider</p>

                <p className="mt-1 font-bold text-rose-950">
                  {service.vendorName}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleBooking}
            className="space-y-6 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-xl font-bold text-rose-950">
                Booking Information
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Your personal information
              </p>
            </div>

            {/* Customer Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Customer Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-gray-50 px-4 py-3">
                <User size={18} className="text-rose-500" />

                <input
                  type="text"
                  value={session?.user?.name || ""}
                  readOnly
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Customer Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-gray-50 px-4 py-3">
                <Mail size={18} className="text-rose-500" />

                <input
                  type="email"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Date
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-rose-100 px-4 py-3 focus-within:border-rose-400">
                <CalendarDays size={18} className="text-rose-500" />

                <input
                  type="date"
                  min={today}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-4 font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>

            <p className="text-center text-xs leading-5 text-gray-400">
              Your request will be sent to the vendor for approval.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
