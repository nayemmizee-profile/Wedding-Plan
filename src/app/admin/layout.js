import { isAdmin } from "@/lib/adminAuth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AdminHeader from "@/Components/admin/AdminHeader";
import AdminSidebar from "@/Components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | Wedding Planning",
};

// Allow this route to use blocking dynamic rendering
export const instant = false;

export default async function AdminLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (!isAdmin(session.user.id)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />

          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
