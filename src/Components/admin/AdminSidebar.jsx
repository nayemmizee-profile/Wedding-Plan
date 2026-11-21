"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BriefcaseBusiness,
  Heart,
  LayoutDashboard,
  Menu,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { useState } from "react";

const menuItems = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Manage Services",
    href: "/admin/services",
    icon: BriefcaseBusiness,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: Wallet,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow lg:hidden"
      >
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64
        border-r border-gray-100 bg-white p-5
        transition-transform duration-300
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-xl bg-pink-600 p-2 text-white">
            <Heart size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">WedPlan</h2>

            <p className="text-xs text-gray-500">Administration</p>
          </div>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-pink-50 text-pink-600 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={19} />

                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-xl bg-pink-50 p-4">
          <p className="text-sm font-semibold text-pink-700">Admin Panel</p>

          <p className="mt-1 text-xs text-gray-500">
            Manage your wedding platform.
          </p>
        </div>
      </aside>
    </>
  );
}
