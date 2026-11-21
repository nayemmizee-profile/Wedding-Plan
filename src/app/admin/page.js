"use client";

import StatCard from "@/Components/admin/StatCard";
import { RefreshCw } from "lucide-react";
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
        throw new Error(result.message || "Failed to load dashboard");
      }

      setStats(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const cards = [
    {
      title: "Registered Users",
      value: stats?.totalUsers ?? 0,
      type: "users",
      color: "blue",
      description: "All platform accounts",
    },
    {
      title: "Total Vendors",
      value: stats?.totalVendors ?? 0,
      type: "vendors",
      color: "purple",
      description: "Registered service providers",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      type: "customers",
      color: "green",
      description: "Registered customers",
    },
    {
      title: "Total Services",
      value: stats?.totalServices ?? 0,
      type: "services",
      color: "orange",
      description: "All submitted services",
    },
    {
      title: "Pending Services",
      value: stats?.pendingServices ?? 0,
      type: "pending",
      color: "pink",
      description: "Waiting for approval",
    },
    {
      title: "Total Transactions",
      value: stats?.totalTransactions ?? 0,
      type: "transactions",
      color: "teal",
      description: "Recorded payment transactions",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-pink-600">
            Welcome to WedPlan
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor and manage your entire platform.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Transaction Summary
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Total successfully received payment amount
            </p>

            <p className="mt-4 text-3xl font-bold text-green-600">
              ৳
              {Number(stats?.totalTransactionAmount || 0).toLocaleString(
                "en-BD",
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
