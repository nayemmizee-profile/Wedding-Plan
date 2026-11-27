import VendorHeader from "@/Components/vendor/VendorHeader";
import VendorSidebar from "@/Components/vendor/VendorSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function VendorLayoutContent({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Vendor check must use accountType, not role
  if (session.user.accountType !== "vendor") {
    redirect("/user/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FAF7F8] md:flex">
      <VendorSidebar />

      <div className="min-w-0 flex-1">
        <VendorHeader user={session.user} />

        <main className="p-4 md:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}

export default function VendorLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF7F8]">
          <p className="text-sm text-gray-500">Loading vendor dashboard...</p>
        </div>
      }
    >
      <VendorLayoutContent>{children}</VendorLayoutContent>
    </Suspense>
  );
}
