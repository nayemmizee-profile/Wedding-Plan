"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  PartyPopper,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import Image from "next/image";

const statsConfig = [
  {
    key: "totalBookings",
    title: "Total Bookings",
    subtitle: "All your booking requests",
    icon: CalendarDays,
    color: "bg-rose-50 text-rose-600",
  },
  {
    key: "pendingBookings",
    title: "Pending",
    subtitle: "Waiting for confirmation",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    key: "confirmedBookings",
    title: "Confirmed",
    subtitle: "Accepted by vendors",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "totalFavorites",
    title: "Favorites",
    subtitle: "Your saved vendors",
    icon: Heart,
    color: "bg-pink-50 text-pink-600",
  },
];

function formatDate(date) {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysRemaining(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const event = new Date(date);
  event.setHours(0, 0, 0, 0);

  return Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-600",
    cancelled: "bg-gray-100 text-gray-600",
  };

  const labels = {
    pending: "Pending",
    accepted: "Confirmed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default function UserDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/user/dashboard", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load dashboard");
      }

      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-rose-600" size={35} />
          <p className="mt-4 text-sm text-gray-500">
            Preparing your wedding dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <XCircle size={40} className="text-red-500" />

        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <button
          onClick={fetchDashboard}
          className="mt-5 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const bookings = dashboard?.recentBookings || [];
  const upcomingEvent = dashboard?.upcomingEvent;

  const daysLeft = upcomingEvent
    ? getDaysRemaining(upcomingEvent.eventDate)
    : null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-800 via-rose-600 to-pink-500 p-7 text-white shadow-xl shadow-rose-100 sm:p-10"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur">
            <Sparkles size={15} />
            YOUR WEDDING JOURNEY
          </div>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Your Dream Wedding,
            <br />
            Beautifully Organized.
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-rose-50 sm:text-base">
            Manage your wedding bookings, discover trusted vendors and make
            every moment of your special day unforgettable.
          </p>

          <Link
            href="/vendors"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-rose-700 shadow-lg transition hover:-translate-y-1 hover:bg-rose-50"
          >
            Explore Vendors
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />

        <div className="absolute -bottom-28 right-28 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <Sparkles
          className="absolute right-12 top-12 text-white/30"
          size={50}
        />
      </motion.section>

      {/* Statistics */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-rose-950">
              Dashboard Overview
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              A quick look at your wedding planning activities.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-800"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm transition hover:shadow-lg hover:shadow-rose-100"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight size={18} className="text-gray-300" />
                </div>

                <h3 className="mt-5 text-3xl font-extrabold text-rose-950">
                  {stats[stat.key] ?? 0}
                </h3>

                <p className="mt-1 font-bold text-gray-700">{stat.title}</p>

                <p className="mt-1 text-xs text-gray-400">{stat.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Wedding Event */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-rose-950">
            Your Upcoming Event
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Keep track of your confirmed wedding services.
          </p>
        </div>

        {upcomingEvent ? (
          <div className="relative overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 p-6 sm:p-8">
            <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-rose-600">
                  <CalendarCheck size={15} />
                  CONFIRMED EVENT
                </div>

                <h3 className="mt-4 text-2xl font-extrabold text-rose-950">
                  {upcomingEvent.serviceName}
                </h3>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-rose-500" />
                    {formatDate(upcomingEvent.eventDate)}
                  </span>

                  {upcomingEvent.eventLocation && (
                    <span className="flex items-center gap-2">
                      <MapPin size={16} className="text-rose-500" />
                      {upcomingEvent.eventLocation}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Vendor: {upcomingEvent.vendorName}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <PartyPopper className="mx-auto text-rose-500" size={28} />

                <p className="mt-2 text-4xl font-extrabold text-rose-700">
                  {daysLeft}
                </p>

                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {daysLeft === 0 ? "Event is today!" : "Days Remaining"}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-rose-200/30 blur-3xl" />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 p-8 text-center">
            <CalendarDays className="mx-auto text-rose-400" size={35} />

            <h3 className="mt-3 font-bold text-rose-950">
              No Upcoming Confirmed Events
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Once a vendor accepts your booking, your upcoming event will
              appear here.
            </p>

            <Link
              href="/vendors"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700"
            >
              Find Vendors
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-rose-950">
              Recent Bookings
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Your latest vendor booking requests.
            </p>
          </div>

          <Link
            href="/user/my-bookings"
            className="text-sm font-bold text-rose-600 transition hover:text-rose-800"
          >
            View All
            <ArrowRight className="ml-1 inline" size={15} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <CalendarDays className="mx-auto text-rose-300" size={40} />

            <h3 className="mt-3 font-bold text-gray-800">No Bookings Yet</h3>

            <p className="mt-2 text-sm text-gray-500">
              Start planning your dream wedding by booking your favorite
              vendors.
            </p>

            <Link
              href="/vendors"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700"
            >
              Explore Vendors
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-rose-50/70 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Event Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-rose-50">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-rose-50/40"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {booking.serviceImage ? (
                          <Image
                            src={booking.serviceImage}
                            alt={booking.serviceName}
                            height={100}
                            width={100}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                            <Heart size={20} />
                          </div>
                        )}

                        <span className="font-bold text-gray-800">
                          {booking.serviceName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {booking.vendorName}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500">
                      {formatDate(booking.eventDate)}
                    </td>

                    <td className="px-6 py-5 text-sm font-bold text-rose-700">
                      {booking.price != null
                        ? `৳${Number(booking.price).toLocaleString("en-BD")}`
                        : "N/A"}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#244F42] p-7 text-center text-white sm:flex-row sm:text-left">
        <div>
          <h2 className="text-xl font-extrabold">
            Still Planning Your Big Day?
          </h2>

          <p className="mt-2 text-sm text-white/70">
            Discover talented professionals for your perfect wedding
            celebration.
          </p>
        </div>

        <Link
          href="/vendors"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#244F42] transition hover:-translate-y-1"
        >
          Browse Vendors
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
