"use client";

import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";

export default function UserHeader({ user, setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-rose-100 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl border border-rose-100 p-2.5 text-rose-700 transition hover:bg-rose-50 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-rose-950 sm:text-xl">
            Welcome Back!
          </h1>
          <p className="hidden text-xs text-gray-400 sm:block">
            Manage your wedding plans in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden rounded-xl border border-rose-100 p-2.5 text-gray-500 transition hover:bg-rose-50 sm:block">
          <Search size={19} />
        </button>

        <button className="relative rounded-xl border border-rose-100 p-2.5 text-gray-500 transition hover:bg-rose-50">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-rose-200 bg-rose-100 font-bold text-rose-700">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              height={100}
              width={100}
              className="h-full w-full object-cover"
            />
          ) : (
            user?.name?.charAt(0)?.toUpperCase() || "U"
          )}
        </div>
      </div>
    </header>
  );
}
