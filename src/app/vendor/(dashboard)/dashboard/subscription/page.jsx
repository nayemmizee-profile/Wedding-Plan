"use client";

import SubscriptionCard from "@/Components/vendor/SubscriptionCard";
import { Crown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch("/api/vendor/subscription");
        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        setData(result);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);

      // Payment Gateway Integration will go here.
      alert(
        "Payment Gateway is not connected yet. Please integrate SSLCommerz before activating Premium.",
      );
    } finally {
      setUpgrading(false);
    }
  };

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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
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

      <div className="rounded-2xl bg-[#352330] p-6 text-white">
        <p className="text-sm text-pink-200">CURRENT SUBSCRIPTION</p>

        <h2 className="mt-2 text-2xl font-bold capitalize">
          {data.subscription.plan} Plan
        </h2>

        <p className="mt-2 text-sm text-gray-300">
          Status: {data.subscription.status}
        </p>

        {data.subscription.expiresAt && (
          <p className="mt-1 text-xs text-gray-400">
            Expires:{" "}
            {new Date(data.subscription.expiresAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data.plans.map((plan) => (
          <SubscriptionCard
            key={plan.name}
            plan={plan}
            currentPlan={data.subscription.plan}
            onUpgrade={handleUpgrade}
            upgrading={upgrading}
          />
        ))}
      </div>
    </div>
  );
}
