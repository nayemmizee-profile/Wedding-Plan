"use client";

import { CheckCircle2, CreditCard, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search);
      if (status) params.set("status", status);

      const response = await fetch(
        `/api/admin/transactions?${params.toString()}`,
        { cache: "no-store" },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load transactions");
      }

      setTransactions(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTransactions, 350);
    return () => clearTimeout(timer);
  }, [search, status]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "USD").toUpperCase(),
    }).format(Number(amount || 0));
  };

  const getStatusStyle = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-orange-50 text-orange-700";

      case "processing":
        return "bg-blue-50 text-blue-700";

      case "failed":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const paidTransactions = transactions.filter(
    (item) => item.status === "paid",
  ).length;

  const totalAmount = transactions
    .filter((item) => item.status === "paid")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>

        <p className="mt-2 text-sm text-gray-500">
          Monitor and manage all vendor subscription payment records.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {transactions.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Successful Payments</p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {paidTransactions}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {totalAmount.toLocaleString()} USD in current results
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor, email or transaction ID..."
            className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none focus:border-pink-400"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-pink-400"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Transaction Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900">All Payment Records</h2>

          <p className="mt-1 text-xs text-gray-500">
            Complete transaction and vendor information.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1450px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Vendor</th>
                <th className="px-5 py-4">Subscription</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment Status</th>
                <th className="px-5 py-4">Stripe Session ID</th>
                <th className="px-5 py-4">Payment Intent</th>
                <th className="px-5 py-4">Created At</th>
                <th className="px-5 py-4">Paid At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Vendor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {transaction.vendorImage ? (
                          <img
                            src={transaction.vendorImage}
                            alt={transaction.vendorName}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-500">
                            {transaction.vendorName?.charAt(0) || "V"}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-800">
                            {transaction.vendorName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {transaction.vendorEmail}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            ID: {transaction.vendorId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subscription */}
                    <td className="px-5 py-4">
                      <p className="font-semibold capitalize text-gray-800">
                        {transaction.plan}
                      </p>

                      <p className="mt-1 text-xs capitalize text-green-600">
                        {transaction.subscriptionPlan || "No Plan"}
                        {" · "}
                        {transaction.subscriptionStatus || "Unknown"}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    {/* Session ID */}
                    <td className="max-w-[220px] px-5 py-4">
                      <p
                        title={transaction.stripeSessionId}
                        className="break-all text-xs text-gray-500"
                      >
                        {transaction.stripeSessionId || "—"}
                      </p>
                    </td>

                    {/* Payment Intent */}
                    <td className="max-w-[200px] px-5 py-4">
                      <p
                        title={transaction.stripePaymentIntent}
                        className="break-all text-xs text-gray-500"
                      >
                        {transaction.stripePaymentIntent || "—"}
                      </p>
                    </td>

                    {/* Created Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </td>

                    {/* Paid Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                      {formatDate(transaction.paidAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Showing {transactions.length} transaction records.
        </div>
      </div>

      {/* Information */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
        Payment records are read-only. Payment verification and premium
        activation are handled by the backend.
      </div>
    </div>
  );
}
