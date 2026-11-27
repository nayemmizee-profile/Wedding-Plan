"use client";

import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CalendarCheck,
  Crown,
  Gem,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  // {
  //   name: "Overview",
  //   href: "/vendor/dashboard",
  //   icon: LayoutDashboard,
  // },
  {
    name: "Overview",
    href: "/vendor/dashboard/services",
    icon: BriefcaseBusiness,
  },
  {
    name: "Add Service",
    href: "/vendor/dashboard/services/add",
    icon: PlusCircle,
  },
  {
    name: "Booking Requests",
    href: "/vendor/dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    name: "Subscription",
    href: "/vendor/dashboard/subscription",
    icon: Crown,
  },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#241A23] text-white">
      <Link
        href="/vendor/dashboard"
        className="flex items-center gap-3 border-b border-white/10 px-6 py-7"
      >
        <div className="rounded-xl bg-[#A94F70] p-2.5">
          <Gem size={23} />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-wide">WedPlan</h2>
          <p className="text-xs text-pink-200">Vendor Workspace</p>
        </div>
      </Link>

      <div className="px-4 py-7">
        <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-gray-500">
          MAIN MENU
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/vendor/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeMenu"
                    className="absolute inset-0 z-0 rounded-xl bg-[#A94F70] shadow-lg shadow-pink-950/20"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <Icon className="relative z-10" size={19} />

                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-5">
        <button
          onClick={() =>
            authClient.signOut().then(() => {
              window.location.href = "/login";
            })
          }
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#241A23] p-2 text-white md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      <aside className="hidden min-h-screen w-[270px] shrink-0 md:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-[51] w-[280px] md:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-5 z-10 text-white"
                aria-label="Close sidebar"
              >
                <X />
              </button>

              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
