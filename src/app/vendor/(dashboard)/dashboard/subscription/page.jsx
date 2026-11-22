"use client";

import SubscriptionCard from "@/Components/vendor/SubscriptionCard";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const isPremium = data?.subscription?.plan?.toLowerCase() === "premium";

  // ============================================
  // LOAD SUBSCRIPTION & TRANSACTIONS
  // ============================================

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch("/api/vendor/dashboard/subscription", {
          cache: "no-store",
        });

        const result = await response.json();

        console.log("Subscription API:", result);

        if (!response.ok || !result.subscription) {
          throw new Error(result.message || "Failed to load subscription");
        }

        setData(result);

        // Fetch transactions only for Premium Vendors
        if (result.subscription.plan?.toLowerCase() === "premium") {
          setTransactionLoading(true);

          if (result.transactions) {
            setTransactions(result.transactions);
          }
        }
      } catch (error) {
        console.error("Subscription Error:", error);
        alert(error.message);
      } finally {
        setLoading(false);
        setTransactionLoading(false);
      }
    };

    loadSubscription();
  }, []);

  // ============================================
  // UPGRADE HANDLER
  // ============================================

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);

      alert("Payment gateway integration is not connected yet.");
    } finally {
      setUpgrading(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#A94F70]" size={35} />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="py-20 text-center text-gray-500">
        Unable to load subscription.
      </p>
    );
  }

  // ============================================
  // FORMAT AMOUNT
  // ============================================

  const formatAmount = (amount, currency = "BDT") => {
    const normalizedCurrency = currency.toUpperCase();

    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================
  // TRANSACTION STATUS
  // ============================================

  const getTransactionStatus = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (["success", "paid", "completed"].includes(normalizedStatus)) {
      return {
        label: "Successful",
        icon: CheckCircle2,
        style: "bg-green-50 text-green-700",
      };
    }

    if (normalizedStatus === "pending") {
      return {
        label: "Pending",
        icon: Loader2,
        style: "bg-amber-50 text-amber-700",
      };
    }

    return {
      label: status || "Failed",
      icon: XCircle,
      style: "bg-red-50 text-red-700",
    };
  };

  // ============================================
  // PAGE UI
  // ============================================

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* HEADER */}

      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-[#A94F70]">
          <Crown size={18} />
          VENDOR MEMBERSHIP
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#33232D]">
          Subscription Plans
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Choose the right plan for your wedding business.
        </p>
      </div>

      {/* CURRENT SUBSCRIPTION */}

      <div className="rounded-2xl bg-[#352330] p-6 text-white">
        <p className="text-sm text-pink-200">CURRENT SUBSCRIPTION</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="mt-2 text-2xl font-bold capitalize">
            {data.subscription.plan} Plan
          </h2>

          {isPremium && (
            <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300">
              <Crown size={14} />
              Premium Member
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-300">
          Status: {data.subscription.status}
        </p>

        {data.subscription.expiresAt && (
          <p className="mt-1 text-xs text-gray-400">
            Expires: {formatDate(data.subscription.expiresAt)}
          </p>
        )}
      </div>

      {/* PREMIUM TRANSACTION HISTORY */}

      {isPremium && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          {/* TRANSACTION HEADER */}

          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ReceiptText className="text-[#A94F70]" size={20} />

                <h2 className="text-lg font-bold text-[#33232D]">
                  Recent Transactions
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Your latest premium payment activities.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#A94F70]">
              Last 3
            </span>
          </div>

          {/* TRANSACTION LOADING */}

          {transactionLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-[#A94F70]" size={25} />
            </div>
          ) : transactions.length === 0 ? (
            /* EMPTY STATE */

            <div className="rounded-xl bg-gray-50 py-8 text-center">
              <CreditCard className="mx-auto text-gray-400" size={28} />

              <p className="mt-2 text-sm text-gray-500">
                No transaction history found.
              </p>
            </div>
          ) : (
            /* TRANSACTION LIST */

            <div className="space-y-3">
              {transactions.map((transaction, index) => {
                const status = getTransactionStatus(transaction.status);

                const StatusIcon = status.icon;

                const transactionId =
                  transaction.stripeSessionId ||
                  transaction.transactionId ||
                  transaction.stripePaymentIntent ||
                  transaction.tran_id ||
                  "N/A";

                const paymentDate = transaction.paidAt || transaction.createdAt;

                return (
                  <div
                    key={
                      transaction._id || transaction.stripeSessionId || index
                    }
                    className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center"
                  >
                    {/* LEFT SIDE */}

                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-pink-50 p-3 text-[#A94F70]">
                        <CreditCard size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          Premium Subscription
                        </p>

                        <p className="mt-1 break-all text-xs text-gray-400">
                          Transaction ID: {transactionId}
                        </p>

                        <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                          <CalendarDays size={13} />
                          {formatDate(paymentDate)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Payment Method:{" "}
                          {transaction.paymentMethod || "Stripe"}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <p className="text-base font-bold text-[#A94F70]">
                        {formatAmount(
                          transaction.amount,
                          transaction.currency || "BDT",
                        )}
                      </p>

                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.style}`}
                      >
                        <StatusIcon size={13} />
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBSCRIPTION PLANS */}

      <div className="grid gap-6 md:grid-cols-2">
        {(data?.plans || []).map((plan) => (
          <SubscriptionCard
            key={plan.name}
            plan={plan}
            currentPlan={data?.subscription?.plan}
            onUpgrade={handleUpgrade}
            upgrading={upgrading}
          />
        ))}
      </div>
    </div>
  );
}
