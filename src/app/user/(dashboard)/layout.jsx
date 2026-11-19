import UserDashboardLayout from "@/Components/user/UserDashboardLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
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
    <UserDashboardLayout user={session.user}>{children} </UserDashboardLayout>
  );
}
