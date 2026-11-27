"use client";

import VendorHeader from "@/Components/vendor/VendorHeader";
import VendorSidebar from "@/Components/vendor/VendorSidebar";

export default function VendorDashboardLayout({ user, children }) {
  return (
    <div className="min-h-screen bg-[#FCF7F9]">
      {/* Fixed Sidebar */}
      <VendorSidebar />

      {/* Dashboard Content Area */}
      <div className="min-h-screen md:ml-[270px]">
        {/* Sticky Header */}
        <VendorHeader user={user} />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-76px)] p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
