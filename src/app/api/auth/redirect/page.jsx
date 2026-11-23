"use client";

import { authClient } from "@/lib/auth-client";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirectPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const accountType = session.user.accountType;

    if (accountType === "vendor") {
      router.replace("/vendor/dashboard");
    } else {
      router.replace("/user/dashboard");
    }
  }, [session, isPending, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fff9f8]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-[#bd526c]">
        <Heart size={32} className="fill-current" />
      </div>

      <Loader2 size={30} className="animate-spin text-[#bd526c]" />

      <h2 className="mt-4 text-lg font-semibold text-gray-800">
        Preparing your account...
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Please wait while we redirect you.
      </p>
    </main>
  );
}
