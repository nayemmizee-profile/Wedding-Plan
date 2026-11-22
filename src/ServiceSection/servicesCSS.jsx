"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flower2, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="overflow-hidden bg-[#FBF7F2] px-5 py-20 sm:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[30px] bg-[#F1E5DD]"
      >
        <div className="grid items-center lg:grid-cols-2">
          {/* Left Content */}

          <div className="relative z-10 px-7 py-16 sm:px-12 lg:px-16 lg:py-24">
            <motion.div
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="mb-7 inline-flex rounded-full bg-white p-4 text-[#A66B72] shadow-sm"
            >
              <Heart size={25} />
            </motion.div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[4px] text-[#A66B72]">
              Your Love Story Begins Here
            </p>

            <h2 className="font-serif text-4xl leading-[1.2] text-[#513B3B] sm:text-5xl lg:text-[62px]">
              Every Love Story
              <span className="block italic text-[#B77C83]">Deserves a</span>
              Beautiful Beginning.
            </h2>

            <p className="mt-7 max-w-lg text-sm leading-8 text-[#806B68] sm:text-base">
              Your wedding day is more than an event. It's a beautiful memory
              you'll cherish forever. Discover extraordinary venues, talented
              photographers and trusted wedding professionals to make your dream
              celebration come true.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/#services"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#A66B72] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#A66B72]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#8D565F]"
              >
                Find Your Wedding Vendors
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#CDA9A4] px-7 py-4 text-sm font-semibold text-[#79575A] transition hover:bg-white/60"
              >
                Join Our Community
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-xs font-medium text-[#967B76]">
              <span className="flex items-center gap-2">
                <Heart size={15} className="text-[#B77C83]" />
                Made With Love
              </span>

              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#B77C83]" />
                Beautiful Memories
              </span>
            </div>
          </div>

          {/* Right Image */}

          <div className="relative min-h-[420px] overflow-hidden sm:min-h-[550px] lg:min-h-[680px]">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"
              alt="Romantic wedding celebration"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#513B3B]/30 via-transparent to-transparent" />

            {/* Floating Heart */}

            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-8 top-10 rounded-full bg-white/90 p-4 text-[#B77C83] shadow-xl backdrop-blur"
            >
              <Heart size={25} fill="currentColor" />
            </motion.div>

            {/* Wedding Quote */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-8 left-6 right-6 rounded-2xl border border-white/40 bg-white/85 p-6 text-center shadow-xl backdrop-blur-md sm:bottom-12 sm:left-10 sm:right-10"
            >
              <Flower2 size={22} className="mx-auto mb-3 text-[#B77C83]" />

              <p className="font-serif text-2xl italic text-[#684D4D]">
                "Together is a beautiful place to be."
              </p>

              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[3px] text-[#A77C7B]">
                Forever Starts Today
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative Flowers */}

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="pointer-events-none absolute -bottom-12 -left-12 text-[#B77C83]/10"
        >
          <Flower2 size={180} />
        </motion.div>
      </motion.div>
    </section>
  );
}
