"use client";

import { motion } from "framer-motion";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-rose-950">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your personal account information.
        </p>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex items-center gap-3 border-b border-rose-100 pb-5">
          <div className="rounded-xl bg-rose-100 p-3 text-rose-600">
            <UserRound size={22} />
          </div>

          <div>
            <h2 className="font-bold text-rose-950">Personal Information</h2>
            <p className="text-xs text-gray-400">Your account details</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Your full name"
                disabled
                className="w-full rounded-xl border border-rose-100 bg-rose-50/50 py-3 pl-11 pr-4 text-sm text-gray-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="Your email address"
                disabled
                className="w-full rounded-xl border border-rose-100 bg-rose-50/50 py-3 pl-11 pr-4 text-sm text-gray-600 outline-none"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-rose-600" />
            <p className="text-xs leading-6 text-rose-800">
              Your account information is protected. Profile editing and saving
              will be connected to your authentication system in the next step.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
