"use client";

import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  {
    name: "Overview",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Bookings",
    href: "/user/my-bookings",
    icon: CalendarDays,
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    name: "Profile Settings",
    href: "/user/profile",
    icon: UserRound,
  },
];

export default function UserSidebar({ user, sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-y-0 z-50 bg-black/40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : undefined,
        }}
        className={`
          fixed inset-y-0 z-50 left-0  flex w-72 flex-col
          border-r border-rose-100 bg-white
          transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-rose-100 px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-600 p-2.5 text-white shadow-lg shadow-rose-200">
              <HeartHandshake size={23} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-rose-950">
                Wed<span className="text-rose-600">Plan</span>
              </h2>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-gray-400">
                User Dashboard
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="mx-4 mt-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-rose-200 font-bold text-rose-700">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-rose-950">
                {user?.name || "User"}
              </h3>
              <p className="truncate text-xs text-rose-500">{user?.email}</p>
            </div>
          </div>

          <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
            Customer Account
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-7">
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[2px] text-gray-400">
            Main Menu
          </p>

          {menuItems.map((item, index) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href === "/user/dashboard" &&
                pathname === "/user/dashboard");

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group relative flex items-center gap-3
                    rounded-xl px-4 py-3 text-sm font-semibold
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                        : "text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                    }
                  `}
                >
                  <Icon size={19} />

                  <span>{item.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="active-menu"
                      className="absolute inset-0 -z-10 rounded-xl bg-rose-600"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-rose-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            Sign Out
          </button>

          <p className="mt-4 text-center text-[11px] text-gray-400">
            © 2026 WedPlan. All rights reserved.
          </p>
        </div>
      </motion.aside>
    </>
  );
}
