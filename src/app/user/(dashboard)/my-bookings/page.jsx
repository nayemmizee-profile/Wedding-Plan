"use client";

import { motion } from "framer-motion";
import { CalendarDays, Search } from "lucide-react";

export default function MyBookingsPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-rose-950">My Bookings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage and track all your wedding service bookings.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-rose-100 p-3 text-rose-600">
            <CalendarDays size={22} />
          </div>
          <div>
            <h2 className="font-bold text-rose-950">Booking History</h2>
            <p className="text-xs text-gray-400">
              Your service booking records
            </p>
          </div>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            placeholder="Search bookings..."
            className="w-full rounded-xl border border-rose-100 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <CalendarDays size={30} />
        </div>

        <h3 className="text-lg font-bold text-rose-950">
          Your bookings will appear here
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
          Once you book a wedding service, you will be able to track its status
          and details from this page.
        </p>
      </div>
    </motion.section>
  );
}
