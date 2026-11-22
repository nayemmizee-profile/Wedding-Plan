"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle,
  Clock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const statsConfig = [
  {
    key: "totalServices",
    title: "Total Services",
    icon: BriefcaseBusiness,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "activeServices",
    title: "Active Services",
    icon: CheckCircle,
    color: "bg-green-50 text-green-600",
  },
  {
    key: "pendingBookings",
    title: "Pending Requests",
    icon: Clock,
    color: "bg-orange-50 text-orange-600",
  },
  {
    key: "acceptedBookings",
    title: "Accepted Bookings",
    icon: CalendarCheck,
    color: "bg-purple-50 text-purple-600",
  },
];

function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#A94F70] border-t-transparent" />
    </div>
  );
}

function DashboardContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await fetch("/api/vendor/dashboard");
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }

        setData(result.data);
      } catch (error) {
        console.error("Vendor Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!data) {
    return (
      <p className="py-20 text-center text-gray-500">
        Unable to load dashboard data.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-medium text-[#A94F70]">WELCOME BACK</p>

        <h1 className="mt-2 text-2xl font-bold text-[#33232D] md:text-3xl">
          Your Business Overview
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Track your services and manage your wedding bookings.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statsConfig.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={23} />
                </div>

                <ArrowUpRight size={19} className="text-gray-300" />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#33232D]">
                {data[item.key] ?? 0}
              </h2>

              <p className="mt-1 text-sm text-gray-500">{item.title}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#352330] to-[#754257] p-6 text-white md:p-8"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Crown size={21} className="text-pink-300" />
              <span className="text-sm text-pink-200">
                CURRENT SUBSCRIPTION
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold capitalize">
              {data.subscriptionPlan || "Free"} Plan
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              {data.subscriptionPlan === "premium"
                ? "You have unlimited service access."
                : `${data.activeServices} of 3 active services used.`}
            </p>
          </div>

          <Link
            href="/vendor/dashboard/subscription"
            className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-[#754257] transition hover:bg-pink-100"
          >
            Manage Subscription
          </Link>
        </div>

        {data.subscriptionPlan !== "premium" && (
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-pink-300"
              style={{
                width: `${Math.min((data.activeServices / 3) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link
          href="/vendor/dashboard/services/add"
          className="group rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-[#A94F70] hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">Add New Service</h3>
              <p className="mt-2 text-sm text-gray-500">
                Expand your wedding service business.
              </p>
            </div>

            <BriefcaseBusiness className="text-[#A94F70] transition group-hover:scale-110" />
          </div>
        </Link>

        <Link
          href="/vendor/dashboard/bookings"
          className="group rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-[#A94F70] hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">
                Review Booking Requests
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Respond to your customers.
              </p>
            </div>

            <CalendarCheck className="text-[#A94F70] transition group-hover:scale-110" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
