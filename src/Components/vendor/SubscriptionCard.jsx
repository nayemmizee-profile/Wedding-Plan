"use client";

import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";

export default function SubscriptionCard({
  plan,
  currentPlan,
  onUpgrade,
  upgrading,
}) {
  const premium = plan.name.toLowerCase() === "premium";

  const isCurrent = currentPlan === plan.name.toLowerCase();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`relative rounded-3xl border bg-white p-7 ${
        premium
          ? "border-[#A94F70] shadow-xl shadow-pink-100"
          : "border-gray-100 shadow-sm"
      }`}
    >
      {premium && (
        <span className="absolute right-5 top-5 rounded-full bg-[#A94F70] px-3 py-1 text-xs font-semibold text-white">
          Recommended
        </span>
      )}

      <div className="mb-6 inline-flex rounded-xl bg-pink-100 p-3 text-[#A94F70]">
        {premium ? <Crown size={25} /> : <Sparkles size={25} />}
      </div>

      <h2 className="text-2xl font-bold text-[#33232D]">{plan.name} Plan</h2>

      <p className="mt-2 text-sm text-gray-500">
        {plan.name === "Free"
          ? "For vendors starting their business"
          : "For growing wedding businesses"}
      </p>

      <div className="my-7">
        <span className="text-4xl font-bold text-[#33232D]">৳{plan.price}</span>

        {premium && <span className="text-sm text-gray-400"> / month</span>}
      </div>

      <div className="space-y-4">
        {plan.features.map((feature) => (
          <div key={feature} className="flex gap-3 text-sm">
            <Check size={19} className="shrink-0 text-green-600" />
            <span className="text-gray-600">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => premium && onUpgrade()}
        disabled={isCurrent || upgrading}
        className={`mt-9 w-full rounded-xl py-3 font-semibold transition ${
          premium
            ? "bg-[#A94F70] text-white hover:bg-[#843B59]"
            : "bg-gray-100 text-gray-500"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isCurrent
          ? "Current Plan"
          : upgrading
            ? "Processing..."
            : "Upgrade to Premium"}
      </button>
    </motion.div>
  );
}
