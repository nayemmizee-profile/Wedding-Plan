"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Total Bookings",
    value: "08",
    subtitle: "All your bookings",
    icon: CalendarDays,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Pending Bookings",
    value: "03",
    subtitle: "Waiting for confirmation",
    icon: Clock,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Completed",
    value: "04",
    subtitle: "Successfully completed",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Favorites",
    value: "12",
    subtitle: "Your saved vendors",
    icon: Heart,
    color: "bg-pink-100 text-pink-600",
  },
];

const recentBookings = [
  {
    id: 1,
    vendor: "Dream Wedding Photography",
    category: "Photography",
    date: "December 15, 2026",
    status: "Confirmed",
    price: "$450",
  },
  {
    id: 2,
    vendor: "Royal Event Decor",
    category: "Decoration",
    date: "December 20, 2026",
    status: "Pending",
    price: "$800",
  },
  {
    id: 3,
    vendor: "Elegant Catering",
    category: "Catering",
    date: "January 05, 2027",
    status: "Completed",
    price: "$600",
  },
];

export default function UserDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-700 via-rose-600 to-pink-500 p-7 text-white shadow-xl shadow-rose-200 sm:p-10"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={15} />
            YOUR WEDDING JOURNEY
          </div>

          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Plan Your Dream Wedding
            <br />
            With WedPlan
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-rose-50 sm:text-base">
            Everything you need to organize your special day. Manage your
            bookings and discover trusted wedding vendors.
          </p>

          <a
            href="/vendors"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-rose-700 shadow-lg transition hover:-translate-y-1 hover:bg-rose-50"
          >
            Explore Vendors
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
        <div className="absolute -bottom-28 right-28 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      </motion.section>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-rose-950">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            A quick look at your wedding planning activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-rose-100"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight size={18} className="text-gray-300" />
                </div>

                <h3 className="mt-5 text-3xl font-extrabold text-rose-950">
                  {stat.value}
                </h3>

                <p className="mt-1 font-bold text-gray-700">{stat.title}</p>

                <p className="mt-1 text-xs text-gray-400">{stat.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-rose-950">
              Recent Bookings
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Your latest vendor bookings.
            </p>
          </div>

          <a
            href="/user/my-bookings"
            className="text-sm font-bold text-rose-600 transition hover:text-rose-800"
          >
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-rose-50/70 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Event Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-rose-50">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-rose-50/40">
                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-800">{booking.vendor}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {booking.category}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-500">
                    {booking.date}
                  </td>

                  <td className="px-6 py-5 text-sm font-bold text-rose-700">
                    {booking.price}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-600"
                          : booking.status === "Pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
