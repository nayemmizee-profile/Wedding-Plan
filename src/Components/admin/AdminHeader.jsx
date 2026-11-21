"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white px-5 pl-16 md:px-8 md:pl-8">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Administration</h1>

        <p className="hidden text-xs text-gray-500 sm:block">
          Manage your platform from one place
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 sm:flex">
          <ShieldCheck size={16} className="text-green-600" />

          <span className="text-xs font-semibold text-green-700">
            Administrator
          </span>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-gray-800">
            {session?.user?.name || "Admin"}
          </p>

          <p className="text-xs text-gray-500">{session?.user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <LogOut size={17} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
