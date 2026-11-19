"use client";

import { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

export default function UserDashboardLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF8F8]">
      <div className="flex min-h-screen">
        <UserSidebar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="min-w-0 flex-1">
          <UserHeader user={user} setSidebarOpen={setSidebarOpen} />

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
