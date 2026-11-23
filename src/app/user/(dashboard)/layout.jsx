import UserDashboardLayout from "@/Components/user/UserDashboardLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function UserLayoutContent({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toLowerCase() !== "user") {
    redirect("/vendor/dashboard");
  }

  return (
    <UserDashboardLayout user={session.user}>{children}</UserDashboardLayout>
  );
}

export default function Layout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF7F8]">
          <p className="text-sm text-gray-500">Loading user dashboard...</p>
        </div>
      }
    >
      <UserLayoutContent>{children}</UserLayoutContent>
    </Suspense>
  );
}
