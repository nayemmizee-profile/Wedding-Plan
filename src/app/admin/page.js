"use client";

import {
  BriefcaseBusiness,
  Clock,
  CreditCard,
  RefreshCw,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/overview", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load dashboard data");
      }

      setStats(result.overview);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const dashboardCards = [
    {
      title: "Registered Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Vendors",
      value: stats?.totalVendors ?? 0,
      icon: Store,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      icon: UserRound,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Services",
      value: stats?.totalServices ?? 0,
      icon: BriefcaseBusiness,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Pending Services",
      value: stats?.pendingServices ?? 0,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Total Transactions",
      value: stats?.totalTransactions ?? 0,
      icon: CreditCard,
      color: "bg-pink-50 text-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#359FA0]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-600">{error}</p>

        <button
          onClick={fetchOverview}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-7">
      {/* Dashboard Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your platform activities
          </p>
        </div>

        <button
          onClick={fetchOverview}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-gray-900">
                    {Number(card.value).toLocaleString("en-US")}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Summary */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Transaction Summary
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Total successfully received payment amount
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <CreditCard size={24} />
          </div>
        </div>

        <p className="mt-5 text-3xl font-bold text-green-600">
          $
          {Number(stats?.totalTransactionAmount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <p className="mt-2 text-xs text-gray-400">
          Only successful USD payments are included
        </p>
      </div>
    </section>
  );
}
