"use client";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Image as ImageIcon,
  Loader2,
  Lock,
  Mail,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthLayout from "@/Components/AuthLayout";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password)) {
      setError("Password must contain uppercase and lowercase letters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.image.trim() || undefined,
        role,
        callbackURL: "/login",
      });

      if (authError) {
        setError(authError.message || "Registration failed. Please try again.");
        return;
      }

      console.log("Registration successful:", data);

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect",
      });
    } catch (err) {
      console.error("Google signup error:", err);
      setError("Google registration failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#c45c75] focus:bg-white focus:ring-2 focus:ring-rose-100";

  return (
    <AuthLayout page="register">
      <div>
        <div className="mb-7">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#c45c75]">
            <Heart size={25} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Create an account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Join WedPlan and start planning something beautiful.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-semibold text-gray-700">
            I want to join as
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                role === "user"
                  ? "border-[#c45c75] bg-rose-50 text-[#b64f68]"
                  : "border-gray-200 text-gray-500 hover:border-rose-200"
              }`}
            >
              <UserRound size={19} />
              User
            </button>

            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                role === "vendor"
                  ? "border-[#c45c75] bg-rose-50 text-[#b64f68]"
                  : "border-gray-200 text-gray-500 hover:border-rose-200"
              }`}
            >
              <Store size={19} />
              Vendor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
                autoComplete="name"
                required
              />
            </div>
          </div>

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

          {/* Profile Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Profile Image URL
              <span className="ml-1 text-xs font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <div className="relative">
              <ImageIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

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
                placeholder="Create a password"
                className={`${inputClass} pr-12`}
                autoComplete="new-password"
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

            <p className="mt-1 text-xs text-gray-400">
              At least 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`${inputClass} pr-12`}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="mt-1 accent-[#c45c75]"
            />

            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-semibold text-[#b64f68] hover:underline"
              >
                Terms & Conditions
              </Link>
            </span>
          </label>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={17} />
              {success}
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
                <Loader2 className="animate-spin" size={19} />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
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

        <p className="mt-7 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#b64f68] hover:underline"
          >
            Sign in
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
