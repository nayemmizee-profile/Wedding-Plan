"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          throw new Error("Session ID not found");
        }

        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Payment verification failed");
        }

        if (cancelled) return;

        toast.success("Premium activated successfully!");

        router.replace("/vendor/dashboard");
      } catch (error) {
        console.error("Payment verification error:", error);

        if (!cancelled) {
          toast.error(error.message);
          setLoading(false);
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {loading ? (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

            <h2 className="text-xl font-semibold">Verifying Your Payment...</h2>

            <p>Please wait while we activate your Premium account.</p>
          </>
        ) : (
          <h2 className="text-xl font-semibold text-red-600">
            Payment verification failed.
          </h2>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <h2 className="text-xl font-semibold">Loading Payment Status...</h2>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
