"use client";

import { RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({ search });

      const response = await fetch(
        `/api/admin/transactions?${params.toString()}`,
        { cache: "no-store" },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load transactions");
      }

      setTransactions(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTransactions, 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>

        <p className="mt-2 text-sm text-gray-500">
          Monitor vendor subscription payment records.
        </p>
      </div>

      <div className="mb-5 flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor, email or transaction ID..."
            className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none focus:border-pink-400"
          />
        </div>

        <button
          onClick={fetchTransactions}
          className="rounded-xl bg-gray-100 p-3"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Vendor</th>
                <th className="px-5 py-4">Subscription</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment Status</th>
                <th className="px-5 py-4">Transaction ID</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {transaction.vendorName || "Unknown Vendor"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {transaction.vendorEmail || transaction.vendorId}
                      </p>
                    </td>

                    <td className="px-5 py-4">{transaction.plan}</td>

                    <td className="px-5 py-4 font-semibold">
                      {transaction.currency || "BDT"}{" "}
                      {Number(transaction.amount || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.status === "succeeded"
                            ? "bg-green-50 text-green-600"
                            : transaction.status === "failed"
                              ? "bg-red-50 text-red-600"
                              : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {transaction.stripeSessionId || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
        Payment records are read-only. Payment status can only be confirmed
        through verified payment gateway events.
      </div>
    </div>
  );
}
