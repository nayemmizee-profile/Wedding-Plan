import VendorHeader from "@/Components/vendor/VendorHeader";
import VendorSidebar from "@/Components/vendor/VendorSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function VendorLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "vendor") {
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
