"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crown,
  Infinity,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const features = [
  "Unlimited service publishing",
  "Showcase all your wedding services",
  "Reach more potential customers",
  "Lifetime premium membership",
  "No monthly or yearly subscription",
];

export default function VendorUpgradeContent({ canceled }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Checkout Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Payment initialization failed");
      }

      if (!data.url) {
        throw new Error("Stripe Checkout URL missing");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Upgrade Error:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f7fc] px-4 py-10">
      {/* Animated Background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 35, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-violet-200/50 blur-[90px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, -30, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-200/50 blur-[90px]"
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full max-w-[760px]"
      >
        {/* Header */}
        <div className="mb-7 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[2px] text-violet-700 shadow-sm"
          >
            <Sparkles size={13} />
            Vendor Premium
          </motion.div>

          <h1 className="text-2xl font-black tracking-tight text-[#20203c] md:text-3xl">
            Unlock Your Business
            <span className="block text-violet-600">Without Limits.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Upgrade once and enjoy unlimited service publishing with lifetime
            premium access.
          </p>
        </div>

        {/* Cancel Message */}
        {canceled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-medium text-amber-800"
          >
            Payment canceled. You can upgrade whenever you're ready.
          </motion.div>
        )}

        {/* Pricing Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-[24px] border border-white bg-white shadow-[0_20px_60px_-20px_rgba(79,55,150,0.22)]"
        >
          {/* Top Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#252344] via-[#37306a] to-[#5542a0] px-6 py-5 text-white">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-3 -top-8 opacity-[0.08]"
            >
              <Crown size={140} />
            </motion.div>

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm"
                >
                  <Crown size={24} className="text-amber-300" />
                </motion.div>

                <div>
                  <h2 className="text-lg font-extrabold">Premium Membership</h2>
                  <p className="mt-0.5 text-[11px] text-violet-200">
                    Grow your wedding business
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-emerald-300/20 bg-emerald-400/15 px-3 py-1.5 text-[10px] font-bold text-emerald-200">
                LIFETIME
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="grid gap-6 p-5 md:grid-cols-[1fr_0.85fr] md:gap-8 md:p-7">
            {/* Features */}
            <div>
              <h3 className="mb-4 text-sm font-extrabold text-[#252344]">
                What you'll unlock
              </h3>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <Check size={14} strokeWidth={3} />
                    </span>

                    <p className="text-xs font-medium text-gray-600">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3">
                <ShieldCheck size={19} className="text-emerald-600" />
                <p className="text-[11px] text-gray-500">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-indigo-50/60 p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[2px] text-violet-600">
                One-time payment
              </p>

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-2 flex items-end gap-2"
              >
                <span className="text-5xl font-black tracking-tighter text-[#252344]">
                  $199
                </span>
                <span className="mb-2 text-[11px] text-gray-500">
                  USD / lifetime
                </span>
              </motion.div>

              <p className="mt-3 text-[11px] leading-5 text-gray-500">
                Pay once. Enjoy unlimited service listings forever.
              </p>

              <div className="my-4 h-px bg-violet-200/70" />

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Free plan</span>
                <strong className="text-gray-700">3 Services</strong>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-500">Premium plan</span>
                <strong className="text-emerald-600">Unlimited</strong>
              </div>

              {/* Stripe Checkout Form */}

              <motion.button
                type="button"
                onClick={handleUpgrade}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.035 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-violet-200 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Redirecting to Stripe..." : "Upgrade Now"}

                {!loading && <ArrowRight size={16} />}
              </motion.button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <Lock size={11} />
                Secure Stripe Checkout
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex items-center justify-center gap-5 text-[10px] font-semibold text-gray-400"
        >
          <span className="flex items-center gap-1.5">
            <Infinity size={14} />
            Unlimited Listings
          </span>

          <span className="h-3 w-px bg-gray-300" />

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Secure Payment
          </span>
        </motion.div>
      </motion.div>
    </main>
  );
}
