"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="bg-[#FAFAF8] px-5 pb-24 sm:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[32px] bg-[#244F42] px-6 py-16 text-center text-white sm:px-12 sm:py-20 lg:py-24"
      >
        {/* Background Decoration */}

        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/[0.04]" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[45px] border-white/[0.04]" />

        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute right-[15%] top-16 hidden text-[#BBDCCB]/30 md:block"
        >
          <Sparkles size={55} />
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-16 left-[15%] hidden text-[#BBDCCB]/30 md:block"
        >
          <Heart size={48} />
        </motion.div>

        {/* Content */}

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#C6E5D4] backdrop-blur">
            <CalendarDays size={32} />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-[#BBDCCB]">
            Make It Memorable
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your Perfect Event
            <span className="block text-[#BBDCCB]">Starts Right Here.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/70 sm:text-base">
            From stunning venues to amazing professionals, discover everything
            you need to make your next celebration truly unforgettable.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/#services"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-[#244F42] transition-all duration-300 hover:scale-105 hover:bg-[#EAF3ED]"
            >
              Explore Services
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              Join Our Community
              <Sparkles size={18} />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#BBDCCB]" />
              Trusted Professionals
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#BBDCCB]" />
              Easy Booking
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#BBDCCB]" />
              Memorable Experiences
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
