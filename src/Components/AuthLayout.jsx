"use client";
import { CalendarHeart, Camera, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children, page = "login" }) {
  const isRegister = page === "register";

  return (
    <main className="min-h-screen bg-[#fff9f8] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-rose-100/70 grid lg:grid-cols-2">
        {/* Left Visual Section */}
        <section className="relative hidden lg:flex min-h-[750px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#9d344f] via-[#c65d75] to-[#e9a1a9] p-12 text-white">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[1px] border-white/20" />
          <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full border-[1px] border-white/20" />

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold"
            >
              <Heart className="fill-white" size={27} />
              WedPlan
            </Link>
          </div>

          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Sparkles size={30} />
            </div>

            <h1 className="max-w-md text-5xl font-bold leading-tight">
              {isRegister
                ? "Your beautiful journey starts here."
                : "Every beautiful wedding starts with a plan."}
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-white/85">
              {isRegister
                ? "Join WedPlan and make your dream wedding journey simple, beautiful and memorable."
                : "Discover trusted vendors, organize your plans and create memories that last forever."}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <CalendarHeart size={17} />
                Smart Planning
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <Camera size={17} />
                Trusted Vendors
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-white/70">
            © {new Date().getFullYear()} WedPlan. Made with love.
          </p>
        </section>

        {/* Right Form Section */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-2xl font-bold text-[#b64f68]"
              >
                <Heart className="fill-[#b64f68]" size={25} />
                WedPlan
              </Link>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
