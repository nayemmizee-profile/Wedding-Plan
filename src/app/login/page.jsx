"use client";

import AuthLayout from "@/Components/AuthLayout";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const redirectByRole = (accountType) => {
    if (accountType === "vendor") {
      router.replace("/vendor/dashboard");
      return;
    }

    if (accountType === "user") {
      router.replace("/user/dashboard");
      return;
    }

    setError("Your account does not have a valid account type.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // 1. Login
      const { error: authError } = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        return;
      }

      // 2. Get session
      const { data: sessionData, error: sessionError } =
        await authClient.getSession();

      if (sessionError || !sessionData?.user) {
        setError("Unable to retrieve your account information.");
        return;
      }

      const user = sessionData.user;

      console.log("Login successful:", user);

      // 3. Check Admin from server
      const adminResponse = await fetch("/api/auth/check-admin", {
        method: "GET",
        cache: "no-store",
      });

      const adminData = await adminResponse.json();

      if (!adminResponse.ok || !adminData.success) {
        setError("Unable to verify your account permissions.");
        return;
      }

      // 4. Admin has priority
      if (adminData.isAdmin) {
        router.replace("/admin");
        return;
      }

      // 5. Vendor or User
      redirectByRole(user.accountType);
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect",
      });
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#c45c75] focus:bg-white focus:ring-2 focus:ring-rose-100";

  return (
    <AuthLayout page="login">
      <div>
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#c45c75]">
            <Heart size={25} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue your wedding journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#b64f68] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`${inputClass} pr-12`}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bd526c] py-3.5 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-[#a9435c] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 size={19} className="animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#b64f68] hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
        transform="translate(0 4)"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.47-4.76 7.16l7.73 6C44.42 37.86 46.98 31.67 46.98 24.55Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
        transform="translate(0 4)"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}
